import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteGroup, assignDevicesToGroup, updateGroupName } from '@/app/(private)/device-group/edit/[id]/fetch';
import { useCheckAuth } from '@/hooks/auth/use-auth-guard';
import type { GroupDetailResponse, DeviceData } from '@/types/device-group';

type UseDeviceGroupEditProps = {
  groupDetail: GroupDetailResponse;
  unassignedDevices: DeviceData[];
};

export function useDeviceGroupEdit({ groupDetail, unassignedDevices }: UseDeviceGroupEditProps) {
  const router = useRouter();
  const { checkAuth } = useCheckAuth();
  const initialAssignedDevices = groupDetail.devices;
  const [assignedDevices, setAssignedDevices] = useState<DeviceData[]>(groupDetail.devices);
  const [unAssignedDevices, setUnAssignedDevices] = useState<DeviceData[]>(unassignedDevices);

  // グループ名編集
  const [isEditingName, setIsEditingName] = useState(false);
  const [editingName, setEditingName] = useState(groupDetail.name);

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
          await checkAuth();
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
          await checkAuth();
          alert(`削除に失敗しました: ${result.error}`);
        }
      } catch (error) {
        console.error('Delete group error:', error);
        alert('削除中にエラーが発生しました');
      }
    }
  };

  // グループ名編集開始
  const handleStartEditName = () => {
    setIsEditingName(true);
    setEditingName(groupDetail.name);
  };

  // グループ名編集キャンセル
  const handleCancelEditName = () => {
    setIsEditingName(false);
    setEditingName(groupDetail.name);
  };

  // グループ名保存
  const handleSaveName = async () => {
    if (editingName.trim() === '') {
      alert('グループ名を入力してください');
      return;
    }

    if (editingName.trim() === groupDetail.name) {
      setIsEditingName(false);
      return;
    }

    try {
      const result = await updateGroupName(groupDetail.id, editingName.trim());
      if (result.success) {
        alert('グループ名を更新しました');
        setIsEditingName(false);
        window.location.reload();
      } else {
        await checkAuth();
        alert(`グループ名の更新に失敗しました: ${result.error}`);
      }
    } catch (error) {
      console.error('Update group name error:', error);
      alert('グループ名の更新中にエラーが発生しました');
    }
  };

  // 戻るボタン
  const handleGoBack = () => {
    router.back();
  };

  return {
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
  };
}
