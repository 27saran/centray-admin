'use server';
import { callAuthenticatedApi } from '@/lib/api';
import { SessionResultsResponse } from '@/types/session-management';
import { API_ENDPOINTS } from '@/constants/endpoints';

export async function startMatching(sessionId: number, groupId: number): Promise<{ success: boolean; message?: string; error?: string; result?: SessionResultsResponse }> {
  const data = await callAuthenticatedApi<{ message: string, result: SessionResultsResponse }>({
    method: 'POST',
    url: API_ENDPOINTS.ADMIN.MATCHMAKING_SESSION_FINISH(sessionId),
    body: { group_id: groupId },
  });
  if (!data) {
    return { success: false, error: 'Failed to start matching' };
  }
  return { success: true, message: data.message, result: data.result };
}