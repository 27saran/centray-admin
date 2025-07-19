'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMatching } from '@/hooks/session-management/use-matching';

type MatchingClientProps = {
  groupId?: number;
};

export function MatchingClient({ groupId }: MatchingClientProps) {
  const { data, statusMessage, connectionStatus, handleSessionStart } = useMatching(groupId);

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center pt-2">
        <p className="text-lg font-semibold mb-2">マッチング中...</p>
        <p className="text-sm text-muted-foreground mb-2">{statusMessage}</p>
        <div className="w-full h-60 overflow-y-auto border rounded-md p-2 mb-8">
          {data.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              {connectionStatus === 'error'
                ? 'マッチング情報の取得に失敗しました'
                : 'マッチング待機中のプレイヤーはいません'
              }
            </div>
          ) : (
            <div className="space-y-2">
              {data.map((matching) => (
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
      <CardFooter className="flex justify-center">
        <Button
          onClick={handleSessionStart}
          disabled={data.length === 0 || connectionStatus === 'error'}
        >
          セッション開始
        </Button>
      </CardFooter>
    </Card>
  );
}
