'use client';

import { useState, useEffect, Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter, useSearchParams } from 'next/navigation';
import { Separator } from '@/components/ui/separator';

type PlayClientProps = {
  DeviceSource: string[];
  phaseSequence: { phase: string }[];
};

function PlayContent({ DeviceSource, phaseSequence }: PlayClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupName = searchParams.get('group') ?? '不明なグループ';

  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [isSessionComplete, setIsSessionComplete] = useState(false);

  useEffect(() => {
    if (!phaseSequence || phaseSequence.length === 0) {
      setIsSessionComplete(true);
      return;
    }
    if (isSessionComplete) return;

    const intervalId = setInterval(() => {
      setCurrentPhaseIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % phaseSequence.length;
        if (prevIndex === phaseSequence.length - 1) {
          setIsSessionComplete(true);
        }
        return nextIndex;
      });
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [isSessionComplete, phaseSequence]);

  useEffect(() => {
    if (isSessionComplete) {
      const timer = setTimeout(() => {
        router.push('/session-management-ver1');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isSessionComplete, router]);

  const currentPhaseData = phaseSequence?.[currentPhaseIndex];

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="flex flex-col items-center pt-8">
        <p className="text-lg font-semibold mb-2 text-center">
          セッション参加中の
          <br />
          端末一覧
        </p>
        <p className="text-sm text-muted-foreground mb-4">グループ: {groupName}</p>
        <div className="w-full h-60 overflow-y-auto border rounded-md p-2 mb-6">
          <ul>
            {DeviceSource.map((device, index) => (
              <li key={index} className="flex items-center p-2 border-b last:border-b-0">
                <span>{device}</span>
                <span className="ml-auto text-sm text-green-600">正常</span>
              </li>
            ))}
          </ul>
        </div>
        <Separator className="my-4" />
        <div className="w-full text-center">
          <h4 className="text-md font-semibold mb-2">進行状況</h4>
          <p className="text-sm text-muted-foreground">{currentPhaseData?.phase ?? '読み込み中...'}</p>
          {isSessionComplete && <p className="text-sm font-bold text-blue-600 mt-2">セッション完了</p>}
        </div>
      </CardContent>
    </Card>
  );
}

export function PlayClient({ DeviceSource, phaseSequence }: PlayClientProps) {
  return (
    <Suspense fallback={<div>参加情報読み込み中...</div>}>
      <PlayContent DeviceSource={DeviceSource} phaseSequence={phaseSequence} />
    </Suspense>
  );
}
