'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useLobby } from '@/hooks/session-management/use-lobby';
import type { GetAvailableGroupsResponse } from '@/types/session-management';

type SessionManagementProps = {
  groups: GetAvailableGroupsResponse[];
};

export function LobbyClient({ groups }: SessionManagementProps) {
  const {
    selectedGroup,
    setSelectedGroup,
    handleMatchMaking,
    loading,
    error,
  } = useLobby(groups);

  const hasGroups = groups.length > 0;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <h3 className="font-bold mb-4 text-center">
          {hasGroups ? (
            <>
              利用する端末グループを
              <br />
              選択してください
            </>
          ) : (
            '利用できる端末グループが存在しません'
          )}
        </h3>
        {hasGroups && (
          <div className="flex justify-center">
            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
              <SelectTrigger className="w-1/2">
                <SelectValue placeholder="グループ名" />
              </SelectTrigger>
              <SelectContent>
                {groups.map((group) => (
                  <SelectItem key={group.group_id} value={String(group.group_id)}>
                    {group.group_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {error && (
          <div className="text-red-600 text-sm text-center mt-2">{error}</div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center pt-2">
        <Button onClick={handleMatchMaking} disabled={!hasGroups || !selectedGroup || loading}>
          {loading ? '処理中...' : 'マッチング受付開始'}
        </Button>
      </CardFooter>
    </Card>
  );
}
