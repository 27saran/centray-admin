'use server';
import { callAuthenticatedApi } from '@/lib/api';
import { SessionResults } from '@/types/session-management';

export async function startMatching(sessionId: number, groupId: number): Promise<{ success: boolean; message?: string; error?: string; result?: SessionResults }> {
  const data = await callAuthenticatedApi<{ message: string, result: SessionResults }>({
    method: 'POST',
    url: `/api/admin/matchmaking/sessions/${sessionId}/finish`,
    body: { group_id: groupId },
  });
  if (!data) {
    return { success: false, error: 'Failed to start matching' };
  }
  return { success: true, message: data.message, result: data.result };
}