'use client';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDeviceGroupList } from '@/hooks/device-group/use-device-group-index';
import type { GroupDetailResponse } from '@/types/device-group';

type DeviceGroupClientProps = {
  deviceGroups: GroupDetailResponse[];
};

export function DeviceGroupClient({ deviceGroups }: DeviceGroupClientProps) {
  const { isPending, addGroup, handleEditClick } = useDeviceGroupList({ deviceGroups });

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={addGroup} disabled={isPending}>
          {isPending ? '作成中...' : 'グループ追加'}
        </Button>
      </div>
      {deviceGroups.map((group) => (
        <div key={group.id} className="rounded-md border mt-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="py-4">{group.name}</TableHead>
                <TableHead className="text-right">
                  <Button onClick={() => handleEditClick(group.id)}>編集</Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {group.devices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-muted-foreground">登録端末はありません</TableCell>
                </TableRow>
              ) : (
                group.devices.map((device) => (
                  <TableRow key={device.device_id}>
                    <TableCell colSpan={2}>{device.management_number}</TableCell>
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
