'use server';

import { callAuthenticatedApi } from '@/lib/api';
import { GetAvailableGroupsResponse, SessionResponse } from '@/types/session-management';
import { revalidateTag } from 'next/cache';
import { API_ENDPOINTS } from '@/constants/endpoints';

export async function createMatchmakingSession(
  session_name: string,
  device_set_id: number,
  group_id: number
): Promise<{ success: boolean; data?: SessionResponse; error?: string }> {
  const data = await callAuthenticatedApi<SessionResponse>({
    method: 'POST',
    url: API_ENDPOINTS.ADMIN.MATCHMAKING_SESSIONS,
    body: { session_name, device_set_id, group_id },
  });
  if (!data) {
    return { success: false, error: 'Failed to create matchmaking session' };
  }
  revalidateTag('sessions');
  return { success: true, data };
}

export async function getAvailableGroups(): Promise<GetAvailableGroupsResponse[]> {
  const data = await callAuthenticatedApi<GetAvailableGroupsResponse[]>({
    method: 'GET',
    url: API_ENDPOINTS.ADMIN.GROUPS_AVAILABLE,
  });
  return data ?? [];
}
