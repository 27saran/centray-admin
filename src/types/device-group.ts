export type DeviceData = {
  device_id: number;
  device_name: string;
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
