'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MATCHMAKING_QUEUE_MAX_PLAYERS } from '@/constants/enum';
import { useMatchmaking } from '@/hooks/session-management/use-matchmaking';
import { Ban } from 'lucide-react';
import { useMemo } from 'react';
import { compareByManagementNumber } from '@/lib/sort';

export function MatchmakingClient() {
  // マッチメイキング待機は11台以上でも参加可能（運用上、11台目が混ざるケースがある）
  // ただ「セッション開始」は10台までに制限したいので、10を超えたら開始ボタンを無効化する
  const {
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
  } = useMatchmaking();
  const isQueueFull = matchmakingQueue.length > MATCHMAKING_QUEUE_MAX_PLAYERS;
  const sortedQueue = useMemo(
    () => [...matchmakingQueue].sort(compareByManagementNumber),
    [matchmakingQueue]
  );

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center pt-2">
        <p className="text-lg font-semibold">マッチメイキング</p>
        <p className="text-base mb-2">マッチメイキング中...</p>
        <p className="text-sm text-muted-foreground mb-2">{statusMessage}</p>
        {isQueueFull && (
          <div className="text-xs text-destructive mb-2 text-center leading-relaxed">
            <div>待機中が{MATCHMAKING_QUEUE_MAX_PLAYERS}台を超えています。</div>
            <div className='mt-1'>使用しないG-SCOPEを<span className="inline-flex items-center gap-1"><Ban className="h-3 w-3" /></span>ボタンで解除してください</div>
          </div>
        )}
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
              {sortedQueue.map((player) => (
                <div
                  key={player.player_id}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded border"
                >
                  <div className="font-medium">{player.management_number}</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-destructive/60 bg-destructive/10 hover:bg-destructive/15 hover:text-destructive/80 focus-visible:text-destructive/80"
                    onClick={() => handleRemoveFromQueue(player)}
                    disabled={sessionStatus || removingPlayerId !== null || connectionStatus !== 'connected'}
                  >
                    <Ban />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center gap-2">
        <Button
          onClick={handleSessionFinish}
          disabled={matchmakingQueue.length === 0 || isQueueFull || connectionStatus !== 'connected' || sessionStatus || removingPlayerId !== null}
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
