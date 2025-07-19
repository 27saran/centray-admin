import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { MatchingDataResponse, MatchingSSEEventResponse } from '@/types/session-management';
import { startMatching } from '@/app/(private)/session-management/matching/fetch';
import { API_ENDPOINTS } from '@/constants/endpoints';
import { connectSSE } from '@/lib/sse';

export function useMatching(groupId?: number) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [data, setData] = useState<MatchingDataResponse[]>([]);
  const [statusMessage, setStatusMessage] = useState('マッチング情報に接続中...');
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');

  // Matching SSE接続
  useEffect(() => {
    if (!session?.accessToken || !groupId) {
      setStatusMessage(groupId ? 'セッション情報の取得に失敗しました' : 'グループIDが指定されていません');
      setConnectionStatus('error');
      return;
    }

    setConnectionStatus('connecting');
    setStatusMessage('マッチング情報に接続中...');

    connectSSE(
      API_ENDPOINTS.ADMIN.SSE.MATCHMAKING,
      session.accessToken,
      (parsed) => {
        const sseData = parsed as MatchingSSEEventResponse;
        setData(sseData.queue);
        setStatusMessage(`マッチング待機中 (${sseData.queue.length}人)`);
      },
      (error) => {
        console.error('SSEエラー:', error);
        setConnectionStatus('error');
        setStatusMessage('マッチング情報の取得に失敗しました');
      },
      () => {
        setConnectionStatus('connected');
      }
    );

    return () => {
      setConnectionStatus('connecting');
    };
  }, [session?.accessToken, groupId, router]);

  const handleSessionStart = async () => {
    if (data.length === 0) {
      alert('マッチング中のプレイヤーがいません');
      return;
    }

    if (window.confirm('セッションを開始します。\nよろしいですか？')) {
      const params = new URLSearchParams();
      if (groupId) params.set('group_id', String(groupId));

      const sessionId = searchParams.get('session_id');
      if (sessionId) params.set('session_id', sessionId);
      if (sessionId && groupId) {
        const result = await startMatching(Number(sessionId), groupId);

        console.log(result);

        // TicketIDを使ってmatching_statusのSSE接続を開始
        if (result.success && result.result?.TicketID) {
          console.log('Matching Status SSE接続開始 - TicketID:', result.result.TicketID);

          connectSSE(
            API_ENDPOINTS.ADMIN.SSE.MATCHING_STATUS,
            session?.accessToken || '',
            (parsed) => {
              console.log('Matching Status SSE データ受信:', parsed);
            },
            (error) => {
              console.error('Matching Status SSEエラー:', error);
            },
            () => {
              console.log('Matching Status SSE接続成功');
            }
          );
        }

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
