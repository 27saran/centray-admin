import { NextAuthOptions, User, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getBaseApiUrl, debugApiConfig } from '@/lib/api';
import { JWT } from 'next-auth/jwt';

// NextAuthのログイン認証設定
// https://next-auth.js.org/configuration/providers/credentials
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // デバッグ情報を出力
          debugApiConfig();
          
          const apiUrl = getBaseApiUrl('/api/admin/login');
          console.log('Attempting login to:', apiUrl);
          
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
            // タイムアウト設定を追加
            signal: AbortSignal.timeout(10000), // 10秒
          });
          
          console.log('Response status:', response.status);
          console.log('Response headers:', Object.fromEntries(response.headers.entries()));
          
          // レスポンスのテキストを取得してログ出力
          const responseText = await response.text();
          console.log('Response text:', responseText);
          
          // 空のレスポンスの場合はnullを返す
          if (!responseText || responseText.trim() === '') {
            console.error('Empty response from API');
            return null;
          }
          
          let data;
          try {
            data = JSON.parse(responseText);
          } catch (parseError) {
            console.error('JSON parse error:', parseError);
            console.error('Response text that failed to parse:', responseText);
            return null;
          }
          
          if (response.ok && data.token) {
            return {
              id: data.id.toString(),
              email: data.email,
              accessToken: data.token,
            };
          }
          
          console.log('Login failed - response not ok or no token:', data);
          return null;
        } catch (error) {
          console.error('Login error:', error);
          
          // エラーの詳細情報を記録
          if (error instanceof Error) {
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
          }
          
          // ネットワークエラーの場合は詳細を記録
          if (error instanceof TypeError && error.message.includes('fetch')) {
            console.error('Network error detected - possible CORS or connectivity issue');
          }
          
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  // トークン取得
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token as JWT).accessToken = (user as User).accessToken;
        (token as JWT).id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as User).id = (token as JWT).id as string;
        (session as Session).accessToken = (token as JWT).accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};