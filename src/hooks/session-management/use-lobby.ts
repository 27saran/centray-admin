import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function useLobby(groupNames: string[]) {
  const router = useRouter();
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleMatchMaking = () => {
    if (!selectedGroup) {
      setError('グループを選択してください。');
      return;
    }
    setError(null);
    const params = new URLSearchParams();
    params.set('group', selectedGroup);
    router.push(`/session-management/matching?${params.toString()}`);
  };

  return {
    groupNames,
    selectedGroup,
    setSelectedGroup,
    handleMatchMaking,
    error,
  };
} 