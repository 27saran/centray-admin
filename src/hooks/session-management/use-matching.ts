import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function useMatching(initialGroupName: string, DeviceSource: string[]) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupNameQuery = searchParams.get('group');
  const groupName = groupNameQuery ?? initialGroupName;
  const [devices, setDevices] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState('マッチング待機中...');

  // TODO: hooks移動予定
  // あくまでmock用に1秒ごとにマッチング進行させてるだけのロジックのためここは本実装で完全に消滅すると思う
  useEffect(() => {
    if (!Array.isArray(DeviceSource) || DeviceSource.length === 0) {
      setStatusMessage('端末リストの読み込みエラー');
      return;
    }
    setStatusMessage('マッチング中...');
    const deviceIntervalId = setInterval(() => {
      setDevices((prevDevices) => {
        const nextDeviceIndex = prevDevices.length % DeviceSource.length;
        const nextDevice = DeviceSource[nextDeviceIndex];
        if (typeof nextDevice === 'string') {
          return [...prevDevices, nextDevice];
        } else {
          return prevDevices;
        }
      });
    }, 1000);
    return () => {
      clearInterval(deviceIntervalId);
    };
  }, [DeviceSource]);

  const handleCompleteAndNavigate = () => {
    if (window.confirm('セッションを開始します。\nよろしいですか？')) {
      const params = new URLSearchParams();
      params.set('group', groupName);
      params.set('total', String(devices.length));
      router.push(`/session-management/play?${params.toString()}`);
    }
  };

  return {
    groupName,
    devices,
    statusMessage,
    handleCompleteAndNavigate,
  };
}
