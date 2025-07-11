import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { MatchingData, MatchingSSEEvent } from '@/types/session-management';
import { startMatching } from '@/app/(private)/session-management/matching/fetch';

export function useMatching(groupId?: number) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [data, setData] = useState<MatchingData[]>([]);
  const [statusMessage, setStatusMessage] = useState('マッチング情報に接続中...');
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');

  useEffect(() => {
    if (!session?.accessToken || !groupId) {
      setStatusMessage(groupId ? 'セッション情報の取得に失敗しました' : 'グループIDが指定されていません');
      setConnectionStatus('error');
      return;
    }

    setConnectionStatus('connecting');
    setStatusMessage('マッチング情報に接続中...');

    // SSEはクライアントコンポーネントでのみ動作するためhooksで定義する
    const connectSSE = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        if (!backendUrl) throw new Error('Backend URL is not defined');

        const response = await fetch(`${backendUrl}/api/admin/sse?stream=matching`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
            'Accept': 'text/event-stream',
          },
        });

        if (!response.ok || !response.body) throw new Error('SSE接続失敗');

        const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
        setConnectionStatus('connected');

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          value.split('\n').forEach(line => {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data.trim()) {
                try {
                  const parsed = JSON.parse(data) as MatchingSSEEvent;
                  if (parsed.type === 'PLAYER_JOINED') {
                    const filteredPlayers = parsed.queue.filter(player => player.group_id === groupId);
                    setData(filteredPlayers);
                    setStatusMessage(`マッチング待機中 (${filteredPlayers.length}人)`);
                  }
                } catch (e) {
                  console.error('SSEデータパースエラー:', e);
                }
              }
            }
          });
        }
      } catch (error) {
        console.error('SSEエラー:', error);
        setConnectionStatus('error');
        setStatusMessage('マッチング情報の取得に失敗しました');
      }
    };

    connectSSE();

    return () => {
      setConnectionStatus('connecting');
    };
  }, [session?.accessToken, groupId]);

  const handleSessionStart = async () => {
    if (data.length === 0) {
      alert('マッチング中のプレイヤーがいません');
      return;
    }

    if (window.confirm('セッションを開始します。\nよろしいですか？')) {
      const params = new URLSearchParams();
      if (groupId) params.set('group_id', String(groupId));

      const sessionId = searchParams.get('session_id');
      if (sessionId && groupId) {
        const result = await startMatching(Number(sessionId), groupId);

        console.log(result);

        if (!result.success) {
          alert(result.error || 'マッチング開始に失敗しました');
          return;
        }
      }
      router.push(`/session-management/play?${params.toString()}`);
    }
  };

  return {
    data,
    statusMessage,
    connectionStatus,
    handleSessionStart,
  };
}
