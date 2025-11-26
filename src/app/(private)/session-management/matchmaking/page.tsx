import { MatchmakingClient } from '@/components/session-management/matchmaking-client';
import { getGroupNameById } from './fetch';
import { redirect } from 'next/navigation';

type MatchmakingPageProps = {
  searchParams: Promise<{ group_id?: string; session_id?: string }>;
};

export default async function MatchmakingPage({ searchParams }: MatchmakingPageProps) {
  const params = await searchParams;
  const groupId = Number(params.group_id);
  if (Number.isNaN(groupId)) {
    redirect('/session-management');
  }
  const groupName = await getGroupNameById(groupId);

  return (
    <div className="container mx-auto p-4">
      <MatchmakingClient groupId={groupId} groupName={groupName} />
    </div>
  );
}
