export type DeviceData = {
  device_id: number;
  management_number: string;
};

export type GroupDetailResponse = {
  id: number;
  name: string;
  status: string;
  devices: DeviceData[];
};

export type DeviceGroupListResponse = {
  groups: GroupDetailResponse[];
};
