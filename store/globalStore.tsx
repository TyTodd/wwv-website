// store/useFormDataStore.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FileData {
  name: string;
  size: number;
  type: string;
  data: string; // Base64 or Blob URL representation
}

interface FormDataStateType {
  [key: string]: string | string[] | boolean | undefined | File;
  first_name?: string;
  last_name?: string;
  email?: string;
  university?: string;
  linkedin_url?: string;
  background?: string;
  resume?: File;
  resumeName?: string;
  links?: string;
  work_authorization?: boolean;
  visa_sponsorship?: boolean;
  opportunity_interests?: string[];
  position_interests?: string[];
  area_interests?: string[];
  last_updated?: string;
  saved?: boolean;
}

interface GlobalStore {
  globalStore: FormDataStateType;
  setGlobalStore: (data: Partial<FormDataStateType>) => void;
  resetGlobalStore: () => void;
}

export const useGlobalStore = create<GlobalStore>()(
  persist(
    (set) => ({
      globalStore: {},
      setGlobalStore: (data) =>
        set((state) => ({
          globalStore: {
            ...state.globalStore,
            ...data,
            last_updated: new Date().toISOString(), // ✅ Store last updated as ISO string
          },
        })),
      resetGlobalStore: () =>
        set({
          globalStore: {},
        }),
    }),
    {
      name: "global-store",
    }
  )
);
