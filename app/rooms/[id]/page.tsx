import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SiteHeader } from "@/components/dashboard/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import EditorSection from "@/components/rooms/EditorSection";
import { RoomHeader } from "@/components/rooms/RoomHeader";

type RoomParams = {
	params: {
		id: string;
	};
};

export default async function Room({ params }: RoomParams) {
	const { id } = await params;
	const roomId = parseInt(id, 10);

	return (
    <SidebarProvider
      style={
        {
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <RoomHeader room={roomId}/>
        <div className="min-h-screen">
          <EditorSection/>
        </div>
      </SidebarInset>
    </SidebarProvider>

	);
}
