import { useState, useCallback } from "react";
import {
  isDriveConnected,
  connectDrive,
  disconnectDrive,
  uploadFile,
  listFiles,
  downloadFile,
  openPicker,
  ensureRootFolder,
} from "@/services/googleDrive";
import type { DriveFile, PickerResult } from "@/services/googleDrive";

export function useGoogleDrive() {
  const [connected, setConnected] = useState(isDriveConnected());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const ok = await connectDrive();
      if (ok) {
        await ensureRootFolder();
        setConnected(true);
      }
      return ok;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi kết nối Google Drive");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    disconnectDrive();
    setConnected(false);
  }, []);

  const upload = useCallback(async (file: File, subfolder?: string): Promise<DriveFile | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await uploadFile(file, subfolder);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi upload file");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const list = useCallback(async (subfolder?: string): Promise<DriveFile[]> => {
    setLoading(true);
    setError(null);
    try {
      return await listFiles(subfolder);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi đọc danh sách file");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const download = useCallback(async (fileId: string): Promise<Blob | null> => {
    setLoading(true);
    setError(null);
    try {
      return await downloadFile(fileId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tải file");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const pick = useCallback(async (): Promise<PickerResult[]> => {
    setError(null);
    try {
      return await openPicker();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi mở Google Drive Picker");
      return [];
    }
  }, []);

  return { connected, loading, error, connect, disconnect, upload, list, download, pick };
}
