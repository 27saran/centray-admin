'use server';

import { callAuthenticatedApi } from '@/lib/api';
import { SessionMappingsResponse } from '@/types/session-management';

// 進行中セッション一覧取得API
export async function loadSessions(): Promise<SessionMappingsResponse> {
  const data = await callAuthenticatedApi<SessionMappingsResponse>({
    method: 'GET',
    url: '/api/admin/session-group-mappings/active',
    tags: ['sessions'],
  });
  return data ?? { active_mappings: [] };
}
