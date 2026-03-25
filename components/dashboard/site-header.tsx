"use client";

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { IconCirclePlusFilled } from "@tabler/icons-react";
import { useState } from "react";
import { usePathname } from 'next/navigation';

import { RoomCreation } from "./room-creation";

export function SiteHeader() {
  const [modalOpen, setModalOpen] = useState(false);
  const pathName = usePathname();

  const actualName = (pathName: string) => {
    return pathName
    .replace("/", "")
    .replace(/-/g, " ")
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{actualName(pathName)}</h1>

        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" className="hidden sm:flex" onClick={() => setModalOpen(true)}>
            <IconCirclePlusFilled className="mr-2" />
              Create New Room
          </Button>
        </div>

        {/* Room Creation Modal */}
        <RoomCreation open={modalOpen} onClose={() => setModalOpen(false)} />
      </div>
    </header>
  )
}
