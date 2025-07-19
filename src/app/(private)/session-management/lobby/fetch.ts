'use server';

import { callAuthenticatedApi } from '@/lib/api';
import { SessionResponse } from '@/types/session-management';
import { GroupDetailResponse } from '@/types/device-group';
import { revalidateTag } from 'next/cache';
import { API_ENDPOINTS } from '@/constants/endpoints';

export async function createMatchmakingSession(
  session_name: string,
  group_id: number
): Promise<{ success: boolean; data?: SessionResponse; error?: string }> {
  const data = await callAuthenticatedApi<SessionResponse>({
    method: 'POST',
    url: API_ENDPOINTS.ADMIN.MATCHMAKING_SESSIONS,
    body: { session_name, group_id },
  });
  if (!data) {
    return { success: false, error: 'Failed to create matchmaking session' };
  }
  revalidateTag('sessions');
  return { success: true, data };
}

export async function getAvailableGroups(): Promise<GroupDetailResponse[]> {
  const data = await callAuthenticatedApi<GroupDetailResponse[]>({
    method: 'GET',
    url: API_ENDPOINTS.ADMIN.GROUPS_AVAILABLE,
  });
  return data ?? [];
}
