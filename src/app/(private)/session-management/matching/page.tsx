import { MatchingClient } from '@/components/session-management/matching-client';

type MatchingPageProps = {
  searchParams: Promise<{ group_id?: string }>;
};

export default async function MatchingPage({ searchParams }: MatchingPageProps) {
  const params = await searchParams;
  const groupId = params.group_id ? Number(params.group_id) : undefined;

  return (
    <div className="flex items-center min-h-screen">
      <MatchingClient groupId={groupId} />
    </div>
  );
}
