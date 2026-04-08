import { useEffect, useCallback, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { MatchmakingSSEEventResponse, MatchmakingDataResponse } from '@/types/session-management';
import { startMatching, removePlayerFromMatchmakingQueue, deleteMatchmakingSession, getCurrentMatchmakingQueue } from '@/app/(private)/session-management/matchmaking/fetch';
import { API_ENDPOINTS } from '@/constants/endpoints';
import { connectSSE } from '@/lib/sse';
import { useCheckAuth } from '@/hooks/auth/use-auth-guard';
import { ConnectionStatus } from '@/types/sse';

export function useMatchmaking() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const { checkAuth } = useCheckAuth();
  const abortControllerRef = useRef<AbortController | null>(null);
  const deletingRef = useRef(false);
  const [sessionStatus, setSessionStatus] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [removingPlayerId, setRemovingPlayerId] = useState<number | null>(null);
  const sessionId = searchParams.get('session_id') ? Number(searchParams.get('session_id')) : null;

  const [matchmakingQueue, setMatchmakingQueue] = useState<MatchmakingDataResponse[]>([]);
  const matchmakingQueueRef = useRef<MatchmakingDataResponse[]>([]);
  const [statusMessage, setStatusMessage] = useState('マッチメイキング情報に接続中...');
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');

  const fetchCurrentMatchmakingQueue = useCallback(async () => {
    if (!sessionId) return;
    try {
      const res = await getCurrentMatchmakingQueue(sessionId);
      if (res?.success) {
        const queue = res.queue ?? [];
        setMatchmakingQueue(queue);
        matchmakingQueueRef.current = queue;
      }
    } catch (e) {
      console.error('マッチメイキングキュー取得エラー:', e);
    }
  }, [sessionId]);

  // SSE接続
  const initializeMatchmakingConnection = useCallback(async () => {
    if (status === 'loading') return;
    if (!sessionId) return;
    // SSE接続があれば中断する
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    // 新しいAbortControllerを作成
    abortControllerRef.current = new AbortController();

    await checkAuth();

    setConnectionStatus('connecting');

    await fetchCurrentMatchmakingQueue();

    connectSSE(
      API_ENDPOINTS.ADMIN.SSE.MATCHMAKING(sessionId),
      session?.accessToken || '',
      (parsed) => {
        const sseData = parsed as MatchmakingSSEEventResponse;
        setMatchmakingQueue(sseData.queue);
        matchmakingQueueRef.current = sseData.queue;
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
  }, [status, checkAuth, session?.accessToken, fetchCurrentMatchmakingQueue, sessionId]);

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

  // セッション削除ボタン
  const handleSessionDelete = useCallback(async () => {
    if (deletingRef.current) return;
    const sessionId = searchParams.get('session_id');
    const confirmed = window.confirm('このセッションを削除します。\nよろしいですか？');
    if (!confirmed) return;
    try {
      deletingRef.current = true;
      setDeleting(true);
      if (sessionId) {
        const result = await deleteMatchmakingSession(Number(sessionId));
        if (!result.success) {
          alert(result.error || 'セッション削除に失敗しました');
          return;
        }
      }
      // SSE切断
      abortControllerRef.current?.abort();
      router.push('/session-management');
    } catch (e) {
      console.error('セッション削除エラー:', e);
      alert('セッション削除に失敗しました');
    } finally {
      deletingRef.current = false;
      setDeleting(false);
    }
  }, [searchParams, router]);

  // セッション開始ボタン（セッションは作成済み、マッチング開始のみ）
  const handleSessionFinish = async () => {
    if (!sessionId) {
      alert('セッションIDが不明です');
      return;
    }
    if (!window.confirm('セッションを開始します。\nよろしいですか？')) return;
    setSessionStatus(true);
    const queueSnapshot = [...matchmakingQueueRef.current];

    try {
      await checkAuth();
      const res = await startMatching(undefined, sessionId);

      if (!res.success) {
        alert(`マッチメイキングに失敗しました: ${res.error}`);
        router.push('/session-management');
        return;
      }

      const data = res.result!;

      if (data.matched_player_sessions) {
        const matchedDeviceIds = data.matched_player_sessions
          .map(ps => queueSnapshot.find(q => String(q.player_id) === ps.PlayerID)?.device_id)
          .filter((id): id is number => id !== undefined);
        sessionStorage.setItem(`session_devices:${sessionId}`, JSON.stringify(matchedDeviceIds));
      }

      router.push(`/session-management/play?session_id=${sessionId}`);
    } catch (error) {
      console.error('セッション開始エラー:', error);
      alert('セッション開始に失敗しました');
      router.push('/session-management');
    } finally {
      setSessionStatus(false);
    }
  };

  // マッチング解除ボタン
  const handleRemoveFromQueue = useCallback(async (player: MatchmakingDataResponse) => {
    if (removingPlayerId !== null) return;

    const confirmed = window.confirm(`マッチング解除します\n対象: ${player.management_number}\n本当によろしいですか？`);
    if (!confirmed) {
      (document.activeElement as HTMLElement | null)?.blur?.();
      return;
    }

    try {
      setRemovingPlayerId(player.player_id);
      await checkAuth();
      const res = await removePlayerFromMatchmakingQueue(player.player_id);
      if (!res.success) {
        alert(res.error || 'マッチング解除に失敗しました');
        return;
      }
    } catch (e) {
      console.error('マッチング解除エラー:', e);
      alert('マッチング解除に失敗しました');
    } finally {
      setRemovingPlayerId(null);
    }
  }, [removingPlayerId, checkAuth]);

  return {
    matchmakingQueue,
    statusMessage,
    connectionStatus,
    sessionStatus,
    deleting,
    removingPlayerId,
    handleSessionFinish,
    handleReconnect,
    handleSessionDelete,
    handleRemoveFromQueue,
  };
}
