'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Plus, RectangleGoggles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Session } from '@/types/session-management';

type SessionManagementProps = {
  sessions: Session[];
};

export function SessionManagementClient({ sessions }: SessionManagementProps) {
  const router = useRouter();

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardContent>
          <CardHeader>
            <h3 className="font-bold text-center">進行中のセッション</h3>
          </CardHeader>
          <div className="flex flex-col gap-4 h-80 overflow-y-auto">
            {sessions.length === 0 ? (
              <div className="text-gray-400 text-center py-8">進行中のセッションはありません</div>
            ) : (
              sessions.map((session) => (
                <Card key={session.id} className="border">
                  <CardContent>
                    <div className="font-semibold">{session.time}</div>
                    <div className="flex items-center mt-2">
                      <span className="mr-2">
                        <RectangleGoggles size={30} />
                      </span>
                      <span className="text-lg font-semibold">{session.groupName}</span>
                    </div>
                  </CardContent>
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
