"use client";

import * as React from "react";
import {
  IconDashboard,
  IconDatabase,
  IconFileDescription,
  IconFolder,
  IconListDetails,
  IconReport,
  IconSearch,
  IconUsers,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/dashboard/nav-documents";
import { NavMain } from "@/components/dashboard/nav-main";
import { NavUser } from "@/components/dashboard/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import localFont from 'next/font/local'

const sevenSegment = localFont({src: '../../assets/fonts/SevenSegment.ttf'})
const zeyada = localFont({src: '../../assets/fonts/Zeyada-Regular.ttf',})

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = authClient.useSession();

  const data = {
    user: {
      name: session?.user.name ?? "Guest",
      email: session?.user.email ?? "",
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: IconDashboard,
      },

      {
        title: "My Rooms",
        url: "/my-rooms",
        icon: IconFolder,
      },
      {
        title: "My Files",
        url: "/files",
        icon: IconFileDescription,
      },
    ],
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/">
                <span className="text-3xl flex items-baseline font-bold">
                  <p className={sevenSegment.className}>CODE</p>
                  <p className={zeyada.className}>BOARD</p>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
