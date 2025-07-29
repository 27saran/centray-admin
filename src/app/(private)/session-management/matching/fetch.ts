'use server';
import { callAuthenticatedApi } from '@/lib/api';
import { SessionFinishResponse } from '@/types/session-management';
import { API_ENDPOINTS } from '@/constants/endpoints';

export async function SessionFinish(sessionId: number, groupId: number): Promise<{ success: boolean; message?: string; error?: string; result?: SessionFinishResponse }> {
  const data = await callAuthenticatedApi<SessionFinishResponse>({
    method: 'POST',
    url: API_ENDPOINTS.ADMIN.MATCHMAKING_SESSION_FINISH(sessionId),
    body: { group_id: groupId },
  });
  if (!data) {
    return { success: false, error: 'Failed to finish matching' };
  }

  const isSuccess = data.ticket_status === 'COMPLETED';
  const message = isSuccess ? 'マッチング完了' : `マッチング失敗: ${data.ticket_status}`;
  const error = !isSuccess ? (data.error || `Status: ${data.ticket_status}`) : undefined;

  return {
    success: isSuccess,
    message,
    error,
    result: data
  };
}