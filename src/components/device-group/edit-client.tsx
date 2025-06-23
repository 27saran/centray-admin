'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDeviceGroupEdit } from '@/hooks/device-group/use-device-group-edit';
import type { GroupDetailData, DeviceData } from '@/types/device-group';

type EditDeviceGroupClientProps = {
  groupDetail: GroupDetailData;
  unassignedDevices: DeviceData[];
};

export function EditDeviceGroupClient({ groupDetail, unassignedDevices }: EditDeviceGroupClientProps) {
  const {
    assignedDevices,
    unAssignedDevices,
    handleAddDevice,
    handleRemoveDevice,
    handleSaveChanges,
    handleDeleteGroup,
    handleGoBack,
  } = useDeviceGroupEdit({ groupDetail, unassignedDevices });

  return (
    <Card>
      <CardHeader>
        <CardTitle>グループ編集</CardTitle>
        <CardDescription>{groupDetail.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <h3 className="font-bold mb-2">所属中の端末</h3>
        <div className="h-60 overflow-y-auto border rounded-md p-2 mb-8">
          {assignedDevices.length > 0 ? (
            <ul className="space-y-2">
              {assignedDevices.map((device) => (
                <li key={`assigned-${device.device_id}`} className="flex items-center justify-between p-2 border rounded-md">
                  <span>{device.device_name}</span>
                  <Button variant="outline" size="sm" onClick={() => handleRemoveDevice(device)}>
                    解除
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">所属している端末はありません</p>
          )}
        </div>

        <h3 className="font-bold mb-2">紐付け可能な端末</h3>
        <div className="h-60 overflow-y-auto border rounded-md p-2">
          {unAssignedDevices.length > 0 ? (
            <ul className="space-y-2">
              {unAssignedDevices.map((device) => (
                <li key={`available-${device.device_id}`} className="flex items-center justify-between p-2 border rounded-md">
                  <span>{device.device_name}</span>
                  <Button variant="outline" size="sm" onClick={() => handleAddDevice(device)}>
                    追加
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">追加できる端末はありません</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-end gap-4">
        <Button onClick={handleSaveChanges}>保存する</Button>
        <Button variant="destructive" onClick={handleDeleteGroup}>
          グループ削除
        </Button>
        <Button variant="outline" onClick={handleGoBack}>
          戻る
        </Button>
      </CardFooter>
    </Card>
  );
}
