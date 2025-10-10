import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createDeviceGroup } from '@/app/(private)/device-group/fetch';
import { useCheckAuth } from '@/hooks/auth/use-auth-guard';
import type { GroupDetailResponse } from '@/types/device-group';

type UseDeviceGroupListProps = {
  deviceGroups: GroupDetailResponse[];
};

export function useDeviceGroupList({ deviceGroups }: UseDeviceGroupListProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { checkAuth } = useCheckAuth();

  // グループ追加
  const handleAddGroup = async () => {
    const existingLetters = (deviceGroups || [])
      .map(group => {
        const match = group.name.match(/^グループ([A-Z]+)$/);
        return match && match[1] ? match[1] : null;
      })
      .filter(letter => letter !== null);

    const usedNumbers = existingLetters.map(letter => {
      let num = 0;
      for (let i = 0; i < letter.length; i++) {
        num = num * 26 + (letter.charCodeAt(i) - 64);
      }
      return num;
    });
    const maxNumber = usedNumbers.length > 0 ? Math.max(...usedNumbers) : 0;
    const nextNumber = maxNumber + 1;
    const nextLetter = (() => {
      let result = '';
      let num = nextNumber;
      while (num > 0) {
        num--;
        result = String.fromCharCode(65 + (num % 26)) + result;
        num = Math.floor(num / 26);
      }
      return result;
    })();
    const groupName = `グループ${nextLetter}`;

    startTransition(async () => {
      try {
        const result = await createDeviceGroup(groupName);
        if (result.success && result.data) {
          alert(`「${groupName}」が正常に作成されました`);
          router.refresh();
        } else {
          await checkAuth();
          alert(`エラー: ${result.error}`);
        }
      } catch (error) {
        alert('グループ作成中にエラーが発生しました');
        console.error('Group creation error:', error);
      }
    });
  };

  // 編集ページへ遷移
  const handleEditClick = (id: number) => {
    router.push(`/device-group/edit/${id}`);
  };

  return {
    isPending,
    handleAddGroup,
    handleEditClick,
  };
}
