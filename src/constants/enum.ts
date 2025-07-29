// ゲーム状態定数
export const GAME_STATUS = {
  FINISH: 2,
  FORCE_FINISH: 3,
} as const;

// プレイヤーステータス定数
export const PLAYER_STATUS = {
  0: "不明",
  1: "接続中",
  2: "切断",
  3: "時間切れ",
} as const;

// プレイヤーステータス比較用定数
export const PLAYER_STATUS_CODE = {
  UNSPECIFIED: 0,
  CONNECTED: 1,
  DISCONNECTED: 2,
  TIMEOUT: 3,
} as const;
