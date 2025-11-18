import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import type { ActiveSession } from '@/types/session-management';
import { getGameServerInfos } from '@/app/(private)/session-management/fetch';

export function useIndex() {
  const router = useRouter();
  const [selectedGroup, setSelectedGroup] = useState<string>('');

  /**
   * セッション一覧からの詳細クリック時、ゲームサーバ割当の有無を確認して遷移先を変える
   * - 割当あり → プレイ画面へ遷移する
   * - 割当なし → マッチメイキング画面へ遷移する
   */
  const openSession = useCallback(async (s: ActiveSession) => {
    const infos = await getGameServerInfos(s.session_id);
    const hasAssignment = Array.isArray(infos) && infos.length > 0;
    // クエリパラメータ生成
    const queryString = new URLSearchParams({
      group_id: String(s.group_id),
      session_id: String(s.session_id),
    }).toString();

    if (hasAssignment) {
      router.push(`/session-management/play?${queryString}`);
      return;
    }
    router.push(`/session-management/matchmaking?${queryString}`);
    return;
  }, [router]);

  const getAssignedSessionIds = useCallback(async (sessions: ActiveSession[]): Promise<number[]> => {
    const settled = await Promise.allSettled(
      sessions.map((s) =>
        getGameServerInfos(s.session_id).then((infos) => Array.isArray(infos) && infos.length > 0)
      )
    );
    const assignedIds: number[] = [];
    for (let idx = 0; idx < settled.length; idx += 1) {
      const res = settled[idx] as PromiseSettledResult<boolean>;
      const session = sessions[idx];
      if (!session) continue;
      if (res.status === 'fulfilled' && res.value) {
        assignedIds.push(session.session_id);
      }
    }
    return assignedIds;
  }, []);

  return {
    selectedGroup,
    setSelectedGroup,
    openSession,
    getAssignedSessionIds,
  };
}

