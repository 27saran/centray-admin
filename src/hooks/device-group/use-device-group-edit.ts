import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteGroup, assignDevicesToGroup } from '@/app/(private)/device-group/edit/[id]/fetch';
import type { GroupDetailResponse, DeviceData } from '@/types/device-group';

type UseDeviceGroupEditProps = {
  groupDetail: GroupDetailResponse;
  unassignedDevices: DeviceData[];
};

export function useDeviceGroupEdit({ groupDetail, unassignedDevices }: UseDeviceGroupEditProps) {
  const router = useRouter();
  const initialAssignedDevices = groupDetail.devices;
  const [assignedDevices, setAssignedDevices] = useState<DeviceData[]>(groupDetail.devices);
  const [unAssignedDevices, setUnAssignedDevices] = useState<DeviceData[]>(unassignedDevices);

  // デバイス追加
  const handleAddDevice = (device: DeviceData) => {
    setUnAssignedDevices(prev => prev.filter(d => d.device_id !== device.device_id));
    setAssignedDevices(prev => [...prev, device]);
  };

  // デバイス解除
  const handleRemoveDevice = (device: DeviceData) => {
    setAssignedDevices(prev => prev.filter(d => d.device_id !== device.device_id));
    setUnAssignedDevices(prev => [...prev, device]);
  };

  // グループ保存
  const handleSaveChanges = async () => {
    // 初期状態と現在状態を比較して変更を計算
    const initialDeviceIds = initialAssignedDevices.map(device => device.device_id);
    const currentDeviceIds = assignedDevices.map(device => device.device_id);
    const addedDeviceIds = currentDeviceIds.filter(id => !initialDeviceIds.includes(id));
    const removedDeviceIds = initialDeviceIds.filter(id => !currentDeviceIds.includes(id));

    if (addedDeviceIds.length === 0 && removedDeviceIds.length === 0) {
      alert('変更がありません');
      return;
    }

    if (confirm('変更を保存しますか？')) {
      try {
        const result = await assignDevicesToGroup(groupDetail.id, addedDeviceIds, removedDeviceIds);
        if (result.success) {
          alert('保存しました');
          router.push('/device-group');
        } else {
          alert(`保存に失敗しました: ${result.error}`);
        }
      } catch (error) {
        console.error('Save changes error:', error);
        alert('保存中にエラーが発生しました');
      }
    }
  };

  // グループ削除
  const handleDeleteGroup = async () => {
    if (confirm(`グループ "${groupDetail.name}" を削除します\nよろしいですか？`)) {
      try {
        const result = await deleteGroup(groupDetail.id);
        if (result.success) {
          alert('グループを削除しました');
          router.push('/device-group');
        } else {
          alert(`削除に失敗しました: ${result.error}`);
        }
      } catch (error) {
        console.error('Delete group error:', error);
        alert('削除中にエラーが発生しました');
      }
    }
  };

  // 戻るボタン
  const handleGoBack = () => {
    router.back();
  };

  return {
    assignedDevices,
    unAssignedDevices,
    handleAddDevice,
    handleRemoveDevice,
    handleSaveChanges,
    handleDeleteGroup,
    handleGoBack,
  };
}
