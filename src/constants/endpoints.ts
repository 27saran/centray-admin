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
    DEVICE_ASSIGN: '/api/admin/devices/assign/groups',
    GROUP_DEVICES: (groupId: number) => `/api/admin/groups/${groupId}/devices`,
    // セッション関連
    MATCHMAKING_SESSIONS: '/api/admin/matchmaking/sessions',
    MATCHMAKING_SESSIONS_ACTIVE: '/api/admin/matchmaking/sessions/active',
    MATCHMAKING_SESSION_FINISH: (sessionId: number) => `/api/admin/matchmaking/sessions/${sessionId}/finish`,
    // ゲーム関連
    CHANGE_GAME_STATE: (sessionId: number) => `/api/admin/game-server-info/session/${sessionId}/change-game-state`,
    GET_PHASE_PROGRESS: (sessionId: number) => `/api/admin/game-server-info/session/${sessionId}/phase-progress-broadcast`,
    // SSE関連
    SSE: {
      MATCHMAKING: '/api/admin/sse?stream=matchmaking',
      PLAYER_STATUS: '/api/admin/sse?stream=player_status',
      PHASE_STATUS: '/api/admin/sse?stream=phase_status',
    },
  },
  // NextAuth関連
  AUTH: {
    LOGOUT: '/api/auth/logout',
  },
} as const;
