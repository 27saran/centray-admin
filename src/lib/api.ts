import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/authOptions';
import type { AuthCheckResponse, ApiCallOptions } from '@/types/api';

// 環境変数のデバッグ用
export const debugApiConfig = () => {
  console.log('API Configuration Debug:');
  console.log('NEXT_PUBLIC_BACKEND_URL:', process.env.NEXT_PUBLIC_BACKEND_URL);
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set');
};

// エンドポイントのフルURL
export const getBaseApiUrl = (endpoint: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  
  if (!baseUrl) {
    console.error('NEXT_PUBLIC_BACKEND_URL is not set');
    throw new Error('Backend URL is not configured');
  }
  
  const fullUrl = `${baseUrl}${endpoint}`;
  console.log('Generated API URL:', fullUrl);
  return fullUrl;
};

// 認証付きAPI呼び出し用ヘッダーの生成
export const createAuthHeaders = (accessToken?: string): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  return headers;
};

// 認証チェック
async function checkAuthentication(accessToken: string): Promise<{ isValid: boolean; user?: AuthCheckResponse }> {
  try {
    const response = await fetch(getBaseApiUrl('/api/admin/loggedin'), {
      method: 'GET',
      headers: createAuthHeaders(accessToken),
    });

    if (!response.ok) {
      console.error('Authentication check failed:', response.status);
      return { isValid: false };
    }

    const data: AuthCheckResponse = await response.json();
    if (!data.is_login) {
      console.error('User is not logged in');
      return { isValid: false };
    }

    return { isValid: true, user: data };
  } catch (error) {
    console.error('Authentication check error:', error);
    return { isValid: false };
  }
}

// 認証付きAPI呼び出し
export async function callAuthenticatedApi<T>(options: ApiCallOptions): Promise<T | null> {
  const session = await getServerSession(authOptions);
  if (!session || !session.accessToken) return null;

  const authCheck = await checkAuthentication(session.accessToken);
  if (!authCheck.isValid) return null;

  const fetchOptions: RequestInit = {
    method: options.method,
    headers: createAuthHeaders(session.accessToken),
  };
  if (options.body) fetchOptions.body = JSON.stringify(options.body);
  if (options.tags) (fetchOptions as RequestInit & { next?: { tags: string[] } }).next = { tags: options.tags };

  const response = await fetch(getBaseApiUrl(options.url), fetchOptions);
  if (!response.ok) return null;
  return await response.json();
}
