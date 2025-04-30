'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type SessionManagementProps = {
  groupNames: string[];
};

export function SessionManagementClient({ groupNames }: SessionManagementProps) {
  const router = useRouter();
  const [selectedGroup, setSelectedGroup] = useState<string>('');

  const handleMatchMaking = () => {
    if (!selectedGroup) {
      alert('グループを選択してください。');
      return;
    }
    const params = new URLSearchParams();
    params.set('group', selectedGroup);
    router.push(`/session-management-ver2/matching?${params.toString()}`);
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
            <SelectTrigger className="w-1/2">
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
      </CardContent>
      <CardFooter className="flex justify-center pt-2">
        <Button onClick={handleMatchMaking} disabled={!selectedGroup}>
          マッチング開始
        </Button>
      </CardFooter>
    </Card>
  );
}
