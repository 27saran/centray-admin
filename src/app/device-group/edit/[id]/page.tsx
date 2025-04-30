import { notFound } from 'next/navigation';
import { EditDeviceGroupForm } from '@/components/device-group/edit-client';
import type { DeviceGroupJsonData } from '@/types/device-group';
import fs from 'fs/promises';
import path from 'path';

async function loadDeviceGroupData(): Promise<DeviceGroupJsonData> {
  // TODO: ダミーデータ API呼ぶ予定
  const filePath = path.join(process.cwd(), 'src', 'data', 'device-group-mock.json');
  try {
    const jsonData = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(jsonData);
  } catch (error) {
    return { groups: [] };
  }
}

export default async function EditDeviceGroupByIdPage({ params }: { params: { id: string } }) {
  // URLパラメータのidはstringとして渡されるので、intにパース
  const groupId = parseInt(params.id, 10);
  if (isNaN(groupId) || groupId <= 0) {
    notFound();
  }
  const deviceGroupData = await loadDeviceGroupData();
  const groupDetails = deviceGroupData.groups.find((group) => group.id === groupId);
  if (!groupDetails) {
    notFound();
  }
  return (
    <div className="py-8">
      <EditDeviceGroupForm initialData={groupDetails} />
    </div>
  );
}
