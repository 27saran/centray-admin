export type SessionResponse = {
  session_id: number;
  session_name: string;
  status: number;
};

export type ActiveMapping = {
  session_id: number;
  group_id: number;
  group_name: string;
  assigned_at: string;
};

export type SessionMappingsResponse = {
  active_mappings: ActiveMapping[];
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

type SessionResult = {
  GroupID: number;
  PlayerCount: number;
  MatchingStarted: boolean;
  Error: string;
};

export type SessionResultsResponse = {
  SessionID: number;
  TicketID: number | null;
  GroupResults: SessionResult[];
};