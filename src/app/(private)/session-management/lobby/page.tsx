import { LobbyClient } from '@/components/session-management/lobby-client';
import { getAvailableGroups } from './fetch';

export default async function SessionManagementPage() {
  const data = await getAvailableGroups();

  return (
    <div className="flex items-center min-h-screen">
      <LobbyClient groups={data} />
    </div>
  );
}
