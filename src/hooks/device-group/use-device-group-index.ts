import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createDeviceGroup } from '@/app/(private)/device-group/fetch';
import { useCheckAuth } from '@/hooks/auth/use-auth-guard';
import type { GroupDetailResponse } from '@/types/device-group';
import { intToExcelCol, excelColToInt } from 'excel-column-name';

type UseDeviceGroupListProps = {
  deviceGroups: GroupDetailResponse[];
};

export function useDeviceGroupList({ deviceGroups }: UseDeviceGroupListProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { checkAuth } = useCheckAuth();

  // グループ追加
  // グループ名はグループA, グループB, グループC, ..., グループZZ というエクセルの列名と同じ形式で生成する。
  // エクセルの列名取得できるexcel-column-nameを使用する（16KBだからめっちゃ軽量ライブラリ）
  const handleAddGroup = async () => {
    // 既存のグループ名から「グループA」「グループB」などの文字列部分を抽出
    const existingLetters = (deviceGroups || [])
      .map(group => {
        const match = group.name.match(/^グループ([A-Z]+)$/);
        return match && match[1] ? match[1] : null;
      })
      .filter(letter => letter !== null);

    // 文字列を数値に変換（A=1, B=2, ..., Z=26, AA=27, AB=28, ...）
    const usedNumbers = existingLetters.map(letter => excelColToInt(letter));

    // 使用済みの最大番号を取得して次の番号を決定
    const maxNumber = usedNumbers.length > 0 ? Math.max(...usedNumbers) : 0;
    const nextNumber = maxNumber + 1;

    // 数値を文字列に変換
    const nextLetter = intToExcelCol(nextNumber);

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
