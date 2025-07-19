export type PlayerStatusData = {
  device_id: number;
  management_number: string;
  status: number;
  last_connected_at: number;
};

export type PlayerStatusSSEData = {
  device_id: number;
  management_number: string;
  status: number;
  last_connected_at: number;
  group_status?: {
    group_id: number;
  };
};
