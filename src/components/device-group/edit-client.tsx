'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDeviceGroupEdit } from '@/hooks/device-group/use-device-group-edit';
import type { GroupDetailResponse, DeviceData } from '@/types/device-group';
import { SquarePen, Check, X } from 'lucide-react';

type EditDeviceGroupClientProps = {
  groupDetail: GroupDetailResponse;
  unassignedDevices: DeviceData[];
};

export function EditDeviceGroupClient({ groupDetail, unassignedDevices }: EditDeviceGroupClientProps) {
  const {
    assignedDevices,
    unAssignedDevices,
    isEditingName,
    editingName,
    setEditingName,
    handleAddDevice,
    handleRemoveDevice,
    handleSaveChanges,
    handleDeleteGroup,
    handleGoBack,
    handleStartEditName,
    handleCancelEditName,
    handleSaveName,
    editingDeviceId,
    editingDeviceName,
    setEditingDeviceName,
    startEdit,
    cancelEdit,
    saveEdit,
  } = useDeviceGroupEdit({ groupDetail, unassignedDevices });

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>グループ編集</CardTitle>
        <CardDescription>
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <Input
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                className="flex-1"
                placeholder="グループ名を入力"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    handleCancelEditName();
                  }
                }}
              />
              <Button size="sm" variant="outline" onClick={handleSaveName}>
                <Check className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancelEditName}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span>{groupDetail.name}</span>
              <Button size="sm" variant="ghost" onClick={handleStartEditName}>
                <SquarePen className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <h3 className="font-bold mb-2">所属中の端末</h3>
        <div className="h-60 overflow-y-auto border rounded-md p-2 mb-8">
          {assignedDevices.length > 0 ? (
            <ul className="space-y-2">
              {assignedDevices.map((device) => (
                <li key={`assigned-${device.device_id}`} className="flex items-center justify-between p-2 border rounded-md">
                  <div className="flex items-center gap-2">
                    {editingDeviceId === device.device_id ? (
                      <>
                        <Input
                          value={editingDeviceName}
                          onChange={(e) => setEditingDeviceName(e.target.value)}
                          className="max-w-xs"
                          placeholder="端末名を入力"
                          autoFocus
                        />
                        <Button size="sm" variant="outline" onClick={saveEdit}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit}>
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <span>{device.management_number}</span>
                        <Button size="sm" variant="ghost" onClick={() => startEdit(device.device_id, device.management_number)}>
                          <SquarePen className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
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
                  <div className="flex items-center gap-2">
                    {editingDeviceId === device.device_id ? (
                      <>
                        <Input
                          value={editingDeviceName}
                          onChange={(e) => setEditingDeviceName(e.target.value)}
                          className="max-w-xs"
                          placeholder="端末名を入力"
                          autoFocus
                        />
                        <Button size="sm" variant="outline" onClick={saveEdit}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit}>
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <span>{device.management_number}</span>
                        <Button size="sm" variant="ghost" onClick={() => startEdit(device.device_id, device.management_number)}>
                          <SquarePen className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
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
        <div className="flex gap-2">
          <Button variant="destructive" onClick={handleDeleteGroup}>
            グループ削除
          </Button>
          <Button onClick={handleSaveChanges}>保存する</Button>
        </div>
        <Button variant="outline" onClick={handleGoBack}>
          戻る
        </Button>
      </CardFooter>
    </Card>
  );
}
