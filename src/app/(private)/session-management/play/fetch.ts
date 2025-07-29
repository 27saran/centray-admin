'use server';

import { callAuthenticatedApi } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/endpoints';
import { GAME_STATUS } from '@/constants/enum';

// ゲーム正常終了
export async function endSession(session_id: number) {
  return await callAuthenticatedApi({
    method: 'POST',
    url: API_ENDPOINTS.ADMIN.CHANGE_GAME_STATE(session_id),
    body: {
      game_state: GAME_STATUS.FINISH,
      reason: 'ゲーム正常終了のため',
    },
  });
}

// ゲーム緊急停止
export async function forceEndSession(session_id: number) {
  return await callAuthenticatedApi({
    method: 'POST',
    url: API_ENDPOINTS.ADMIN.CHANGE_GAME_STATE(session_id),
    body: {
      game_state: GAME_STATUS.FORCE_FINISH,
      reason: 'ゲーム緊急停止のため',
    },
  });
}