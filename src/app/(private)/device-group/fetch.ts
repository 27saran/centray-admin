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
