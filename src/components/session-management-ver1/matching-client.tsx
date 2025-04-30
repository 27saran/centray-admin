'use client';

import { useState, useEffect, Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';

type MatchingClientProps = {
  initialGroupName: string;
  DeviceSource: string[];
};

function MatchingContent({ initialGroupName, DeviceSource }: MatchingClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalQuery = searchParams.get('total');
  const groupNameQuery = searchParams.get('group');

  const total = parseInt(totalQuery ?? '0');
  const groupName = groupNameQuery ?? initialGroupName;

  const [current, setCurrent] = useState(0);
  const [devices, setDevices] = useState<string[]>([]);
  const [isMatchingComplete, setIsMatchingComplete] = useState(false);

  useEffect(() => {
    if (isMatchingComplete || total <= 0) return;
    if (current >= total) {
      if (!isMatchingComplete) {
        setIsMatchingComplete(true);
      }
      return;
    }

    const intervalId = setInterval(() => {
      setCurrent((prevCurrent) => {
        const nextCurrent = prevCurrent + 1;
        if (nextCurrent >= total) {
          setIsMatchingComplete(true);
        }
        return nextCurrent;
      });

      setDevices((prevDevices) => {
        const nextDeviceIndex = prevDevices.length % DeviceSource.length;
        const nextDevice = DeviceSource[nextDeviceIndex];
        if (typeof nextDevice === 'string') {
          return [...prevDevices, nextDevice];
        } else {
          console.warn('端末名が取得できません');
          return prevDevices;
        }
      });
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [total, isMatchingComplete, DeviceSource]);

  useEffect(() => {
    if (isMatchingComplete) {
      const params = new URLSearchParams();
      params.set('group', groupName);
      params.set('total', String(total));
      router.push(`/session-management-ver1/matching/ready?${params.toString()}`);
    }
  }, [isMatchingComplete, router, groupName, total]);

  const handleGoBack = () => {
    router.back();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="flex flex-col items-center pt-8">
        <p className="text-lg font-semibold mb-2">{isMatchingComplete ? 'マッチング完了' : 'マッチング中...'}</p>
        <p className="text-sm text-muted-foreground mb-4">{groupName}</p>
        <p className="text-4xl font-bold mb-8">
          {current} / {total}
        </p>
        <div className="w-full h-60 overflow-y-auto border rounded-md p-2">
          {devices.length > 0 ? (
            <ul className="space-y-1">
              {devices.map((device, index) => (
                <li key={index} className="p-2 border-b last:border-b-0">
                  {device}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground text-center pt-4">端末を待っています...</p>
          )}
        </div>
        {!isMatchingComplete && (
          <Button variant="outline" className="mt-8" onClick={handleGoBack}>
            キャンセル
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function MatchingClient({ initialGroupName, DeviceSource }: MatchingClientProps) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <MatchingContent initialGroupName={initialGroupName} DeviceSource={DeviceSource} />
    </Suspense>
  );
}

function LoadingFallback() {
  return <div className="flex justify-center items-center min-h-screen">マッチング情報読み込み中...</div>;
}
