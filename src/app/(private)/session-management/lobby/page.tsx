import { LobbyClient } from '@/components/session-management/lobby-client';
import { loadDeviceGroups } from '@/app/(private)/device-group/fetch';


export default async function SessionManagementPage() {
  const data = await loadDeviceGroups();

  return (
    <div className="flex items-center min-h-screen">
      <LobbyClient groups={data} />
    </div>
  );
}
