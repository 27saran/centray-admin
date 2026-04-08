import { MatchmakingClient } from '@/components/session-management/matchmaking-client';

export default async function MatchmakingPage() {
  return (
    <div className="container mx-auto p-4">
      <MatchmakingClient />
    </div>
  );
}
