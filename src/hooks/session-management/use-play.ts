import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { endSession, forceEndSession } from '@/app/(private)/session-management/play/fetch';
import { API_ENDPOINTS } from '@/constants/endpoints';

type PlayerStatusData = {
  device_id: number;
  management_number: string;
  status: number;
  last_connected_at: number;
};

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

    const connectPlayerStatusSSE = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        if (!backendUrl) throw new Error('Backend URL is not defined');

        const response = await fetch(`${backendUrl}${API_ENDPOINTS.ADMIN.SSE.PLAYER_STATUS}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
            'Accept': 'text/event-stream',
          },
        });

        if (!response.ok || !response.body) throw new Error('Player Status SSE接続失敗');

        const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
        console.log('Player Status SSE接続開始');

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          value.split('\n').forEach(line => {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data.trim()) {
                try {
                  const parsed = JSON.parse(data);
                  console.log('Player Status SSE データ:', parsed);
                  if (groupId && parsed.group_status?.group_id !== groupId) {
                    return; // group_idが一致しない場合は処理をスキップ
                  }
                  // プレイヤーステータスデータを更新
                  if (parsed.device_id && parsed.management_number !== undefined && parsed.status !== undefined) {
                    setPlayerStatusData(prevData => {
                      const existingIndex = prevData.findIndex(item => item.device_id === parsed.device_id);
                      const newItem: PlayerStatusData = {
                        device_id: parsed.device_id,
                        management_number: parsed.management_number,
                        status: parsed.status,
                        last_connected_at: parsed.last_connected_at,
                      };
                      if (existingIndex >= 0) {
                        // 既存のデータを更新
                        const updatedData = [...prevData];
                        updatedData[existingIndex] = newItem;
                        return updatedData;
                      } else {
                        // 新しいデータを追加
                        return [...prevData, newItem];
                      }
                    });
                  }
                } catch (e) {
                  console.error('Player Status SSE データパースエラー:', e);
                  console.log('Raw data:', data);
                }
              }
            }
          });
        }
      } catch (error) {
        console.error('Player Status SSE エラー:', error);
      }
    };

    connectPlayerStatusSSE();
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
