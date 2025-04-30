'use client';
import { Button } from '@/components/ui/button';
import { DeviceGroupTable } from '@/components/device-group/table';
import { useState } from 'react';

type Device = {
  id: number;
  name: string;
};

type DeviceGroup = {
  id: number;
  groupName: string;
  devices: Device[];
};

// TODO グループデータをAPIから取得する
const initialDeviceGroupData: DeviceGroup[] = [
  {
    id: 1,
    groupName: 'グループ1',
    devices: [
      { id: 1, name: 'device-A' },
      { id: 2, name: 'device-B' },
      { id: 3, name: 'device-C' },
    ],
  },
  {
    id: 2,
    groupName: 'グループ2',
    devices: [
      { id: 4, name: 'device-D' },
      { id: 5, name: 'device-E' },
    ],
  },
  {
    id: 3,
    groupName: 'グループ3',
    devices: [],
  }
];

export default function DeviceGroupPage() {
  const [deviceGroupData, setDeviceGroupData] = useState<DeviceGroup[]>(initialDeviceGroupData);

  const addGroup = () => {
    const newGroupName = `新規グループ ${deviceGroupData.length + 1}`;
    const newGroup: DeviceGroup = {
      id: deviceGroupData.length + 1,
      groupName: newGroupName,
      devices: [],
    };
    setDeviceGroupData([...deviceGroupData, newGroup]);
  };

  return (
    <>
      <div className="flex justify-end mb-8">
        <Button onClick={addGroup}>
          グループ追加
        </Button>
      </div>
      {deviceGroupData.map((group) => (
        <DeviceGroupTable
          key={group.id}
          id={group.id}
          groupName={group.groupName}
          devices={group.devices}
        />
      ))}
    </>
  );
}
