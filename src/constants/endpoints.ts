// API エンドポイント
export const API_ENDPOINTS = {
  ADMIN: {
    // 認証関連
    LOGIN: '/api/admin/login',
    LOGOUT: '/api/admin/logout',
    LOGGED_IN: '/api/admin/loggedin',
    // グループ関連
    GROUPS: '/api/admin/groups',
    GROUPS_AVAILABLE: '/api/admin/groups/available',
    GROUP_DETAIL: (id: number) => `/api/admin/groups/${id}`,
    UPDATE_GROUP_NAME: (id: number) => `/api/admin/groups/${id}`,
    DEVICE_ASSIGN: '/api/admin/devices/assign/groups',
    DEVICE_UNASSIGNED: '/api/admin/devices/unassigned',
    UPDATE_DEVICE_NAME: (deviceId: number) => `/api/admin/devices/${deviceId}`,
    // マッチメイキング関連
    MATCHMAKING_GROUP_QUEUE: (groupId: number) => `/api/admin/matchmaking/groups/${groupId}/queue`,
    MATCHMAKING_GROUP_KICK_PLAYER: (groupId: number, playerId: number) => `/api/admin/matchmaking/groups/${groupId}/kick/${playerId}`,
    // セッション関連
    MATCHMAKING_SESSIONS: '/api/admin/matchmaking/sessions',
    MATCHMAKING_SESSIONS_ACTIVE: '/api/admin/matchmaking/sessions/active',
    MATCHMAKING_SESSION_FINISH: (sessionId: number) => `/api/admin/matchmaking/sessions/${sessionId}/finish`,
    MATCHMAKING_SESSION_DELETE: (sessionId: number, groupId: number) => `/api/admin/matchmaking/sessions/${sessionId}/groups/${groupId}`,
    // ゲーム関連
    GET_GAME_SERVER_INFOS: (sessionId: number) => `/api/admin/game-server-info/session/${sessionId}`,
    GET_ACTIVE_GAME_SERVER_INFOS: '/api/admin/game-server-info/active',
    CHANGE_GAME_STATE: (sessionId: number) => `/api/admin/game-server-info/session/${sessionId}/change-game-state`,
    GET_PHASE_PROGRESS: (sessionId: number) => `/api/admin/game-server-info/session/${sessionId}/phase-progress-broadcast`,
    // SSE関連
    SSE: {
      MATCHMAKING: (groupId: number) => `/api/admin/sse?stream=matchmaking:${groupId}`,
      PLAYER_STATUS: (groupId: number) => `/api/admin/sse?stream=player_status:${groupId}`,
      PHASE_STATUS: (sessionId: number) =>`/api/admin/sse?stream=phase_progress:${sessionId}`,
    },
  },
  // NextAuth関連
  AUTH: {
    LOGOUT: '/api/auth/logout',
  },
} as const;
