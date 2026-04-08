export type SessionResponse = {
  session_id: number;
  session_name: string;
};

export type ActiveSession = {
  session_id: number;
  name: string;
  created_at: string;
};

export type SessionMappingsResponse = {
  active_sessions: ActiveSession[];
};

export type MatchmakingDataResponse = {
  player_id: number;
  management_number: string;
  device_id: number;
};

export type MatchmakingSSEEventResponse = {
  queue: MatchmakingDataResponse[];
};

export type MatchedPlayerSession = {
  ID: string;
  PlayerID: string;
};

export type SessionFinishResponse = {
  session_id: number;
  ticket_id: string;
  ticket_status: 'COMPLETED' | 'CANCELLED' | 'FAILED' | 'TIMED_OUT';
  estimated_wait_time?: number;
  port?: number;
  matched_player_sessions?: MatchedPlayerSession[];
  error?: string;
};

export type PhaseData = {
  id: number;
  order: number;
  name: string;
  rule: number;
  condition_type: number;
  state: number;
  parent_id?: number;
  is_clear?: boolean;
};

export type PhaseProgressResponse = {
  phases: PhaseData[];
  conditions: unknown[];
  condition_parts: unknown[];
  game_state?: number;
};
