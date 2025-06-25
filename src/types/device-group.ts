export type DeviceData = {
  device_id: number;
  management_number: string;
};

export type GroupDetailData = {
  id: number;
  name: string;
  status: string;
  devices: DeviceData[];
};

export type DeviceGroupJsonData = {
  groups: GroupDetailData[];
};
