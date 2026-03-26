"use client";

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
import { Room } from "@/generated/prisma/client";
import { RoomCreation } from "./room-creation";

export function RoomCards() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    getRooms();
  }, []);

  const getRooms = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/rooms`,
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

  return (
    <div className="grid grid-cols-1 gap-4 px-4  *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {/* Rooms */}
      {rooms.map((room) => (
        <Card key={room.id} className="@container/card hover:bg-primary/5 transition-colors min-h-[160px]">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">{room.name}</CardTitle>
            <CardDescription>Created By: {room.ownerId}</CardDescription>
          </CardHeader>

          <CardContent className="flex-1">
            {room.desc && <p>{room.desc}</p>}
          </CardContent>

          <CardFooter>
            <Button asChild className="w-full cursor-pointer">
              <Link href={`/rooms/${room.id}`}>Open</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}

      {/* Create Room Card */}
      <Card className="@container/card justify-center items-center hover:bg-primary/5 transition-colors min-h-[160px] bg-gradient-to-t from-primary/5 to-card">
     
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
