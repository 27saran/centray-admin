'use server';

import type { GroupDetailResponse } from '@/types/device-group';
import { callAuthenticatedApi } from '@/lib/api';
import { revalidateTag } from 'next/cache';
import { API_ENDPOINTS } from '@/constants/endpoints';

// グループ一覧取得API
export async function loadDeviceGroups(): Promise<GroupDetailResponse[]> {
  const data = await callAuthenticatedApi<GroupDetailResponse[]>({
    method: 'GET',
    url: API_ENDPOINTS.ADMIN.GROUPS,
    tags: ['device-groups'],
  });
  return data ?? [];
}

// グループ作成API
export async function createDeviceGroup(groupName: string): Promise<{ success: boolean; data?: GroupDetailResponse; error?: string }> {
  const data = await callAuthenticatedApi<GroupDetailResponse>({
    method: 'POST',
    url: API_ENDPOINTS.ADMIN.GROUPS,
    body: { name: groupName },
  });
  if (!data) {
    return { success: false, error: 'Failed to create group' };
  }
  revalidateTag('device-groups');
  return { success: true, data };
}

// 端末名更新API
export async function updateDeviceName(deviceId: number, managementNumber: string): Promise<{ success: boolean; error?: string }> {
  const data = await callAuthenticatedApi<{ success: boolean; error?: string }>({
    method: 'PUT',
    url: API_ENDPOINTS.ADMIN.UPDATE_DEVICE_NAME(deviceId),
    body: { management_number: managementNumber },
  });
  if (!data || data.success === false) {
    return { success: false, error: data?.error || 'Failed to update device name' };
  }
  revalidateTag('device-groups');
  return { success: true };
}
