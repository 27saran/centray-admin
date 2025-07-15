// NextAuthのsignOut()はクライアントコンポーネント専用のため、サーバーサイド（API Route）から直接呼べない。
// そのため、
// 1. クライアントからAPI Route（/api/auth/logout）をfetchで呼び、
//    サーバー側のセッションやCookieを削除
// 2. fetchが成功したら、クライアント側でsignOut()を呼び、
//    NextAuthのクライアントセッションも削除
// という2段階構成にしてる

'use client';
import { signOut } from 'next-auth/react';
import { API_ENDPOINTS } from '@/constants/endpoints';

export async function logout(): Promise<{ success: boolean; error?: string }> {
  const response = await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    return { success: false, error: 'Logout failed' };
  }

  await signOut({ callbackUrl: '/' });
  return { success: true };
}