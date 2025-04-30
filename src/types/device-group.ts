export type DeviceData = {
  id: number;
  name: string;
};

export type GroupDetailData = {
  id: number;
  groupName: string;
  assignedDevices: DeviceData[];
  availableDevices: DeviceData[];
};

export type DeviceGroupJsonData = {
  groups: GroupDetailData[];
};
