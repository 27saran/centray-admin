import { PlayClient } from '@/components/session-management/play-client';

export default async function PlayPage() {
  return (
    <div className="flex items-center min-h-screen">
      <PlayClient />
    </div>
  );
}
