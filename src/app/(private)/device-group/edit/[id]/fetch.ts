'use server';

import { callAuthenticatedApi } from '@/lib/api';
import { revalidateTag } from 'next/cache';
import type { GroupDetailResponse, DeviceData } from '@/types/device-group';
import { API_ENDPOINTS } from '@/constants/endpoints';

// グループ詳細取得API
export async function loadGroupDetail(id: number): Promise<GroupDetailResponse | null> {
  const data = await callAuthenticatedApi<GroupDetailResponse>({
    method: 'GET',
    url: API_ENDPOINTS.ADMIN.GROUP_DETAIL(id),
  });
  return data ?? null;
}

// 未アサインデバイス一覧取得API
export async function loadUnassignedDevices(groupId: number): Promise<DeviceData[]> {
  const data = await callAuthenticatedApi<DeviceData[]>({
    method: 'GET',
    url: API_ENDPOINTS.ADMIN.GROUP_DEVICES(groupId),
  });
  return data ?? [];
}

// デバイス割り当て更新API
export async function assignDevicesToGroup(groupId: number, addDeviceIds: number[], removeDeviceIds: number[]): Promise<{ success: boolean; error?: string }> {
  const data = await callAuthenticatedApi<{ success: boolean; error?: string }>({
    method: 'POST',
    url: API_ENDPOINTS.ADMIN.DEVICE_ASSIGN,
    body: { group_id: groupId, add_device_ids: addDeviceIds, remove_device_ids: removeDeviceIds },
  });
  if (!data || data.success === false) {
    return { success: false, error: data?.error || 'Failed to assign devices' };
  }
  revalidateTag('device-groups');
  return { success: true };
}

// グループ削除API
export async function deleteGroup(id: number): Promise<{ success: boolean; error?: string }> {
  const data = await callAuthenticatedApi<{ success: boolean; error?: string }>({
    method: 'DELETE',
    url: API_ENDPOINTS.ADMIN.GROUP_DETAIL(id),
  });
  if (!data || data.success === false) {
    return { success: false, error: data?.error || 'Failed to delete group' };
  }
  revalidateTag('device-groups');
  return { success: true };
}
