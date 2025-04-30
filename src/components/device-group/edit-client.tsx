'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import type { DeviceData, GroupDetailData } from '@/types/device-group';

type EditDeviceGroupFormProps = {
  initialData: GroupDetailData;
};

export function EditDeviceGroupForm({ initialData }: EditDeviceGroupFormProps) {
  const router = useRouter();
  const [groupName] = useState(initialData.groupName);
  const [assignedDevices, setAssignedDevices] = useState<DeviceData[]>(initialData.assignedDevices);
  const [availableDevices, setAvailableDevices] = useState<DeviceData[]>(initialData.availableDevices);
  const groupId = initialData.id;

  // 端末追加
  const handleAddDevice = (deviceToAdd: DeviceData) => {
    setAvailableDevices(availableDevices.filter((device) => device.id !== deviceToAdd.id));
    setAssignedDevices([...assignedDevices, deviceToAdd]);
    console.log(`端末追加： ${deviceToAdd.id}`);
    // TODO: API Call
  };

  // 端末削除
  const handleRemoveDevice = (deviceToRemove: DeviceData) => {
    setAssignedDevices(assignedDevices.filter((device) => device.id !== deviceToRemove.id));
    setAvailableDevices([...availableDevices, deviceToRemove]);
    console.log(`端末削除： ${deviceToRemove.id}`);
    // TODO: API Call
  };

  // グループ保存
  const handleSaveChanges = () => {
    if (confirm(`グループ "${groupName}" を保存します\nよろしいですか？`)) {
      console.log(`Save group ${groupId}`);
      // TODO: API Call
    }
  };

  // グループ削除
  const handleDeleteGroup = async () => {
    if (confirm(`グループ "${groupName}" を削除します\nよろしいですか？`)) {
      console.log(`Delete group ${groupId}`);
      // TODO: API Call
    }
  };

  // 戻るボタン
  const handleGoBack = () => {
    router.back();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>グループ編集</CardTitle>
        <CardDescription>{groupName}</CardDescription>
      </CardHeader>
      <CardContent>
        <h3 className="font-bold mb-2">所属中の端末</h3>
        <div className="h-60 overflow-y-auto border rounded-md p-2 mb-8">
          {assignedDevices.length > 0 ? (
            <ul className="space-y-2">
              {assignedDevices.map((device) => (
                <li key={device.id} className="flex items-center justify-between p-2 border rounded-md">
                  <span>{device.name}</span>
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
          {availableDevices.length > 0 ? (
            <ul className="space-y-2">
              {availableDevices.map((device) => (
                <li key={device.id} className="flex items-center justify-between p-2 border rounded-md">
                  <span>{device.name}</span>
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
