'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useRouter } from 'next/navigation';
import type { GroupDetailData } from '@/types/device-group';

type DeviceGroupClientProps = {
  initialGroups: GroupDetailData[];
};

export function DeviceGroupClient({ initialGroups }: DeviceGroupClientProps) {
  const [deviceGroupData, setDeviceGroupData] = useState<GroupDetailData[]>(initialGroups);
  const router = useRouter();

  // TODO: ダミー新規グループ追加
  const addGroup = () => {
    const nextId = Math.max(...deviceGroupData.map((g) => g.id)) + 1;
    const newGroupName = `新規グループ ${nextId}`;
    const newGroup: GroupDetailData = {
      id: nextId,
      groupName: newGroupName,
      assignedDevices: [],
      availableDevices: [],
    };
    setDeviceGroupData([...deviceGroupData, newGroup]);
  };

  const handleEditClick = (id: number) => {
    router.push(`/device-group/edit/${id}`);
  };

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={addGroup}>グループ追加</Button>
      </div>
      {deviceGroupData.map((group) => (
        <div key={group.id} className="rounded-md border mt-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="py-4">{group.groupName}</TableHead>
                <TableHead className="text-right">
                  <Button onClick={() => handleEditClick(group.id)}>編集</Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {group.assignedDevices.length === 0 ? (
                <TableRow>
                  <TableCell className="text-muted-foreground">登録端末はありません</TableCell>
                </TableRow>
              ) : (
                group.assignedDevices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell>{device.name}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      ))}
    </>
  );
}
