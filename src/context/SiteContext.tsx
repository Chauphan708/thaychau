// src/context/SiteContext.tsx — State manager: Supabase persistence + localStorage fallback
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { siteConfig as defaultConfig } from "@/data/siteConfig";
import type { SiteConfig } from "@/data/siteConfig";
import {
  profileBio as defaultBio,
  philosophies as defaultPhilosophies,
  milestones as defaultMilestones,
  certificates as defaultCertificates,
  skills as defaultSkills,
  funFacts as defaultFunFacts,
} from "@/data/profileData";
import type { TeachingPhilosophy, MilestoneItem, CertificateItem, SkillItem, FunFact } from "@/data/profileData";
import { resources as defaultResources } from "@/data/resources";
import type { ResourceItem } from "@/data/resources";
import { goldenFaces as defaultGoldenFaces } from "@/data/goldenFaces";
import type { GoldenFace } from "@/data/goldenFaces";
import { announcements as defaultAnnouncements } from "@/data/announcements";
import type { Announcement } from "@/data/announcements";
import { galleryImages as defaultGallery } from "@/data/gallery";
import type { GalleryImage } from "@/data/gallery";
import { parentNotices as defaultNotices, weeklySchedule as defaultSchedule } from "@/data/weeklySchedule";
import type { ParentNotice, ScheduleSlot } from "@/data/weeklySchedule";
import { loadAllSections, saveSection } from "@/services/cmsStore";
import type { CustomPageRow } from "@/services/cmsStore";
import { loadCustomPages } from "@/services/cmsStore";

// ============================================================
// Types
// ============================================================

interface SiteContextType {
  // Loading state
  isLoading: boolean;

  // Config
  config: SiteConfig;
  setConfig: (c: SiteConfig) => void;

  // Profile
  bio: string;
  setBio: (b: string) => void;
  philosophies: TeachingPhilosophy[];
  setPhilosophies: (p: TeachingPhilosophy[]) => void;
  milestones: MilestoneItem[];
  setMilestones: (m: MilestoneItem[]) => void;
  certificates: CertificateItem[];
  setCertificates: (c: CertificateItem[]) => void;
  skills: SkillItem[];
  setSkills: (s: SkillItem[]) => void;
  funFacts: FunFact[];
  setFunFacts: (f: FunFact[]) => void;

  // Content
  resources: ResourceItem[];
  setResources: (r: ResourceItem[]) => void;
  goldenFaces: GoldenFace[];
  setGoldenFaces: (g: GoldenFace[]) => void;
  announcements: Announcement[];
  setAnnouncements: (a: Announcement[]) => void;
  gallery: GalleryImage[];
  setGallery: (g: GalleryImage[]) => void;
  parentNotices: ParentNotice[];
  setParentNotices: (n: ParentNotice[]) => void;
  weeklySchedule: ScheduleSlot[];
  setWeeklySchedule: (s: ScheduleSlot[]) => void;

  // Custom pages
  customPages: CustomPageRow[];
  setCustomPages: (p: CustomPageRow[]) => void;

  // Actions
  resetData: () => void;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

// ============================================================
// Helpers: localStorage fallback
// ============================================================

function loadLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`tp_${key}`);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`tp_${key}`, JSON.stringify(value));
  } catch {
    /* quota exceeded — ignore */
  }
}

// ============================================================
// Provider
// ============================================================

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  // --- State with localStorage defaults ---
  const [config, setConfigState] = useState<SiteConfig>(() => loadLocal("config", defaultConfig));
  const [bio, setBioState] = useState(() => loadLocal("profile_bio", defaultBio));
  const [philosophies, setPhilosophiesState] = useState(() => loadLocal("profile_philosophies", defaultPhilosophies));
  const [milestones, setMilestonesState] = useState(() => loadLocal("profile_milestones", defaultMilestones));
  const [certificates, setCertificatesState] = useState(() => loadLocal("profile_certificates", defaultCertificates));
  const [skills, setSkillsState] = useState(() => loadLocal("profile_skills", defaultSkills));
  const [funFacts, setFunFactsState] = useState(() => loadLocal("profile_funfacts", defaultFunFacts));
  const [resources, setResourcesState] = useState(() => loadLocal("resources", defaultResources));
  const [goldenFaces, setGoldenFacesState] = useState(() => loadLocal("golden_faces", defaultGoldenFaces));
  const [announcements, setAnnouncementsState] = useState(() => loadLocal("announcements", defaultAnnouncements));
  const [gallery, setGalleryState] = useState(() => loadLocal("gallery", defaultGallery));
  const [parentNotices, setParentNoticesState] = useState(() => loadLocal("parent_notices", defaultNotices));
  const [weeklySchedule, setWeeklyScheduleState] = useState(() => loadLocal("schedule", defaultSchedule));
  const [customPages, setCustomPagesState] = useState<CustomPageRow[]>(() => loadLocal("custom_pages", []));

  // --- Load from Supabase on mount ---
  const didLoad = useRef(false);
  useEffect(() => {
    if (didLoad.current) return;
    didLoad.current = true;

    (async () => {
      try {
        const [sections, pages] = await Promise.all([loadAllSections(), loadCustomPages()]);

        if (Object.keys(sections).length > 0) {
          if (sections.config) setConfigState(sections.config as SiteConfig);
          if (sections.profile_bio) setBioState((sections.profile_bio as { bio: string }).bio ?? defaultBio);
          if (sections.profile_philosophies) setPhilosophiesState(sections.profile_philosophies as TeachingPhilosophy[]);
          if (sections.profile_milestones) setMilestonesState(sections.profile_milestones as MilestoneItem[]);
          if (sections.profile_certificates) setCertificatesState(sections.profile_certificates as CertificateItem[]);
          if (sections.profile_skills) setSkillsState(sections.profile_skills as SkillItem[]);
          if (sections.profile_funfacts) setFunFactsState(sections.profile_funfacts as FunFact[]);
          if (sections.resources) setResourcesState(sections.resources as ResourceItem[]);
          if (sections.golden_faces) setGoldenFacesState(sections.golden_faces as GoldenFace[]);
          if (sections.announcements) setAnnouncementsState(sections.announcements as Announcement[]);
          if (sections.gallery) setGalleryState(sections.gallery as GalleryImage[]);
          if (sections.parent_notices) setParentNoticesState(sections.parent_notices as ParentNotice[]);
          if (sections.schedule) setWeeklyScheduleState(sections.schedule as ScheduleSlot[]);
        }

        if (pages.length > 0) setCustomPagesState(pages);
      } catch (err) {
        console.warn("[CMS] Supabase load failed, using localStorage fallback:", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // --- Debounced save to Supabase + immediate localStorage ---
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const persist = useCallback(<T,>(key: string, value: T) => {
    saveLocal(key, value);
    clearTimeout(timers.current[key]);
    timers.current[key] = setTimeout(() => {
      saveSection(key, value);
    }, 1000);
  }, []);

  // --- Setters ---
  const setConfig = useCallback((c: SiteConfig) => { setConfigState(c); persist("config", c); }, [persist]);
  const setBio = useCallback((b: string) => { setBioState(b); persist("profile_bio", { bio: b }); }, [persist]);
  const setPhilosophies = useCallback((p: TeachingPhilosophy[]) => { setPhilosophiesState(p); persist("profile_philosophies", p); }, [persist]);
  const setMilestones = useCallback((m: MilestoneItem[]) => { setMilestonesState(m); persist("profile_milestones", m); }, [persist]);
  const setCertificates = useCallback((c: CertificateItem[]) => { setCertificatesState(c); persist("profile_certificates", c); }, [persist]);
  const setSkills = useCallback((s: SkillItem[]) => { setSkillsState(s); persist("profile_skills", s); }, [persist]);
  const setFunFacts = useCallback((f: FunFact[]) => { setFunFactsState(f); persist("profile_funfacts", f); }, [persist]);
  const setResources = useCallback((r: ResourceItem[]) => { setResourcesState(r); persist("resources", r); }, [persist]);
  const setGoldenFaces = useCallback((g: GoldenFace[]) => { setGoldenFacesState(g); persist("golden_faces", g); }, [persist]);
  const setAnnouncements = useCallback((a: Announcement[]) => { setAnnouncementsState(a); persist("announcements", a); }, [persist]);
  const setGallery = useCallback((g: GalleryImage[]) => { setGalleryState(g); persist("gallery", g); }, [persist]);
  const setParentNotices = useCallback((n: ParentNotice[]) => { setParentNoticesState(n); persist("parent_notices", n); }, [persist]);
  const setWeeklySchedule = useCallback((s: ScheduleSlot[]) => { setWeeklyScheduleState(s); persist("schedule", s); }, [persist]);
  const setCustomPages = useCallback((p: CustomPageRow[]) => { setCustomPagesState(p); saveLocal("custom_pages", p); }, []);

  // --- Apply CSS variables ---
  useEffect(() => {
    document.documentElement.style.setProperty("--color-primary", config.primaryColor);
  }, [config.primaryColor]);

  // --- Reset ---
  const resetData = useCallback(() => {
    const keys = [
      "config", "profile_bio", "profile_philosophies", "profile_milestones",
      "profile_certificates", "profile_skills", "profile_funfacts",
      "resources", "golden_faces", "announcements", "gallery",
      "parent_notices", "schedule", "custom_pages",
    ];
    keys.forEach((k) => localStorage.removeItem(`tp_${k}`));
    window.location.reload();
  }, []);

  return (
    <SiteContext.Provider
      value={{
        isLoading,
        config, setConfig,
        bio, setBio,
        philosophies, setPhilosophies,
        milestones, setMilestones,
        certificates, setCertificates,
        skills, setSkills,
        funFacts, setFunFacts,
        resources, setResources,
        goldenFaces, setGoldenFaces,
        announcements, setAnnouncements,
        gallery, setGallery,
        parentNotices, setParentNotices,
        weeklySchedule, setWeeklySchedule,
        customPages, setCustomPages,
        resetData,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export const useSiteData = () => {
  const context = useContext(SiteContext);
  if (!context) throw new Error("useSiteData must be used within a SiteProvider");
  return context;
};
