'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type SessionManagementProps = {
  groupNames: string[];
  matchCountOptions: number[];
};

export function SessionManagementClient({ groupNames, matchCountOptions }: SessionManagementProps) {
  const router = useRouter();
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedNumber, setSelectedNumber] = useState<string>('');

  // マッチング開始
  const handleMatchMaking = () => {
    const matchCount = parseInt(selectedNumber, 10);
    if (!selectedGroup || isNaN(matchCount) || matchCount <= 0) {
      alert('グループと人数を選択してください。');
      return;
    }
    console.log(`グループ名：${selectedGroup}, マッチ数： ${matchCount}`);

    const params = new URLSearchParams();
    params.set('group', selectedGroup);
    params.set('total', selectedNumber);
    router.push(`/session-management-ver1/matching?${params.toString()}`);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <h3 className="font-bold mb-4 text-center">
          利用する端末グループを
          <br />
          選択してください
        </h3>
        <div className="flex justify-center">
          <Select value={selectedGroup} onValueChange={setSelectedGroup}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="グループ名" />
            </SelectTrigger>
            <SelectContent>
              {groupNames.map((group) => (
                <SelectItem key={group} value={group}>
                  {group}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <h3 className="font-bold mt-8 mb-4 text-center">
          グループに参加する人数を
          <br />
          設定してください
        </h3>
        <div className="flex justify-center">
          <Select value={selectedNumber} onValueChange={setSelectedNumber}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="人数" />
            </SelectTrigger>
            <SelectContent>
              {matchCountOptions.map((count) => (
                <SelectItem key={count} value={String(count)}>
                  {`${count}人`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center gap-4 pt-4">
        <Button onClick={handleMatchMaking} disabled={!selectedGroup || !selectedNumber}>
          マッチング開始
        </Button>
      </CardFooter>
    </Card>
  );
}
