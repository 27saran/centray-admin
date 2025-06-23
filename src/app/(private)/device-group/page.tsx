import { DeviceGroupClient } from '@/components/device-group/index-client';
import { loadDeviceGroups } from './fetch';

export default async function DeviceGroupPage() {
  const deviceGroups = await loadDeviceGroups();

  return (
    <div className="py-8">
      <DeviceGroupClient deviceGroups={deviceGroups} />
    </div>
  );
}
