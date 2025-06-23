import NextAuth from 'next-auth';
import { authOptions } from '../authOptions';

// NextAuthのハンドラーを作成
// https://next-auth.js.org/configuration/initialization
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
