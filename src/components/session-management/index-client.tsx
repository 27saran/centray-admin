'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Plus, RectangleGoggles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { ActiveSession } from '@/types/session-management';
import { formatDate } from '@/lib/format';
import Link from 'next/link';

type SessionManagementProps = {
  sessions: ActiveSession[];
};

export function SessionManagementClient({ sessions }: SessionManagementProps) {
  const router = useRouter();
  const sessionList = sessions || [];

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardContent>
          <CardHeader>
            <h3 className="font-bold text-center mb-2">進行中のセッション</h3>
          </CardHeader>
          <div className="flex flex-col h-80 overflow-y-auto">
            {sessionList.length === 0 ? (
              <div className="text-gray-400 text-center py-8">進行中のセッションはありません</div>
            ) : (
              sessionList.map((session) => (
                <Card key={session.session_id} className="border mb-1">
                  <Link
                    href={`/session-management/play?group_id=${session.group_id}&session_id=${session.session_id}`}
                    passHref
                    className="block no-underline text-inherit"
                  >
                    <CardContent>
                      <div>{formatDate(session.assigned_at)}</div>
                      <div className="flex items-center mt-2">
                        <span className="mr-2">
                          <RectangleGoggles size={30} />
                        </span>
                        <span className="text-lg font-semibold">{session.group_name}</span>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="w-full max-w-md mx-auto mt-6" onClick={() => router.push('/session-management/lobby')}>
        <CardContent>
        <div className="flex flex-col items-center">
            <Plus size={50} color="currentColor" />
            <div className="font-bold text-lg mt-2 text-gray-800">新しいセッションを開始する</div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
