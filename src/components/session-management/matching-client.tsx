'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMatching } from '@/hooks/session-management/use-matching';

type MatchingClientProps = {
  groupId?: number;
};

export function MatchingClient({ groupId }: MatchingClientProps) {
  const { matchings, statusMessage, connectionStatus, sessionStatus, handleSessionFinish, handleReconnect } = useMatching(groupId);

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center pt-2">
        <p className="text-lg font-semibold mb-2">マッチング中...</p>
        <p className="text-sm text-muted-foreground mb-2">{statusMessage}</p>
        <div className="w-full h-60 overflow-y-auto border rounded-md p-2 mb-8">
          {matchings.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              {connectionStatus === 'error'
                ? 'マッチング情報の取得に失敗しました'
                : 'マッチング待機中のプレイヤーはいません'
              }
            </div>
          ) : (
            <div className="space-y-2">
              {matchings.map((matching) => (
                <div
                  key={matching.player_id}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded border"
                >
                  <div className="font-medium">{matching.management_number}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center gap-2">
        <Button
          onClick={handleSessionFinish}
          disabled={matchings.length === 0 || connectionStatus !== 'connected' || sessionStatus}
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
      </CardFooter>
    </Card>
  );
}
