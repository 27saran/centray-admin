import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { endSession, forceEndSession } from '@/app/(private)/session-management/play/fetch';
import { API_ENDPOINTS } from '@/constants/endpoints';
import { connectSSE } from '@/lib/sse';
import { PlayerStatusData, PlayerStatusSSEData } from '@/types/player-status';

export function usePlay() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const groupName = searchParams.get('group') ?? '不明なグループ';
  const sessionIdParam = searchParams.get('session_id');
  const sessionId = sessionIdParam ? Number(sessionIdParam) : null;
  const groupIdParam = searchParams.get('group_id');
  const groupId = groupIdParam ? Number(groupIdParam) : null;

  const [playerStatusData, setPlayerStatusData] = useState<PlayerStatusData[]>([]);

  // Player Status SSE接続
  useEffect(() => {
    if (!session?.accessToken || !sessionId) {
      return;
    }

    console.log('Player Status SSE接続開始');

    connectSSE(
      API_ENDPOINTS.ADMIN.SSE.PLAYER_STATUS,
      session.accessToken,
      (parsed) => {
        console.log('Player Status SSE データ:', parsed);

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
                return updatedData;
              } else {
                return [...prevData, newItem];
              }
            });
          }
        }
      },
      (error) => {
        console.error('Player Status SSE エラー:', error);
      }
    );
  }, [session?.accessToken, sessionId, groupId]);

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
  };
}
