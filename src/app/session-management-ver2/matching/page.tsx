import { MatchingClient } from '@/components/session-management-ver2/matching-client';
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
    };
  }
}

export default async function MatchingPage() {
  const data = await loadData();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <MatchingClient initialGroupName={data.initialGroupName} DeviceSource={data.DeviceSource} />
    </div>
  );
}
