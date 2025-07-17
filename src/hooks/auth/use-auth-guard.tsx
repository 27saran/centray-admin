import { useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { getBaseApiUrl, createAuthHeaders } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/endpoints';

export function useCheckAuth() {
  const { data: session } = useSession();

  const checkAuth = useCallback(async (): Promise<void> => {
    if (!session?.accessToken) {
      window.location.href = '/?error=auth_expired';
      return;
    }

    try {
      const response = await fetch(getBaseApiUrl(API_ENDPOINTS.ADMIN.LOGGED_IN), {
        method: 'GET',
        headers: createAuthHeaders(session.accessToken),
      });

      if (response.status === 401 || response.status === 403) {
        window.location.href = '/?error=auth_expired';
        return;
      }

      if (response.ok) {
        const data = await response.json();
        if (!data.is_login) {
          window.location.href = '/?error=auth_expired';
        }
      }
    } catch (error) {
      console.error('認証チェックエラー:', error);
    }
  }, [session?.accessToken]);

  return { checkAuth };
}
