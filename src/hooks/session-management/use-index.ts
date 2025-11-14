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
    try {
      // ゲームサーバ割当確認
      const infos = await getGameServerInfos(s.session_id);
      if (Array.isArray(infos) && infos.length > 0) {
        router.push(`/session-management/play?group_id=${s.group_id}&${new URLSearchParams({ session_id: String(s.session_id) }).toString()}`);
        return;
      }
      router.push(`/session-management/matchmaking?group_id=${s.group_id}&${new URLSearchParams({ session_id: String(s.session_id) }).toString()}`);
      return;
    } catch (e) {
      console.error(e);
      return;
    }
  }, [router]);

  // セッションにゲームサーバ割当が存在するかを判定する
  // true: 割当あり（セッション進行中） / false: 割当なし（マッチメイキング中）
  const checkAssigned = useCallback(async (sessionId: number): Promise<boolean> => {
    try {
      const infos = await getGameServerInfos(sessionId);
      return Array.isArray(infos) && infos.length > 0;
    } catch {
      return false;
    }
  }, []);

  // 割当がある session_id の配列を返す
  const getAssignedSessionIds = useCallback(async (sessions: ActiveSession[]): Promise<number[]> => {
    const results = await Promise.all(
      sessions.map(async (s) => ({
        id: s.session_id,
        assigned: await checkAssigned(s.session_id),
      }))
    );
    return results.filter(r => r.assigned).map(r => r.id);
  }, [checkAssigned]);

  return {
    selectedGroup,
    setSelectedGroup,
    openSession,
    checkAssigned,
    getAssignedSessionIds,
  };
}

