import { useEffect, useCallback, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { MatchingSSEEventResponse, MatchingDataResponse } from '@/types/session-management';
import { SessionFinish } from '@/app/(private)/session-management/matching/fetch';
import { API_ENDPOINTS } from '@/constants/endpoints';
import { connectSSE } from '@/lib/sse';
import { useCheckAuth } from '@/hooks/auth/use-auth-guard';
import { ConnectionStatus } from '@/types/sse';

export function useMatching(groupId?: number) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const { checkAuth } = useCheckAuth();
  const abortControllerRef = useRef<AbortController | null>(null);
  const [sessionStatus, setSessionStatus] = useState(false);

  const [matchings, setMatchings] = useState<MatchingDataResponse[]>([]);
  const [statusMessage, setStatusMessage] = useState('マッチング情報に接続中...');
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');

  // SSE接続
  const initializeSSEConnection = useCallback(async () => {
    if (!groupId) return;
    if (status === 'loading') return;
    // 古いSSE接続があれば中断して新しい接続を準備する
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    await checkAuth();

    setConnectionStatus('connecting');
    setStatusMessage('マッチング情報に接続中...');

    connectSSE(
      API_ENDPOINTS.ADMIN.SSE.MATCHMAKING,
      session?.accessToken || '',
      (parsed) => {
        const sseData = parsed as MatchingSSEEventResponse;
        setMatchings(sseData.queue);
        setStatusMessage(`マッチング待機中 (${sseData.queue.length}人)`);
      },
      (error) => {
        console.error('SSEエラー:', error);
        // AbortErrorは正常な中断なのでエラー状態にしなくていい
        if (error.name === 'AbortError') {
          return;
        }
        setConnectionStatus('error');
        setStatusMessage('マッチング情報の取得に失敗しました');
      },
      () => {
        console.log('SSE接続成功');
        setConnectionStatus('connected');
      },
      abortControllerRef.current.signal
    );
  }, [groupId, status, checkAuth, session?.accessToken]);

  useEffect(() => {
    initializeSSEConnection();
    return () => {
      // クリーンアップ時にSSE接続を中断
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      setConnectionStatus('connecting');
    };
  }, [initializeSSEConnection]);

  // 再接続ボタン
  // これ押したら古いSSE接続を中断して新しい接続を準備する（マッチング待機にデータが入らなかった時とかに押す）
  const handleReconnect = useCallback(async () => {
    setConnectionStatus('connecting');
    // 再接続が早すぎてUIに変化がないので明示的に1秒待つ
    await new Promise(resolve => setTimeout(resolve, 1000));
    initializeSSEConnection();
    (document.activeElement as HTMLElement)?.blur();
  }, [initializeSSEConnection]);

  // セッション開始ボタン
  const handleSessionFinish = async () => {
    if (window.confirm('セッションを開始します。\nよろしいですか？')) {
      setSessionStatus(true);
      try {
        const params = new URLSearchParams();
        if (groupId) params.set('group_id', String(groupId));

        const sessionId = searchParams.get('session_id');
        if (sessionId) params.set('session_id', sessionId);

        if (sessionId && groupId) {
          const response = await SessionFinish(Number(sessionId), groupId);

          await checkAuth();

          if (!response.success) {
            alert(`マッチングに失敗しました: ${response.error}`);
          }
        }

        setSessionStatus(false);
        router.push(`/session-management/play?${params.toString()}`);
      } catch (error) {
        setSessionStatus(false);
        if (error instanceof Error && error.message !== 'マッチング失敗') {
          console.error('セッション開始エラー:', error);
          alert('セッション開始に失敗しました');
        }
      }
    }
  };

  return {
    matchings,
    statusMessage,
    connectionStatus,
    sessionStatus,
    handleSessionFinish,
    handleReconnect,
  };
}
