import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import EditorSection from "@/components/rooms/EditorSection";
import { RoomHeader } from "@/components/rooms/RoomHeader";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type RoomParams = {
  params: {
    id: string;
  };
};

export default async function Room({ params }: RoomParams) {
  const { id } = await params;
  const roomId = parseInt(id, 10);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

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
        <RoomHeader room={roomId} />
        <div className="min-h-screen">
          <EditorSection />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
