import { SessionManagementClient } from '@/components/session-management/index-client';
import { loadSessions } from './fetch';

export default async function SessionManagementPage() {
  const data = await loadSessions();

  return (
    <div className="items-center">
      <SessionManagementClient sessions={data.active_sessions} />
    </div>
  );
}
