import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { GroupDetailResponse } from '@/types/device-group';
import { createMatchmakingSession } from '@/app/(private)/session-management/lobby/fetch';
import { formatDate } from '@/lib/format';

export function useLobby(groups: GroupDetailResponse[]) {
  const router = useRouter();
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleMatchMaking = async () => {
    if (!selectedGroup) {
      setError('グループを選択してください。');
      return;
    }
    setError(null);
    setLoading(true);

    const group = groups.find(g => String(g.id) === selectedGroup);
    if (!group) {
      setError('グループ情報が見つかりません');
      setLoading(false);
      return;
    }

    const now = new Date().toISOString();
    const sessionName = `${formatDate(now)} ${group.name}`;
    const sessionRes = await createMatchmakingSession(sessionName, Number(selectedGroup));
    if (!sessionRes.success || !sessionRes.data) {
      setError(sessionRes.error || 'マッチメイキングセッション作成に失敗しました');
      setLoading(false);
      return;
    }
    const sessionId = sessionRes.data.session_id;

    const params = new URLSearchParams();
    params.set('group_id', selectedGroup);
    params.set('session_id', String(sessionId));
    router.push(`/session-management/matching?${params.toString()}`);
    setLoading(false);
  };

  return {
    selectedGroup,
    setSelectedGroup,
    handleMatchMaking,
    error,
    loading,
  };
}