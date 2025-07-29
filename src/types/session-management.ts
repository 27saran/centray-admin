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

export type MatchingDataResponse = {
  player_id: number;
  device_id: number;
  management_number: string;
  group_id: number;
  group_name: string;
  is_anywhere: boolean;
  join_time: string;
};

export type MatchingSSEEventResponse = {
  queue: MatchingDataResponse[];
  type: 'PLAYER_JOINED' | 'PLAYER_LEFT';
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
