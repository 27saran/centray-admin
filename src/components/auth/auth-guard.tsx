'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useCheckAuth } from '@/hooks/auth/use-auth-guard';

export default function AuthGuard() {
  const { status } = useSession();
  const pathname = usePathname();
  const { checkAuth } = useCheckAuth();

  useEffect(() => {
    if (status === 'loading') return;
    checkAuth();
  }, [status, pathname, checkAuth]);

  return null;
}
