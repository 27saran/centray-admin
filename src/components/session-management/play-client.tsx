'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePlay } from '@/hooks/session-management/use-play';
import { PLAYER_STATUS_CODE, PLAYER_STATUS } from '@/constants/enum';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { compareByManagementNumber } from '@/lib/sort';

export function PlayClient() {
  const {
    handleSessionForceEnd,
    playerStatusData,
    connectionStatus,
    statusMessage,
    handleReconnect,
    phaseProgress,
    getPhaseNames,
    errorCount,
    isInitialDataReceived,
    isGameFinished,
  } = usePlay();
  const [showFinishedModal, setShowFinishedModal] = useState(false);

  const sortedPlayerStatusData = useMemo(
    () => [...playerStatusData].sort(compareByManagementNumber),
    [playerStatusData]
  );

  useEffect(() => {
    if (isGameFinished) {
      setShowFinishedModal(true);
    }
  }, [isGameFinished]);

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center">
        <Button
            className="flex-1 bg-red-600 hover:bg-red-700 mb-4"
            onClick={handleSessionForceEnd}
            disabled={connectionStatus === 'connecting' || isGameFinished}
          >
            セッション全体の緊急停止
        </Button>
        <p className="text-lg font-semibold mb-2 text-center mt-2">
          セッション参加中の<br />端末一覧
        </p>
        <p className="text-sm text-muted-foreground mb-2">{statusMessage}</p>
        {errorCount > 0 && (
          <p className="text-sm text-red-600 font-medium mb-2">
            接続エラー数: {errorCount}台
          </p>
        )}
        <div className="w-full h-60 overflow-y-auto border rounded-md p-2 my-4">
          {playerStatusData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              {connectionStatus === 'error'
                ? 'プレイヤー情報の取得に失敗しました'
                : '端末データを取得中...'
              }
            </div>
          ) : (
            <ul>
              {sortedPlayerStatusData.map((player) => (
                <li key={player.device_id} className="flex items-center p-2 border-b last:border-b-0">
                  <span>{player.management_number}</span>
                  <span className={`ml-auto text-sm ${
                    player.status === PLAYER_STATUS_CODE.CONNECTED ? 'text-green-600' :
                    player.status === PLAYER_STATUS_CODE.DISCONNECTED ? 'text-red-600' :
                    player.status === PLAYER_STATUS_CODE.TIMEOUT ? 'text-yellow-600' :
                    'text-gray-600'
                  }`}>
                    {PLAYER_STATUS[player.status as keyof typeof PLAYER_STATUS] ?? '不明'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <p className="text-sm font-medium text-blue-800 mb-1 text-center">
          ゲーム進行状況
        </p>
        <div className="w-full mb-4 p-3 bg-blue-50 rounded-md border">
          <div className="flex flex-col items-center space-y-1">
            {phaseProgress && phaseProgress.phases && phaseProgress.phases.length > 0 ? (
              getPhaseNames().map((phaseName, index) => (
                <div key={index} className="text-sm text-blue-700 font-medium">
                  {phaseName}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center">
                {isInitialDataReceived ? 'フェーズ情報なし' : 'フェーズ情報を取得中...'}
              </p>
            )}
          </div>
        </div>
        <div className="flex mt-4">
          <Button className="flex-1" asChild>
            <Link href="/session-management">
              一覧へ戻る
            </Link>
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          onClick={handleReconnect}
          variant="outline"
          disabled={connectionStatus === 'connecting'}
        >
          {connectionStatus === 'connecting' ? '接続中...' : '再接続'}
        </Button>
      </CardFooter>
      <Dialog open={showFinishedModal} onOpenChange={setShowFinishedModal}>
        <DialogContent className="py-10 sm:py-10 min-h-50">
          <DialogHeader>
            <DialogTitle>セッションが完了しました</DialogTitle>
            <DialogDescription>
              一覧へ戻って新しいセッションを開始してください。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button asChild>
              <Link href="/session-management">一覧へ戻る</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
