import { useEffect, useCallback, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { MatchmakingSSEEventResponse, MatchmakingDataResponse } from '@/types/session-management';
import { SessionFinish, deleteMatchmakingSession } from '@/app/(private)/session-management/matchmaking/fetch';
import { API_ENDPOINTS } from '@/constants/endpoints';
import { connectSSE } from '@/lib/sse';
import { useCheckAuth } from '@/hooks/auth/use-auth-guard';
import { ConnectionStatus } from '@/types/sse';

export function useMatchmaking(groupId?: number) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const { checkAuth } = useCheckAuth();
  const abortControllerRef = useRef<AbortController | null>(null);
  const [sessionStatus, setSessionStatus] = useState(false);

  const [matchmakingQueue, setMatchmakingQueue] = useState<MatchmakingDataResponse[]>([]);
  const [statusMessage, setStatusMessage] = useState('マッチメイキング情報に接続中...');
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');

  // SSE接続
  const initializeMatchmakingConnection = useCallback(async () => {
    if (!groupId) return;
    if (status === 'loading') return;
    // SSE接続があれば中断する
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    // 新しいAbortControllerを作成
    abortControllerRef.current = new AbortController();

    await checkAuth();

    setConnectionStatus('connecting');
    setStatusMessage('マッチメイキング情報に接続中...');

    connectSSE(
      API_ENDPOINTS.ADMIN.SSE.MATCHMAKING(groupId),
      session?.accessToken || '',
      (parsed) => {
        const sseData = parsed as MatchmakingSSEEventResponse;
        setMatchmakingQueue(sseData.queue);
        setStatusMessage(`マッチメイキング待機中 (${sseData.queue.length}人)`);
      },
      (error) => {
        console.error('SSEエラー:', error);
        // AbortErrorは正常な中断なのでエラー状態にしなくていい
        if (error.name === 'AbortError') {
          return;
        }
        setConnectionStatus('error');
        setStatusMessage('マッチメイキング情報の取得に失敗しました');
      },
      () => {
        console.log('SSE接続成功');
        setConnectionStatus('connected');
      },
      abortControllerRef.current.signal
    );
  }, [groupId, status, checkAuth, session?.accessToken]);

  useEffect(() => {
    initializeMatchmakingConnection();
    return () => {
      // クリーンアップ時にSSE接続を中断
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      setConnectionStatus('connecting');
    };
  }, [initializeMatchmakingConnection]);

  // 再接続ボタン
  const handleReconnect = useCallback(async () => {
    setConnectionStatus('connecting');
    // 再接続が早すぎてUIに変化がないので明示的に1秒待つ
    await new Promise(resolve => setTimeout(resolve, 1000));
    initializeMatchmakingConnection();
    (document.activeElement as HTMLElement)?.blur();
  }, [initializeMatchmakingConnection]);

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
            await deleteMatchmakingSession(Number(sessionId), groupId);
            alert(`マッチメイキングに失敗しました: ${response.error}`);
            router.push('/session-management');
            return;
          }
        }

        setSessionStatus(false);
        router.push(`/session-management/play?${params.toString()}`);
      } catch (error) {
        setSessionStatus(false);
        if (error instanceof Error && error.message !== 'マッチメイキング失敗') {
          console.error('セッション開始エラー:', error);
          alert('セッション開始に失敗しました');
          const sessionId = searchParams.get('session_id');
          if (sessionId && groupId) {
            await deleteMatchmakingSession(Number(sessionId), groupId);
          }
          router.push('/session-management');
        }
      }
    }
  };

  return {
    matchmakingQueue,
    statusMessage,
    connectionStatus,
    sessionStatus,
    handleSessionFinish,
    handleReconnect,
  };
}
