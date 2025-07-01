import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function usePlay(DeviceSource: string[], phaseSequence: { phase: string }[]) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupName = searchParams.get('group') ?? '不明なグループ';

  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [isSessionComplete, setIsSessionComplete] = useState(false);

  // TODO: hooks移動予定
  // あくまでmock用に1秒ごとにフェーズ進行させてるだけのロジックのためここは本実装で完全に消滅すると思う
  useEffect(() => {
    if (!phaseSequence || phaseSequence.length === 0) {
      setIsSessionComplete(true);
      return;
    }
    if (isSessionComplete) return;

    const intervalId = setInterval(() => {
      setCurrentPhaseIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % phaseSequence.length;
        if (prevIndex === phaseSequence.length - 1) {
          setIsSessionComplete(true);
        }
        return nextIndex;
      });
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [isSessionComplete, phaseSequence]);

  const currentPhaseData = phaseSequence?.[currentPhaseIndex];

  const handleSessionEnd = () => {
    router.push('/session-management');
  };

  return {
    groupName,
    currentPhaseData,
    isSessionComplete,
    handleSessionEnd,
    DeviceSource,
  };
}
