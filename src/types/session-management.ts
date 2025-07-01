export type Session = {
  id: number;
  time: string;
  groupName: string;
};

export type SessionManagementData = {
  groupNames: string[];
  matchCountOptions: number[];
  initialGroupName: string;
  DeviceSource: string[];
  phaseSequence: { phase: string }[];
  sessions: Session[];
};
