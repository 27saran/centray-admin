import { SessionManagementClient } from '@/components/session-management/index-client';
import fs from 'fs/promises';
import path from 'path';
import { SessionManagementData } from '@/types/session-management';

async function loadData(): Promise<SessionManagementData> {
  // TODO: ダミーデータ API呼ぶ予定
  const filePath = path.join(process.cwd(), 'src', 'data', 'session-management-mock.json');
  try {
    const jsonData = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(jsonData);
  } catch (error) {
    return {
      groupNames: [],
      matchCountOptions: [],
      initialGroupName: 'エラー',
      DeviceSource: [],
      phaseSequence: [],
      sessions: [],
    };
  }
}

export default async function SessionManagementPage() {
  const data = await loadData();

  return (
    <div className="items-center">
      <SessionManagementClient sessions={data.sessions} />
    </div>
  );
}
