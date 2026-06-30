// src/hooks/useProfile.ts  (updated)
// ─────────────────────────────────────────────────────────────────────────────
// WHAT CHANGED:  Added `theme_color` to UserProfile interface,
// plus a `useUpdateTheme()` hook that patches theme + updates ThemeProvider.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";
import type { AxiosError } from "axios";
import { getLoginHistory, getMyProfile, updateThemeColor } from "../../api/employee/profile.api";
import { useTheme } from "../../theme";
import { getUiSession, updateUiSession } from "../../utils/uiSession";

// ── Types ───────────────────────────────────────────────────────────────────

export interface UserProfile {
  id:                   string;
  user_id:              string;
  full_legal_name:      string | null;
  nationality:          string | null;
  country_of_residence: string | null;
  date_of_birth:        string | null;
  gender:               string | null;
  profile_picture_url:  string | null;
  timezone:             string | null;
  preferred_language:   string | null;
  phone_number:         string | null;
  country_code:         string | null;
  onboarding_step:      number;
  onboarding_completed: boolean;
  theme_color:          string | null;  // ← NEW
  created_at:           string;
  updated_at:           string;
}

export interface LoginHistoryResponse {
  id:                 string;
  status:             "success" | "failed" | "blocked";
  auth_method:        string;
  ip_address:         string | null;
  city:               string | null;
  country:            string | null;
  browser:            string | null;
  os:                 string | null;
  device_type:        "desktop" | "mobile" | "tablet" | "unknown";
  failure_reason:     string | null;
  failed_attempts:    number;
  is_suspicious:      boolean;
  is_current_session: boolean;
  logged_out_at:      string | null;
  created_at:         string;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function extractMessage(e: unknown): string {
  const err = e as AxiosError<{ detail: string }>;
  return (
    err.response?.data?.detail ??
    (e instanceof Error ? e.message : "Something went wrong.")
  );
}

// ── useMyProfile ────────────────────────────────────────────────────────────

export function useMyProfile() {
  const [data,      setData]    = useState<UserProfile | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error,     setError]   = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await getMyProfile());
    } catch (e) {
      setError(extractMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  return { data, isLoading, error, refetch: load };
}

// ── useLoginHistory ─────────────────────────────────────────────────────────

export function useLoginHistory(limit = 20) {
  const [data,      setData]    = useState<LoginHistoryResponse[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error,     setError]   = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getLoginHistory({ limit });
      setData(res.items ?? []);
    } catch (e) {
      setError(extractMessage(e));
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => { void load(); }, [load]);

  return { data, isLoading, error, refetch: load };
}

// ── useUpdateTheme ──────────────────────────────────────────────────────────
// Handles: live preview → API persist → cookie sync → ThemeProvider update
// ─────────────────────────────────────────────────────────────────────────────

export function useUpdateTheme() {
  const { setThemeColor: applyTheme } = useTheme();
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  const save = useCallback(async (hex: string) => {
    // 1. Live preview immediately
    applyTheme(hex);

    // 2. Persist to backend
    setSaving(true);
    setError(null);
    try {
      await updateThemeColor(hex);

      // 3. Sync to ui_session cookie so it survives page refresh
      const session = getUiSession();
      if (session) {
        updateUiSession({ ...session, theme_color: hex });
      }
    } catch (e) {
      setError(extractMessage(e));
      // Revert preview on failure
      const fallback = getUiSession()?.theme_color ?? "#4f46e5";
      applyTheme(fallback);
    } finally {
      setSaving(false);
    }
  }, [applyTheme]);

  return { save, saving, error };
}