'use server';

import { callAuthenticatedApi } from '@/lib/api';
import { revalidateTag } from 'next/cache';
import type { GroupDetailData, DeviceData } from '@/types/device-group';

// グループ詳細取得API
export async function loadGroupDetail(id: number): Promise<GroupDetailData | null> {
  const data = await callAuthenticatedApi<GroupDetailData>({
    method: 'GET',
    url: `/api/admin/groups/${id}`,
  });
  return data ?? null;
}

// 未アサインデバイス一覧取得API
export async function loadUnassignedDevices(groupId: number): Promise<DeviceData[]> {
  const data = await callAuthenticatedApi<DeviceData[]>({
    method: 'GET',
    url: `/api/admin/groups/${groupId}/unassigned_devices`,
  });
  return data ?? [];
}

// グループ削除API
export async function deleteGroup(id: number): Promise<{ success: boolean; error?: string }> {
  const data = await callAuthenticatedApi<{ success: boolean; error?: string }>({
    method: 'DELETE',
    url: `/api/admin/groups/${id}`,
  });
  if (!data || data.success === false) {
    return { success: false, error: data?.error || 'Failed to delete group' };
  }
  revalidateTag('device-groups');
  return { success: true };
}

// デバイスアサイン保存API
export async function assignDevicesToGroup(
  groupId: number,
  addDeviceIds: number[],
  removeDeviceIds: number[]
): Promise<{ success: boolean; error?: string }> {
  const data = await callAuthenticatedApi<{ success: boolean; error?: string }>({
    method: 'POST',
    url: '/api/admin/devices/assign',
    body: {
      group_id: groupId,
      add_device_ids: addDeviceIds || [],
      remove_device_ids: removeDeviceIds || []
    },
  });
  if (!data || data.success === false) {
    return { success: false, error: data?.error || 'Failed to assign devices' };
  }
  revalidateTag('device-groups');
  return { success: true };
}
