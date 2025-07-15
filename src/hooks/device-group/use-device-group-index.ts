import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createDeviceGroup } from '@/app/(private)/device-group/fetch';
import type { GroupDetailResponse } from '@/types/device-group';

type UseDeviceGroupListProps = {
  deviceGroups: GroupDetailResponse[];
};

export function useDeviceGroupList({ deviceGroups }: UseDeviceGroupListProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // グループ追加
  const addGroup = async () => {
    const existingNumbers = (deviceGroups || [])
      .map(group => {
        const match = group.name.match(/^グループ(\d+)$/);
        return match && match[1] ? parseInt(match[1], 10) : 0;
      })
      .filter(num => num > 0);
    const maxNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
    const nextNumber = maxNumber + 1;
    const groupName = `グループ${nextNumber}`;

    startTransition(async () => {
      try {
        const result = await createDeviceGroup(groupName);
        if (result.success && result.data) {
          alert(`「${groupName}」が正常に作成されました`);
          router.refresh();
        } else {
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
    addGroup,
    handleEditClick,
  };
}
