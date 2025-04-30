import { LoginClient } from '@/components/login/index-client';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <LoginClient />
    </div>
  );
}
