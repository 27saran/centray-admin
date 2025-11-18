'use client';

import { useEffect, useState } from 'react';
import { Group, MonitorSpeaker, LogOut } from 'lucide-react';
import Link from 'next/link';
import { logout } from '@/app/(private)/auth/fetch';
import { useSession } from 'next-auth/react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroupContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { PasswordDialog } from '@/components/device-group/password-dialog';

const items = [
  {
    title: '端末グループ管理',
    url: '/device-group',
    icon: Group,
  },
  {
    title: 'セッション管理',
    url: '/session-management',
    icon: MonitorSpeaker,
  },
  {
    title: 'ログアウト',
    url: '/',
    icon: LogOut,
  },
];

export function AppSidebar() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const { setOpen, setOpenMobile, isMobile } = useSidebar();
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    } else {
      setOpen(false);
    }
  };

  const handleDeviceGroupClick = () => {
    setPasswordDialogOpen(true);
  };

  const handleLogout = async () => {
    if (!window.confirm('本当にログアウトしますか？')) return;
    const result = await logout();
    if (result.success) {
      window.location.href = '/';
    } else {
      alert(result.error || 'ログアウトに失敗しました');
    }
  };

  return (
    <>
      <Sidebar side="right">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              {mounted && (
                <div className="px-2 pt-2 text-sm text-muted-foreground">
                  {session?.user?.email}
                </div>
              )}
              <SidebarMenu className="mt-4">
                {items.map((item) => {
                  if (item.title === 'ログアウト') {
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="flex items-center gap-2 w-full"
                          >
                            <item.icon />
                            <span>{item.title}</span>
                          </button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  } else if (item.title === '端末グループ管理') {
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <button
                            type="button"
                            onClick={handleDeviceGroupClick}
                            className="flex items-center gap-2 w-full"
                          >
                            <item.icon />
                            <span>{item.title}</span>
                          </button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  } else {
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <Link href={item.url} onClick={handleLinkClick}>
                            <item.icon />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  }
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <PasswordDialog
        open={passwordDialogOpen}
        onOpenChange={setPasswordDialogOpen}
      />
    </>
  );
}
