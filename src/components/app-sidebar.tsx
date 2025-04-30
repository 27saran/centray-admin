import { Group, MonitorSpeaker, LogOut } from 'lucide-react';

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
    title: 'セッション管理-ver1',
    url: '/session-management-ver1',
    icon: MonitorSpeaker,
  },
  {
    title: 'セッション管理-ver2',
    url: '/session-management-ver2',
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
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
