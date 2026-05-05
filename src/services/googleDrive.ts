// src/services/googleDrive.ts — Google Drive Service (OAuth2 + Picker + Drive API v3)
// Client-side only — scope: drive.file (chỉ truy cập file do app tạo)

import { validateFileUpload } from "@/lib/security";

// ============================================================
// Types
// ============================================================

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  webViewLink: string;
  thumbnailLink?: string;
  modifiedTime: string;
}

export interface PickerResult {
  id: string;
  name: string;
  mimeType: string;
  url: string;
}

// Storage keys
const GCLOUD_CLIENT_ID_KEY = "gcloud_client_id";
const GCLOUD_API_KEY = "gcloud_api_key";
const DRIVE_ROOT_FOLDER_KEY = "drive_root_folder_id";

// In-memory token (NOT persisted)
let accessToken: string | null = null;
let tokenExpiresAt = 0;

// ============================================================
// Config Management
// ============================================================

export function getGoogleClientId(): string | null {
  return localStorage.getItem(GCLOUD_CLIENT_ID_KEY);
}

export function setGoogleClientId(id: string): void {
  localStorage.setItem(GCLOUD_CLIENT_ID_KEY, id);
}

export function getGoogleApiKey(): string | null {
  return localStorage.getItem(GCLOUD_API_KEY);
}

export function setGoogleApiKey(key: string): void {
  localStorage.setItem(GCLOUD_API_KEY, key);
}

export function getDriveRootFolderId(): string | null {
  return localStorage.getItem(DRIVE_ROOT_FOLDER_KEY);
}

export function setDriveRootFolderId(id: string): void {
  localStorage.setItem(DRIVE_ROOT_FOLDER_KEY, id);
}

// ============================================================
// OAuth2 via Google Identity Services
// ============================================================

export function isDriveConnected(): boolean {
  return !!accessToken && Date.now() < tokenExpiresAt;
}

export function disconnectDrive(): void {
  accessToken = null;
  tokenExpiresAt = 0;
}

export async function connectDrive(): Promise<boolean> {
  const clientId = getGoogleClientId();
  if (!clientId) throw new Error("Chưa cấu hình Google Cloud Client ID. Vui lòng nhập trong Cấu hình AI.");

  return new Promise<boolean>((resolve, reject) => {
    // Check if GIS loaded
    if (typeof google === "undefined" || !google?.accounts?.oauth2) {
      reject(new Error("Google Identity Services chưa tải. Vui lòng reload trang."));
      return;
    }

    const tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: "https://www.googleapis.com/auth/drive.file",
      callback: (response: { access_token?: string; expires_in?: number; error?: string }) => {
        if (response.error) {
          reject(new Error(`OAuth error: ${response.error}`));
          return;
        }
        if (response.access_token) {
          accessToken = response.access_token;
          tokenExpiresAt = Date.now() + (response.expires_in ?? 3600) * 1000;
          resolve(true);
        }
      },
    });

    tokenClient.requestAccessToken();
  });
}

// ============================================================
// Drive API Helpers
// ============================================================

function driveHeaders(): Record<string, string> {
  if (!accessToken) throw new Error("Chưa kết nối Google Drive.");
  return {
    Authorization: `Bearer ${accessToken}`,
  };
}

async function driveRequest(path: string, options?: RequestInit): Promise<Response> {
  const res = await fetch(`https://www.googleapis.com/drive/v3${path}`, {
    ...options,
    headers: { ...driveHeaders(), ...options?.headers },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? `Drive API error: ${res.status}`);
  }
  return res;
}

// ============================================================
// Folder Management
// ============================================================

/** Create a folder on Drive. Returns folderId. */
export async function createFolder(name: string, parentId?: string): Promise<string> {
  const metadata: Record<string, unknown> = {
    name,
    mimeType: "application/vnd.google-apps.folder",
  };
  if (parentId) metadata.parents = [parentId];

  const res = await fetch("https://www.googleapis.com/drive/v3/files", {
    method: "POST",
    headers: { ...driveHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(metadata),
  });

  if (!res.ok) throw new Error("Không thể tạo folder trên Drive.");
  const data = await res.json();
  return data.id;
}

/** Ensure the root folder structure exists: Teacher Portfolio / {subfolder} */
export async function ensureRootFolder(): Promise<string> {
  let rootId = getDriveRootFolderId();
  if (rootId) return rootId;

  // Create root
  rootId = await createFolder("Teacher Portfolio");
  setDriveRootFolderId(rootId);

  // Create subfolders
  await createFolder("Giáo án", rootId);
  await createFolder("Văn bản", rootId);
  await createFolder("Học sinh", rootId);
  await createFolder("Uploads", rootId);

  return rootId;
}

/** Find subfolder by name under root */
export async function findSubfolder(name: string): Promise<string | null> {
  const rootId = getDriveRootFolderId();
  if (!rootId) return null;

  const query = `'${rootId}' in parents and name='${name}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
  const res = await driveRequest(`/files?q=${encodeURIComponent(query)}&fields=files(id,name)`);
  const data = await res.json();
  return data.files?.[0]?.id ?? null;
}

// ============================================================
// File Operations
// ============================================================

/** Upload a file to Google Drive */
export async function uploadFile(
  file: File,
  subfolder: string = "Uploads",
): Promise<DriveFile> {
  // Validate
  const validation = validateFileUpload(file, {
    maxSizeMB: 15,
    allowedExtensions: ["pdf", "doc", "docx", "xls", "xlsx", "csv", "ppt", "pptx", "txt", "jpg", "png"],
  });
  if (!validation.valid) throw new Error(validation.error);

  // Ensure folder
  await ensureRootFolder();
  let folderId = await findSubfolder(subfolder);
  if (!folderId) {
    const rootId = getDriveRootFolderId()!;
    folderId = await createFolder(subfolder, rootId);
  }

  // Multipart upload
  const metadata = JSON.stringify({
    name: file.name,
    parents: [folderId],
  });

  const form = new FormData();
  form.append("metadata", new Blob([metadata], { type: "application/json" }));
  form.append("file", file);

  const res = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,size,webViewLink,thumbnailLink,modifiedTime",
    {
      method: "POST",
      headers: driveHeaders(),
      body: form,
    },
  );

  if (!res.ok) throw new Error("Không thể upload file lên Google Drive.");
  return await res.json();
}

/** List files in a subfolder */
export async function listFiles(subfolder?: string): Promise<DriveFile[]> {
  const rootId = getDriveRootFolderId();
  if (!rootId) return [];

  let parentId = rootId;
  if (subfolder) {
    const folderId = await findSubfolder(subfolder);
    if (!folderId) return [];
    parentId = folderId;
  }

  const query = `'${parentId}' in parents and trashed=false`;
  const res = await driveRequest(
    `/files?q=${encodeURIComponent(query)}&fields=files(id,name,mimeType,size,webViewLink,thumbnailLink,modifiedTime)&orderBy=modifiedTime desc`,
  );
  const data = await res.json();
  return data.files ?? [];
}

/** Download a file by ID → returns Blob */
export async function downloadFile(fileId: string): Promise<Blob> {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: driveHeaders(),
  });
  if (!res.ok) throw new Error("Không thể tải file từ Google Drive.");
  return await res.blob();
}

/** Delete a file by ID */
export async function deleteFile(fileId: string): Promise<void> {
  await driveRequest(`/files/${fileId}`, { method: "DELETE" });
}

/** Get shareable view link */
export async function getViewLink(fileId: string): Promise<string> {
  const res = await driveRequest(`/files/${fileId}?fields=webViewLink`);
  const data = await res.json();
  return data.webViewLink;
}

// ============================================================
// Google Picker
// ============================================================

export async function openPicker(): Promise<PickerResult[]> {
  const apiKey = getGoogleApiKey();
  if (!apiKey) throw new Error("Chưa cấu hình Google Cloud API Key.");
  if (!accessToken) throw new Error("Chưa kết nối Google Drive. Vui lòng kết nối trước.");

  return new Promise<PickerResult[]>((resolve, reject) => {
    if (typeof gapi === "undefined") {
      reject(new Error("Google API chưa tải. Vui lòng reload trang."));
      return;
    }

    gapi.load("picker", () => {
      try {
        const view = new google.picker.DocsView(google.picker.ViewId.DOCS);
        view.setIncludeFolders(true);

        const picker = new google.picker.PickerBuilder()
          .addView(view)
          .setOAuthToken(accessToken!)
          .setDeveloperKey(apiKey)
          .setLocale("vi")
          .setTitle("Chọn file từ Google Drive")
          .setCallback((data: { action: string; docs?: Array<{ id: string; name: string; mimeType: string; url: string }> }) => {
            if (data.action === google.picker.Action.PICKED && data.docs) {
              resolve(data.docs.map((d) => ({ id: d.id, name: d.name, mimeType: d.mimeType, url: d.url })));
            } else if (data.action === google.picker.Action.CANCEL) {
              resolve([]);
            }
          })
          .build();

        picker.setVisible(true);
      } catch (err) {
        reject(err);
      }
    });
  });
}
