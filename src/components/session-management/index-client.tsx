'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Plus, RectangleGoggles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import type { ActiveSession } from '@/types/session-management';
import { formatDate } from '@/lib/format';
import { useIndex } from '@/hooks/session-management/use-index';
import { createSession } from '@/app/(private)/session-management/fetch';

type SessionManagementProps = {
  sessions: ActiveSession[];
};

export function SessionManagementClient({ sessions }: SessionManagementProps) {
  const router = useRouter();
  const { openSession, getAssignedSessionIds } = useIndex();
  const sessionList = useMemo(() => sessions ?? [], [sessions]);
  const [assignedIds, setAssignedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!sessionList.length) return;
      const ids = await getAssignedSessionIds(sessionList);
      if (cancelled) return; // 古いリクエスト捨てる
      setAssignedIds(new Set(ids));
    })();
    return () => {
      cancelled = true;
    };
  }, [sessionList, getAssignedSessionIds]);

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
              sessionList.map((s) => (
                <button
                  key={s.session_id}
                  onClick={() => openSession(s)}
                  className="text-left"
                >
                  <Card className="border mb-1 hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                    <CardContent>
                      <div>{formatDate(s.created_at)}</div>
                        <div className="flex items-start mt-2">
                          <span className="mr-2">
                            <RectangleGoggles size={30} />
                          </span>
                          <div className="flex flex-col">
                            <span className="text-lg font-semibold">セッションID: {s.session_id}</span>
                          <span
                              className={`mt-1 inline-block w-fit px-2 py-0.5 text-xs rounded ${
                                assignedIds.has(s.session_id)
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {assignedIds.has(s.session_id) ? 'セッション進行中' : 'マッチメイキング中'}
                            </span>
                          </div>
                        </div>
                    </CardContent>
                  </Card>
                </button>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="w-full max-w-md mx-auto mt-6 cursor-pointer" onClick={async () => {
        try {
          const res = await createSession();
          if (!res?.session_id) {
            alert('セッション作成に失敗しました');
            return;
          }
          router.push(`/session-management/matchmaking?session_id=${res.session_id}`);
        } catch {
          alert('セッション作成に失敗しました');
        }
      }}>
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
