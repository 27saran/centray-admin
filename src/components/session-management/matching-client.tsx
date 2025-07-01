'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMatching } from '@/hooks/session-management/use-matching';

type MatchingClientProps = {
  initialGroupName: string;
  DeviceSource: string[];
};

export function MatchingClient({ initialGroupName, DeviceSource }: MatchingClientProps) {
  const {
    groupName,
    devices,
    statusMessage,
    handleCompleteAndNavigate,
  } = useMatching(initialGroupName, DeviceSource);

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center pt-2">
        <p className="text-lg font-semibold mb-2">{statusMessage}</p>
        <p className="text-sm text-muted-foreground mb-2">{groupName}</p>
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
      <CardFooter className="flex justify-center">
        <Button onClick={handleCompleteAndNavigate}>
          セッション開始
        </Button>
      </CardFooter>
    </Card>
  );
}
