export type SessionResponse = {
  id: number;
  name: string;
  device_set_id: number;
  status: number;
  created_at: string;
};

export type ActiveMapping = {
  SessionID: number;
  GroupID: number;
  AssignedAt: string;
};

export type SessionMappingsResponse = {
  active_mappings: ActiveMapping[];
};

export type MatchingData = {
  player_id: number;
  device_id: number;
  management_number: string;
  group_id: number;
  group_name: string;
  is_anywhere: boolean;
  join_time: string;
};

export type MatchingSSEEvent = {
  queue: MatchingData[];
  type: 'PLAYER_JOINED' | 'PLAYER_LEFT';
};

type SessionResult = {
  GroupID: number;
  PlayerCount: number;
  MatchingStarted: boolean;
  Error: string;
};

export type SessionResults = {
  SessionID: number;
  TicketID: number | null;
  GroupResults: SessionResult[];
};