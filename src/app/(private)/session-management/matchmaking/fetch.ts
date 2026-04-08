'use server';
import { callAuthenticatedApi } from '@/lib/api';
import { SessionFinishResponse, MatchmakingDataResponse } from '@/types/session-management';
import { API_ENDPOINTS } from '@/constants/endpoints';
import { revalidateTag } from 'next/cache';

export async function getCurrentMatchmakingQueue(sessionId: number): Promise<{ success: boolean; queue: MatchmakingDataResponse[]; error?: string }> {
  const data = await callAuthenticatedApi<{ queue: MatchmakingDataResponse[] }>({
    method: 'GET',
    url: `${API_ENDPOINTS.ADMIN.MATCHMAKING_QUEUE}?session_id=${sessionId}`,
  });
  if (!data) {
    return { success: false, queue: [], error: 'Failed to fetch matchmaking queue' };
  }
  const queue = Array.isArray(data.queue) ? data.queue : [];
  return { success: true, queue };
}

export async function startMatching(playerIds?: number[], sessionId?: number): Promise<{ success: boolean; message?: string; error?: string; result?: SessionFinishResponse }> {
  const body: Record<string, unknown> = {};
  if (playerIds && playerIds.length > 0) body.player_ids = playerIds;
  if (sessionId) body.session_id = sessionId;

  const data = await callAuthenticatedApi<SessionFinishResponse>({
    method: 'POST',
    url: API_ENDPOINTS.ADMIN.MATCHMAKING_START,
    body: Object.keys(body).length > 0 ? body : undefined,
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

export async function deleteMatchmakingSession(sessionId: number): Promise<{ success: boolean; error?: string }> {
  const data = await callAuthenticatedApi<{ success: boolean; error?: string }>({
    method: 'DELETE',
    url: API_ENDPOINTS.ADMIN.MATCHMAKING_SESSION_DELETE(sessionId),
  });
  if (!data || data.success === false) {
    return { success: false, error: 'Failed to delete matchmaking session' };
  }
  revalidateTag('sessions');
  return { success: true };
}

export async function removePlayerFromMatchmakingQueue(playerId: number): Promise<{ success: boolean; error?: string }> {
  const data = await callAuthenticatedApi<{ success: boolean; error?: string }>({
    method: 'DELETE',
    url: API_ENDPOINTS.ADMIN.MATCHMAKING_KICK_PLAYER(playerId),
  });
  if (!data || data.success === false) {
    return { success: false, error: data?.error || 'Failed to remove player from matchmaking queue' };
  }
  return { success: true };
}
