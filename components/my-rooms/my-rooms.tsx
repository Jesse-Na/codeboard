"use client"
import { deleteRoom } from "@/lib/actions";
import { RoomDeletion } from "./room-delete"

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
import { createRoom } from "@/lib/actions";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { Room } from "@/generated/prisma/client";
import { RoomCreation } from "../dashboard/room-creation";
import { RoomCards } from "../dashboard/room-cards"

export function MyRooms() {
	const { userId } = useAuthContext();
	const [rooms, setRooms] = useState<Room[]>([]);
	const [modalOpen, setModalOpen] = useState(false);

	const handleDelete = (id: number) => {
		console.log("test");
	}

    return (

        // Display rooms only with your id
        <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
			{/* Rooms */}
			{rooms.map((room) => (
				<RoomDeletion key={room.id}
					onDelete={() => handleDelete(room.id)}>

				<Card className="@container/card">
					<CardHeader>
						<CardTitle className="text-xl font-semibold">
							{room.name}
						</CardTitle>
						<CardDescription>
							Created By: {room.ownerId}
						</CardDescription>
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
			<Card className="@container/card justify-center items-center cursor-pointer hover:bg-primary/5 transition-colors min-h-[160px]">
				<Button
					variant="ghost"
					className="flex flex-col gap-2 h-full w-full hover:bg-transparent"
					onClick={() => setModalOpen(true)}
				>
					<Plus className="w-15 h-15 text-muted-foreground" />
					<p>Create New Room</p>
				</Button>
			</Card>

			{/* Room Creation Modal */}
			<RoomCreation open={modalOpen} onClose={() => setModalOpen(false)} />
		</div>

    )
}