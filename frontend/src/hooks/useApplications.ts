// src/hooks/useApplications.ts
import { useState, useEffect, useCallback } from 'react';
import type { AxiosError } from 'axios';
import type { VisaType } from '../types/application.types';
import type {
  Application,
  ApplicationListResponse,
  ApplicationStatus,
  StatusHistory,
  Task,
} from '../types/application.types';
import {
  listApplications,
  getApplication,
  listTasks,
  listStatusHistory,
  listVisaTypes,
} from '../api/applications.api';

function extractMessage(e: unknown): string {
  const err = e as AxiosError<{ detail: string }>;
  return (
    err.response?.data?.detail ??
    (e instanceof Error ? e.message : 'Something went wrong. Please try again.')
  );
}

// ── List all applications + KPI ───────────────────────────────────────────────
export function useApplications(params?: {
  status?: ApplicationStatus;
  visa_type_id?: string;
  limit?: number;
  offset?: number;
}) {
  const [data, setData]         = useState<ApplicationListResponse | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError]       = useState<string | null>(null);

  const key = JSON.stringify(params);

  // const load = useCallback(async () => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     setData(await listApplications(params));
  //   } catch (e) {
  //     setError(extractMessage(e));
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listApplications(params);
      // console.log("🟢 Applications API response:", result);        // ← ADD
      // console.log("🟢 Items:", result?.items);                     // ← ADD
      // console.log("🟢 KPI:", { total: result?.total, in_progress: result?.in_progress, action_needed: result?.action_needed, approved: result?.approved }); // ← ADD
      setData(result);
    } catch (e) {
      console.error("🔴 Applications API error:", e);              // ← ADD
      setError(extractMessage(e));
    } finally {
      setLoading(false);
    }
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { void load(); }, [load]);

  return { data, isLoading, error, refetch: load };
}

// ── Single application ────────────────────────────────────────────────────────
export function useApplication(id: string | undefined) {
  const [data, setData]         = useState<Application | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError]       = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      setData(await getApplication(id));
    } catch (e) {
      setError(extractMessage(e));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { void load(); }, [load]);

  return { data, isLoading, error, refetch: load };
}

// ── Tasks checklist ───────────────────────────────────────────────────────────
export function useApplicationTasks(applicationId: string | undefined) {
  const [data, setData]         = useState<Task[] | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError]       = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!applicationId) return;
    setLoading(true);
    setError(null);
    try {
      setData(await listTasks(applicationId));
    } catch (e) {
      setError(extractMessage(e));
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  useEffect(() => { void load(); }, [load]);

  return { data, setData, isLoading, error, refetch: load };
}

// ── Status history timeline ───────────────────────────────────────────────────
export function useStatusHistory(applicationId: string | undefined) {
  const [data, setData]         = useState<StatusHistory[] | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError]       = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!applicationId) return;
    setLoading(true);
    setError(null);
    try {
      setData(await listStatusHistory(applicationId));
    } catch (e) {
      setError(extractMessage(e));
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  useEffect(() => { void load(); }, [load]);

  return { data, isLoading, error, refetch: load };
}


export function useRecentActivity() {
  const [data, setData]         = useState<StatusHistory[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError]       = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Get last 3 applications then their latest status history
      const list = await listApplications({ limit: 3 });
      const items = list.items ?? [];
      // const histories = await Promise.all(
      //   items.map(app => listStatusHistory(app.id).catch(() => []))
      // );
      const histories = await Promise.all(
      items.map((app: Application) => listStatusHistory(app.id).catch(() => []))
      );
      // Flatten and sort by created_at desc, take last 4
      const all = histories.flat() as StatusHistory[];
      all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setData(all.slice(0, 4));
    } catch (e) {
      setError(extractMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  return { data, isLoading, error };
}

// Add this hook at the bottom of the file
export function useVisaTypes() {
  const [data, setData]         = useState<VisaType[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError]       = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listVisaTypes();
      setData(Array.isArray(res) ? res : (res as any).items ?? []);
    } catch (e) {
      setError(extractMessage(e));
      setData([]);   // ← always reset to [] on error, never undefined
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  return { data, isLoading, error, refetch: load };
}