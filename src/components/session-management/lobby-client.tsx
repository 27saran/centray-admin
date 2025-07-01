'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useLobby } from '@/hooks/session-management/use-lobby';

type SessionManagementProps = {
  groupNames: string[];
};

export function LobbyClient({ groupNames }: SessionManagementProps) {
  const {
    selectedGroup,
    setSelectedGroup,
    handleMatchMaking,
    error,
  } = useLobby(groupNames);

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
        {error && (
          <div className="text-red-600 text-sm text-center mt-2">{error}</div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center pt-2">
        <Button onClick={handleMatchMaking} disabled={!selectedGroup}>
          マッチング開始
        </Button>
      </CardFooter>
    </Card>
  );
}
