'use server';

import { callAuthenticatedApi } from '@/lib/api';
import { SessionMappingsResponse } from '@/types/session-management';
import { API_ENDPOINTS } from '@/constants/endpoints';

// 進行中セッション一覧取得API
export async function loadSessions(): Promise<SessionMappingsResponse> {
  const data = await callAuthenticatedApi<SessionMappingsResponse>({
    method: 'GET',
    url: API_ENDPOINTS.ADMIN.MATCHMAKING_SESSIONS_ACTIVE,
    tags: ['sessions'],
  });
  return data ?? { active_sessions: [] };
}
