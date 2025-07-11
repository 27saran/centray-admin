import { PlayClient } from '@/components/session-management/play-client';

async function loadData(): Promise<> {
    return {
      groupNames: [],
      matchCountOptions: [],
      initialGroupName: 'エラー',
      DeviceSource: [],
      phaseSequence: [],
      sessions: [],
    };
}

export default async function PlayPage() {
  const data = await loadData();

  return (
    <div className="flex items-center min-h-screen">
      <PlayClient DeviceSource={data.DeviceSource} phaseSequence={data.phaseSequence} />
    </div>
  );
}
