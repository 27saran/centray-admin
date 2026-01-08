'use client';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { useDeviceGroupList } from '@/hooks/device-group/use-device-group-index';
import { compareByManagementNumber } from '@/lib/sort';
import type { GroupDetailResponse } from '@/types/device-group';

type DeviceGroupClientProps = {
  deviceGroups: GroupDetailResponse[];
};

export function DeviceGroupClient({ deviceGroups }: DeviceGroupClientProps) {
  const { isPending, handleAddGroup, handleEditClick } = useDeviceGroupList({ deviceGroups });

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={handleAddGroup} disabled={isPending}>
          {isPending ? '作成中...' : 'グループ追加'}
        </Button>
      </div>
      {deviceGroups.map((group) => (
        <div key={group.id} className="rounded-md border mt-8">
          <div className="sticky top-0 bg-background border-b z-10">
            <div className="flex items-center justify-between p-2">
              <span className="font-medium">{group.name}</span>
              <Button onClick={() => handleEditClick(group.id)}>編集</Button>
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto">
            <Table>
              <TableBody>
                {group.devices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-muted-foreground">登録端末はありません</TableCell>
                  </TableRow>
                ) : (
                  [...group.devices]
                    .sort(compareByManagementNumber)
                    .map((device) => (
                    <TableRow key={device.device_id}>
                      <TableCell colSpan={2}>{device.management_number}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      ))}
    </>
  );
}
