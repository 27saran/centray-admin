import { cookies } from 'next/headers';
import { getBaseApiUrl, createAuthHeaders } from '@/lib/api';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const headers = {
      ...createAuthHeaders(),
      'Cookie': cookieStore.toString(),
    };

    const response = await fetch(getBaseApiUrl('/api/admin/logout'), {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      console.error('External logout API failed:', response.status);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return Response.json({ success: true });
  }
}
