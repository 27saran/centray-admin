import NextAuth from 'next-auth';
import { authOptions } from '../authOptions';

console.log("✅ SSR ENV CHECK:", {
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

// NextAuthのハンドラーを作成
// https://next-auth.js.org/configuration/initialization
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
