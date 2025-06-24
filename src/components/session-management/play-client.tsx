'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { usePlay } from '@/hooks/session-management/use-play';

type PlayClientProps = {
  DeviceSource: string[];
  phaseSequence: { phase: string }[];
};

export function PlayClient({ DeviceSource, phaseSequence }: PlayClientProps) {
  const {
    groupName,
    currentPhaseData,
    isSessionComplete,
    handleSessionEnd,
    DeviceSource: devices,
  } = usePlay(DeviceSource, phaseSequence);

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center">
        <p className="text-lg font-semibold mb-2 text-center">
          セッション参加中の<br />端末一覧
        </p>
        <p className="text-sm text-muted-foreground mb-4">{groupName}</p>
        <div className="w-full h-60 overflow-y-auto border rounded-md p-2 mb-6">
          <ul>
            {devices.map((device, index) => (
              <li key={index} className="flex items-center p-2 border-b last:border-b-0">
                <span>{device}</span>
                <span className="ml-auto text-sm text-green-600">正常</span>
              </li>
            ))}
          </ul>
        </div>
        <Separator className="mt-2 mb-4" />
        <div className="text-center">
          <h4 className="text-md font-semibold">進行状況</h4>
          <p className="font-bold text-gray-600 my-2">{currentPhaseData?.phase ?? '読込み中...'}</p>
          {isSessionComplete && <p className="text-sm font-bold text-sky-600">セッション完了</p>}
        </div>
        {!isSessionComplete && (
          <Button
            className="mt-8 w-full bg-red-600 hover:bg-red-700"
            onClick={handleSessionEnd}
          >
            セッション全体の緊急停止
          </Button>
        )}
        {isSessionComplete && (
          <Button className="mt-8 w-full" onClick={handleSessionEnd}>
            セッション終了
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
