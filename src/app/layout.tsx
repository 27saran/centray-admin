// ページ全体のレイアウト（ルートレイアウト）

import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { LayoutContent } from '@/components/layout';
import NextAuthSessionProvider from '@/components/providers/session-provider';

// フォント設定
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="ja">
      <head>
        {/* ファビコン未設定エラー回避 */}
        <link rel="icon" href="data:," />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextAuthSessionProvider>
          <LayoutContent>
            <main>{children}</main>
          </LayoutContent>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
