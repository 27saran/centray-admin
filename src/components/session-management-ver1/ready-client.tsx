'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

type ReadyClientProps = {
  DeviceSource: string[];
};

function ReadyContent({ DeviceSource }: ReadyClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupName = searchParams.get('group') ?? '不明なグループ';
  const matchedCountStr = searchParams.get('total') ?? '?';
  const matchedCount = parseInt(matchedCountStr, 10);

  const handleContentStart = () => {
    const params = new URLSearchParams();
    params.set('group', groupName);
    router.push(`/session-management-ver1/matching/ready/play?${params.toString()}`);
  };

  const handleGoBackToSelection = () => {
    router.push('/session-management-ver1');
  };

  const devicesToShow = DeviceSource.slice(0, isNaN(matchedCount) ? DeviceSource.length : matchedCount);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>参加準備完了</CardTitle>
        <CardDescription className="pt-2">
          {groupName}の端末が揃いました ({matchedCountStr}台)
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center pt-4">
        <p className="text-lg font-semibold mb-4">参加端末一覧</p>
        <div className="w-full h-60 overflow-y-auto border rounded-md p-2">
          {devicesToShow.length > 0 ? (
            <ul>
              {devicesToShow.map((device, index) => (
                <li key={index} className="flex items-center p-2 border-b last:border-b-0">
                  <span>{device}</span>
                  <span className="ml-auto text-sm text-green-600">正常</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground text-center pt-4">参加端末はありません。</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-4 pt-6">
        <Button className="w-full" onClick={handleContentStart}>
          コンテンツ開始
        </Button>
        <Button variant="outline" className="w-full" onClick={handleGoBackToSelection}>
          選択画面に戻る
        </Button>
      </CardFooter>
    </Card>
  );
}

export function ReadyClient({ DeviceSource }: ReadyClientProps) {
  return (
    <Suspense fallback={<div>参加情報読み込み中...</div>}>
      <ReadyContent DeviceSource={DeviceSource} />
    </Suspense>
  );
}
