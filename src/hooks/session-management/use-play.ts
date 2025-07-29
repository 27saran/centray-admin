import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { endSession, forceEndSession } from '@/app/(private)/session-management/play/fetch';
import { API_ENDPOINTS } from '@/constants/endpoints';
import { connectSSE } from '@/lib/sse';
import { PlayerStatusData, PlayerStatusSSEData } from '@/types/player-status';
import { useCheckAuth } from '@/hooks/auth/use-auth-guard';
import { ConnectionStatus } from '@/types/sse';

export function usePlay() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const { checkAuth } = useCheckAuth();
  const abortControllerRef = useRef<AbortController | null>(null);
  const groupName = searchParams.get('group') ?? '不明なグループ';
  const sessionIdParam = searchParams.get('session_id');
  const sessionId = sessionIdParam ? Number(sessionIdParam) : null;
  const groupIdParam = searchParams.get('group_id');
  const groupId = groupIdParam ? Number(groupIdParam) : null;

  const [playerStatusData, setPlayerStatusData] = useState<PlayerStatusData[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  const [statusMessage, setStatusMessage] = useState('プレイヤー情報に接続中...');

  // SSE接続
  const initializeSSEConnection = useCallback(async () => {
    if (!sessionId) return;
    if (status === 'loading') return;

    // SSE接続があれば中断する
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    // 新しいAbortControllerを作成
    abortControllerRef.current = new AbortController();

    await checkAuth();

    setConnectionStatus('connecting');
    setStatusMessage('プレイヤー情報に接続中...');
    // 再接続時に古いデータをクリア
    setPlayerStatusData([]);

    connectSSE(
      API_ENDPOINTS.ADMIN.SSE.PLAYER_STATUS,
      session?.accessToken || '',
      (parsed) => {
        if (typeof parsed === 'object' && parsed !== null) {
          const data = parsed as PlayerStatusSSEData;
          if (groupId && data.group_status?.group_id !== groupId) {
            return;
          }
          // プレイヤーステータスデータを更新
          if (data.device_id && data.management_number !== undefined && data.status !== undefined) {
            setPlayerStatusData(prevData => {
              const existingIndex = prevData.findIndex(item => item.device_id === data.device_id);
              const newItem: PlayerStatusData = {
                device_id: data.device_id,
                management_number: data.management_number,
                status: data.status,
                last_connected_at: data.last_connected_at,
              };
              if (existingIndex >= 0) {
                const updatedData = [...prevData];
                updatedData[existingIndex] = newItem;
                setStatusMessage(`プレイヤー (${updatedData.length}人)`);
                return updatedData;
              } else {
                const newData = [...prevData, newItem];
                setStatusMessage(`プレイヤー (${newData.length}人)`);
                return newData;
              }
            });
          }
        }
      },
      (error) => {
        console.error('Player Status SSE エラー:', error);
        // AbortErrorは正常な中断なのでエラー状態にしなくていい
        if (error.name === 'AbortError') {
          return;
        }
        setConnectionStatus('error');
        setStatusMessage('プレイヤー情報の取得に失敗しました');
      },
      () => {
        console.log('Player Status SSE接続成功');
        setConnectionStatus('connected');
      },
      abortControllerRef.current.signal
    );
  }, [sessionId, groupId, status, checkAuth, session?.accessToken]);

  // Player Status SSE接続
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
  const handleReconnect = useCallback(async () => {
    setConnectionStatus('connecting');
    // 再接続が早すぎてUIに変化がないので明示的に1秒待つ
    await new Promise(resolve => setTimeout(resolve, 1000));
    initializeSSEConnection();
    (document.activeElement as HTMLElement)?.blur();
  }, [initializeSSEConnection]);

  const handleSessionEnd = async () => {
    if (sessionId) {
      await endSession(sessionId);
    }
    router.push('/session-management');
  };

  const handleSessionForceEnd = async () => {
    if (sessionId) {
      await forceEndSession(sessionId);
    }
    router.push('/session-management');
  };

  return {
    groupName,
    currentPhaseData: null,
    isSessionComplete: false,
    handleSessionEnd,
    handleSessionForceEnd,
    playerStatusData,
    connectionStatus,
    statusMessage,
    handleReconnect,
  };
}
