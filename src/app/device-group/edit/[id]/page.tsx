import { notFound } from 'next/navigation';
import { EditDeviceGroupForm } from '@/components/device-group/edit-form';

type Device = {
  id: number;
  name: string;
};

type GroupDetails = {
  id: string;
  groupName: string;
  assignedDevices: Device[];
  availableDevices: Device[];
};

async function getGroupDetails(id: string): Promise<GroupDetails | null> {
  console.log(`Fetching details for group ID: ${id}`);
  // TODO ダミーデータ
  const dummyData: Record<string, GroupDetails> = {
    '1': {
      id: '1',
      groupName: 'グループ1',
      assignedDevices: [
        { id: 101, name: '端末A' },
        { id: 102, name: '端末B' },
      ],
      availableDevices: [
        { id: 201, name: '端末E' },
        { id: 202, name: '端末F' },
        { id: 203, name: '端末G' },
      ],
    },
    '2': {
      id: '2',
      groupName: 'グループ2',
      assignedDevices: [
        { id: 301, name: '端末H' },
      ],
      availableDevices: [
         { id: 101, name: '端末A' },
         { id: 201, name: '端末E' },
         { id: 401, name: '端末I' },
      ],
    },
  };
  return dummyData[id] || null;
}

export default async function EditDeviceGroupByIdPage({ params }: { params: { id: string } }) {
  const groupId = params.id;
  const groupDetails = await getGroupDetails(groupId);

  if (!groupDetails) {
    notFound();
  }

  // クライアントコンポーネントに初期データを渡してレンダリング
  return (
    <div className="container mx-auto py-8">
      <EditDeviceGroupForm initialData={groupDetails} />
    </div>
  );
}