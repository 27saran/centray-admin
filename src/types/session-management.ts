export type SessionResponse = {
  session_id: number;
  session_name: string;
  status: number;
};

export type ActiveSession = {
  session_id: number;
  group_id: number;
  group_name: string;
  assigned_at: string;
};

export type SessionMappingsResponse = {
  active_sessions: ActiveSession[];
};

export type MatchmakingDataResponse = {
  session_id: number;
  player_id: number;
  management_number: string;
  created_at: string;
};

export type MatchmakingSSEEventResponse = {
  queue: MatchmakingDataResponse[];
};

export type MatchedPlayerSession = {
  ID: string;
  PlayerID: string;
};

export type SessionFinishResponse = {
  ticket_id: string;
  ticket_status: 'COMPLETED' | 'CANCELLED' | 'FAILED' | 'TIMED_OUT';
  estimated_wait_time?: number;
  port?: number;
  matched_player_sessions?: MatchedPlayerSession[];
  error?: string;
};
