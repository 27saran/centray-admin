'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMatchmaking } from '@/hooks/session-management/use-matchmaking';

type MatchmakingClientProps = {
  groupId?: number;
  groupName?: string;
};

export function MatchmakingClient({ groupId, groupName }: MatchmakingClientProps) {
  const { matchmakingQueue, statusMessage, connectionStatus, sessionStatus, deleting, handleSessionFinish, handleReconnect, handleSessionDelete } = useMatchmaking(groupId);

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center pt-2">
        <p className="text-lg font-semibold">{groupName ?? (groupId ? `#${groupId}` : '不明なグループ')}</p>
        <p className="text-base mb-2">マッチメイキング中...</p>
        <p className="text-sm text-muted-foreground mb-2">{statusMessage}</p>
        <div className="w-full h-60 overflow-y-auto border rounded-md p-2 mb-8">
          {matchmakingQueue.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              {connectionStatus === 'error'
                ? 'マッチメイキング情報の取得に失敗しました'
                : 'マッチメイキング待機中のプレイヤーはいません'
              }
            </div>
          ) : (
            <div className="space-y-2">
              {matchmakingQueue.map((player) => (
                <div
                  key={player.player_id}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded border"
                >
                  <div className="font-medium">{player.management_number}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center gap-2">
        <Button
          onClick={handleSessionFinish}
          disabled={matchmakingQueue.length === 0 || connectionStatus !== 'connected' || sessionStatus}
        >
          {sessionStatus ? 'セッション開始中...' : 'セッション開始'}
        </Button>
        <Button
          onClick={handleReconnect}
          variant="outline"
          disabled={connectionStatus === 'connecting' || sessionStatus}
        >
          {connectionStatus === 'connecting' ? '接続中...' : '再接続'}
        </Button>
        <Button
          onClick={handleSessionDelete}
          variant="destructive"
          disabled={sessionStatus || deleting}
        >
          {deleting ? '削除中...' : '削除'}
        </Button>
      </CardFooter>
    </Card>
  );
}
