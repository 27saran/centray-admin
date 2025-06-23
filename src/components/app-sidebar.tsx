import { Group, MonitorSpeaker, LogOut } from 'lucide-react';
import Link from 'next/link';
import { logout } from '@/app/(private)/auth/fetch';

import {
  Sidebar,
  SidebarContent,
  SidebarGroupContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

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
  return (
    <Sidebar side="right">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="mt-8">
              {items.map((item) =>
                item.title === 'ログアウト' ? (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <button
                        type="button"
                        onClick={async () => {
                          const result = await logout();
                          if (result.success) {
                            window.location.href = '/';
                          } else {
                            alert(result.error || 'ログアウトに失敗しました');
                          }
                        }}
                        className="flex items-center gap-2 w-full"
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
