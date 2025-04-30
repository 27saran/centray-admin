export type Device = {
  id: number;
  name: string;
};

export type GroupDetails = {
  id: string;
  groupName: string;
  assignedDevices: Device[];
  availableDevices: Device[];
};
