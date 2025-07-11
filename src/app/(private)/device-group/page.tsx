import { DeviceGroupClient } from '@/components/device-group/index-client';
import { loadDeviceGroups } from './fetch';

export default async function DeviceGroupPage() {
  const data = await loadDeviceGroups();

  return (
    <div className="py-8">
      <DeviceGroupClient deviceGroups={data} />
    </div>
  );
}
