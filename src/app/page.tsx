import LoginClient from '@/components/login/index-client';
import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center px-4 bg-gray-50 justify-center">
      <Suspense fallback={null}>
        <LoginClient />
      </Suspense>
    </div>
  );
}
