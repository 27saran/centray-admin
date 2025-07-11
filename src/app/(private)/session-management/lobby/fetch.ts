'use server';

import { callAuthenticatedApi } from '@/lib/api';
import { SessionResponse } from '@/types/session-management';
import { revalidateTag } from 'next/cache';

export async function createMatchmakingSession(
  session_name: string,
  device_set_id: number,
  group_id: number
): Promise<{ success: boolean; data?: SessionResponse; error?: string }> {
  const data = await callAuthenticatedApi<SessionResponse>({
    method: 'POST',
    url: '/api/admin/matchmaking/sessions',
    body: { session_name, device_set_id, group_id },
  });
  if (!data) {
    return { success: false, error: 'Failed to create matchmaking session' };
  }
  revalidateTag('sessions');
  return { success: true, data };
}
