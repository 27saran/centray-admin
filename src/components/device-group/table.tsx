'use client';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useRouter } from 'next/navigation';

type Device = {
  id: number;
  name: string;
};

type DeviceGroupTableProps = {
  id: number;
  groupName: string;
  devices: Device[];
};

export function DeviceGroupTable({ id, groupName, devices }: DeviceGroupTableProps) {
  const router = useRouter();

  const handleEditClick = () => {
    router.push(`/device-group/edit/${id}`);
  };

  return (
    <div className="rounded-md border mt-8">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{groupName}</TableHead>
            <TableHead className="text-right">
              <Button onClick={handleEditClick}>編集</Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {devices.length === 0 ? (
            <TableRow>
              <TableCell>登録端末はありません</TableCell>
            </TableRow>
          ) : (
            devices.map((device) => (
              <TableRow key={device.id}>
                <TableCell>
                  {device.name}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
