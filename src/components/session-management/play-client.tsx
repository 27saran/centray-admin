'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePlay } from '@/hooks/session-management/use-play';
import { PLAYER_STATUS, PLAYER_STATUS_CODE } from '@/constants/enum';

export function PlayClient() {
  const {
    handleSessionForceEnd,
    handleSessionEnd,
    playerStatusData,
  } = usePlay();

  // ステータス番号からテキストを取得する関数
  const getStatusText = (status: number) => {
    return (PLAYER_STATUS as any)[status] || "不明";
  };

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center">
        <p className="text-lg font-semibold mb-2 text-center mt-2">
          セッション参加中の<br />端末一覧
        </p>
        <div className="w-full h-60 overflow-y-auto border rounded-md p-2 my-4">
          <ul>
            {playerStatusData.length > 0 ? (
              playerStatusData.map((player) => (
                <li key={player.device_id} className="flex items-center p-2 border-b last:border-b-0">
                  <span>{player.management_number}</span>
                  <span className={`ml-auto text-sm ${
                    player.status === PLAYER_STATUS_CODE.CONNECTED ? 'text-green-600' :
                    player.status === PLAYER_STATUS_CODE.DISCONNECTED ? 'text-red-600' :
                    player.status === PLAYER_STATUS_CODE.TIMEOUT ? 'text-yellow-600' :
                    'text-gray-600'
                  }`}>
                    {getStatusText(player.status)}
                  </span>
                </li>
              ))
            ) : (
              <li className="flex items-center p-2 text-gray-500">
                <span>端末データを取得中...</span>
              </li>
            )}
          </ul>
        </div>
        <div className="flex gap-4 mt-4">
          <Button
            className="flex-1 bg-red-600 hover:bg-red-700"
            onClick={handleSessionForceEnd}
          >
            セッション全体の緊急停止
          </Button>
          <Button className="flex-1" onClick={handleSessionEnd}>
            セッション終了
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
