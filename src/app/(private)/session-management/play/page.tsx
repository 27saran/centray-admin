import { PlayClient } from '@/components/session-management/play-client';
// import { fetchPhaseProgress } from './fetch';

export default async function PlayPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const sessionId = params.session_id ? Number(params.session_id) : null;

  if (sessionId) {
    // await fetchPhaseProgress(sessionId).catch(console.error);
  }

  return (
    <div className="flex items-center min-h-screen">
      <PlayClient />
    </div>
  );
}
