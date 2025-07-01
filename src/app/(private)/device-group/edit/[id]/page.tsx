import { notFound } from 'next/navigation';
import { EditDeviceGroupClient } from '@/components/device-group/edit-client';
import { loadGroupDetail, loadUnassignedDevices } from './fetch';

export default async function EditDeviceGroupByIdPage({ params }: { params: Promise<{ id: string }> }) {
  // URLパラメータのidはstringとして渡されるのでintにパース
  const { id } = await params;
  const groupId = parseInt(id, 10);
  if (isNaN(groupId) || groupId <= 0) {
    notFound();
  }

  const [groupDetail, unassignedDevices] = await Promise.all([
    loadGroupDetail(groupId),
    loadUnassignedDevices(groupId)
  ]);
  if (!groupDetail) {
    notFound();
  }

  return (
    <div className="py-8">
      <EditDeviceGroupClient
        groupDetail={groupDetail}
        unassignedDevices={unassignedDevices}
      />
    </div>
  );
}
