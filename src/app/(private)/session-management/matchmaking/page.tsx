import { MatchmakingClient } from '@/components/session-management/matchmaking-client';

type MatchmakingPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function MatchmakingPage({ searchParams }: MatchmakingPageProps) {
  const params = await searchParams;
  const groupId = params.group_id;
  const groupIdNumber = groupId && typeof groupId === 'string' ? Number(groupId) : undefined;

  return (
    <div className="container mx-auto p-4">
      <MatchmakingClient groupId={groupIdNumber} />
    </div>
  );
}
