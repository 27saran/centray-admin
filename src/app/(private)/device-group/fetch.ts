'use server';

import type { GroupDetailData } from '@/types/device-group';
import { callAuthenticatedApi } from '@/lib/api';
import { revalidateTag } from 'next/cache';

// グループ一覧取得API
export async function loadDeviceGroups(): Promise<GroupDetailData[]> {
  const data = await callAuthenticatedApi<GroupDetailData[]>({
    method: 'GET',
    url: '/api/admin/groups',
    tags: ['device-groups'],
  });
  return data ?? [];
}

// グループ作成API
export async function createDeviceGroup(groupName: string): Promise<{ success: boolean; data?: GroupDetailData; error?: string }> {
  const data = await callAuthenticatedApi<GroupDetailData>({
    method: 'POST',
    url: '/api/admin/groups',
    body: { name: groupName },
  });
  if (!data) {
    return { success: false, error: 'Failed to create group' };
  }
  revalidateTag('device-groups');
  return { success: true, data };
}
