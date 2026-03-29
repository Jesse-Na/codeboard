"use client";
import { deleteRoom } from "@/lib/actions";
import { RoomDeletion } from "./room-delete";

import Link from "next/link";

import { Plus } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { Room, User } from "@/generated/prisma/client";
import { RoomCreation } from "../dashboard/room-creation";
import { authClient } from "@/lib/auth-client";

type RoomWithOwner = Room & { owner: User };

export function MyRooms() {
  const [rooms, setRooms] = useState<RoomWithOwner[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const { data: session } = authClient.useSession();

  const getRooms = async (userId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/rooms?userId=${userId}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch rooms");
      }
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  useEffect(() => {
    if (!session) return;

    getRooms(session.user.id);
  }, [session]);

  const handleDelete = async (id: number) => {
    await deleteRoom(id);
    setRooms(rooms.filter((room) => room.id !== id));
  };

  return (
    // Display rooms only with your id
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {/* Rooms */}
      {rooms.map((room) => (
        <RoomDeletion key={room.id} onDelete={() => handleDelete(room.id)}>
          <Card className="@container/card hover:bg-primary/5 transition-colors min-h-[160px]">
            <CardHeader>
              <CardTitle className="text-xl cursor-pointer font-semibold">
                {room.name}
              </CardTitle>
              <CardDescription>Created By: {room.owner.name}</CardDescription>
            </CardHeader>

            <CardContent className="flex-1">
              {room.desc && <p>{room.desc}</p>}
            </CardContent>

            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/rooms/${room.id}`}>Open</Link>
              </Button>
            </CardFooter>
          </Card>
        </RoomDeletion>
      ))}

      {/* Create Room Card */}
      <Card className="@container/card justify-center items-center hover:bg-primary/5 transition-colors min-h-[160px]">
        <Button
          variant="ghost"
          className="flex flex-col gap-2 h-full w-full cursor-pointer hover:bg-transparent"
          onClick={() => setModalOpen(true)}
        >
          <Plus className="w-15 h-15 text-muted-foreground" />
          <p>Create New Room</p>
        </Button>
      </Card>

      {/* Room Creation Modal */}
      <RoomCreation open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
