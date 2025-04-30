'use client';

import { useState, useEffect, Suspense } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';

type MatchingClientProps = {
  initialGroupName: string;
  DeviceSource: string[];
};

function MatchingContent({ initialGroupName, DeviceSource }: MatchingClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupNameQuery = searchParams.get('group');
  const groupName = groupNameQuery ?? initialGroupName;
  const [devices, setDevices] = useState<string[]>([]);
  const [isMatchingComplete, setIsMatchingComplete] = useState(false);
  const [statusMessage, setStatusMessage] = useState('マッチング待機中...');

  useEffect(() => {
    if (!Array.isArray(DeviceSource) || DeviceSource.length === 0) {
      setStatusMessage('端末リストの読み込みエラー');
      return;
    }
    if (isMatchingComplete) {
      setStatusMessage('マッチング完了');
      return;
    }

    setStatusMessage('マッチング中...');
    const deviceIntervalId = setInterval(() => {
      setDevices((prevDevices) => {
        const nextDeviceIndex = prevDevices.length % DeviceSource.length;
        const nextDevice = DeviceSource[nextDeviceIndex];
        if (typeof nextDevice === 'string') {
          return [...prevDevices, nextDevice];
        } else {
          return prevDevices;
        }
      });
    }, 1000);

    return () => {
      clearInterval(deviceIntervalId);
    };
  }, [isMatchingComplete, DeviceSource]);

  const handleCompleteAndNavigate = () => {
    setIsMatchingComplete(true);
    const params = new URLSearchParams();
    params.set('group', groupName);
    params.set('devicesCount', String(devices.length));
    router.push(`/session-management-ver2/matching/ready?${params.toString()}`);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="flex flex-col items-center pt-8">
        <p className="text-lg font-semibold mb-2">{statusMessage}</p>
        <p className="text-sm text-muted-foreground mb-4">グループ: {groupName}</p>
        <div className="w-full h-60 overflow-y-auto border rounded-md p-2 mb-8">
          {devices.length > 0 ? (
            <ul className="space-y-1">
              {devices.map((device, index) => (
                <li key={index} className="p-2 border-b last:border-b-0">
                  {device}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground text-center pt-4">端末接続待機中...</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center pt-4">
        <Button onClick={handleCompleteAndNavigate} disabled={isMatchingComplete}>
          {isMatchingComplete ? '完了済み' : 'マッチング完了'}
        </Button>
      </CardFooter>
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
