'use client';

import { Geist, Geist_Mono } from 'next/font/google';
import { usePathname } from 'next/navigation';
import './globals.css';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';

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
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {isHomePage ? (
          <main>{children}</main>
        ) : (
          <SidebarProvider>
            <AppSidebar />
            <main className="w-full">
              <SidebarTrigger />
              <div className="p-4">{children}</div>
            </main>
          </SidebarProvider>
        )}
      </body>
    </html>
  );
}
