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

// ゲームサーバ割当情報の取得
export async function getGameServerInfos(sessionId: number): Promise<unknown[]> {
  const data = await callAuthenticatedApi<{ game_server_infos?: unknown[] }>({
    method: 'GET',
    url: API_ENDPOINTS.ADMIN.GET_GAME_SERVER_INFOS(sessionId),
  });
  const infos = data?.game_server_infos;
  return Array.isArray(infos) ? infos : [];
}

// アクティブなゲームサーバ割当のsession_id一覧を取得
export const getActiveAssignedSessionIds = async (): Promise<number[]> => {
  const data = await callAuthenticatedApi<{ active_game_server_infos?: { session_id?: number | string }[] }>({
    method: 'GET',
    url: API_ENDPOINTS.ADMIN.GET_ACTIVE_GAME_SERVER_INFOS,
    tags: ['game-server-infos'],
  });
  const infos = data?.active_game_server_infos ?? [];
  return Array.from(new Set(infos
    .map((i) => Number(i.session_id))
  ));
};
