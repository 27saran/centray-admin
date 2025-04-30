import { DeviceGroupClient } from '@/components/device-group/index-client';
import fs from 'fs/promises';
import path from 'path';
import type { DeviceGroupJsonData } from '@/types/device-group';

async function loadData(): Promise<DeviceGroupJsonData> {
  // TODO: ダミーデータ API呼ぶ予定
  const filePath = path.join(process.cwd(), 'src', 'data', 'device-group-mock.json');
  try {
    const jsonData = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(jsonData);
  } catch (error) {
    return { groups: [] };
  }
}

export default async function DeviceGroupPage() {
  const data = await loadData();

  return (
    <div className="container mx-auto py-8">
      <DeviceGroupClient initialGroups={data.groups} />
    </div>
  );
}
