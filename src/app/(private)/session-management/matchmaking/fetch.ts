'use server';
import { callAuthenticatedApi } from '@/lib/api';
import { SessionFinishResponse, MatchmakingDataResponse } from '@/types/session-management';
import { API_ENDPOINTS } from '@/constants/endpoints';
import { revalidateTag } from 'next/cache';

export async function getCurrentMatchmakingQueue(groupId: number): Promise<{ success: boolean; queue: MatchmakingDataResponse[]; error?: string }> {
  const data = await callAuthenticatedApi<{ queue: MatchmakingDataResponse[] }>({
    method: 'GET',
    url: API_ENDPOINTS.ADMIN.MATCHMAKING_GROUP_QUEUE(groupId),
  });
  if (!data) {
    return { success: false, queue: [], error: 'Failed to fetch matchmaking queue' };
  }
  const queue = Array.isArray(data.queue) ? data.queue : [];
  return { success: true, queue };
}

export async function SessionFinish(sessionId: number, groupId: number): Promise<{ success: boolean; message?: string; error?: string; result?: SessionFinishResponse }> {
  const data = await callAuthenticatedApi<SessionFinishResponse>({
    method: 'POST',
    url: API_ENDPOINTS.ADMIN.MATCHMAKING_SESSION_FINISH(sessionId),
    body: { group_id: groupId },
  });
  if (!data) {
    return { success: false, error: 'Failed to finish matchmaking' };
  }

  const isSuccess = data.ticket_status === 'COMPLETED';
  const message = isSuccess ? 'マッチメイキング完了' : `マッチメイキング失敗: ${data.ticket_status}`;
  const error = !isSuccess ? (data.error || `Status: ${data.ticket_status}`) : undefined;

  return {
    success: isSuccess,
    message,
    error,
    result: data
  };
}

export async function deleteMatchmakingSession(sessionId: number, groupId: number): Promise<{ success: boolean; error?: string }> {
  const data = await callAuthenticatedApi<{ success: boolean; error?: string }>({
    method: 'DELETE',
    url: API_ENDPOINTS.ADMIN.MATCHMAKING_SESSION_DELETE(sessionId, groupId),
  });
  if (!data || data.success === false) {
    return { success: false, error: data?.error || 'Failed to delete matchmaking session' };
  }
  revalidateTag('sessions');
  return { success: true };
}
