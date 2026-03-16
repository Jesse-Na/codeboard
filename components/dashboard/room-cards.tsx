"use client";

import Link from "next/link";

import { Plus } from "lucide-react";

import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { createRoom } from "@/lib/actions";
import { useContext, useEffect, useState } from "react";
import { AuthContext, useAuthContext } from "@/contexts/AuthContext";
import { Room } from "@/generated/prisma/client";

export function RoomCards() {
	const { userId } = useAuthContext();
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

	const handleCreateRoom = async () => {
		if (!userId) return;

		try {
			const roomId = await createRoom(userId);
			setTimeout(() => {
				window.location.href = `/rooms/${roomId}`;
			}, 1000);
		} catch (error) {
			console.error("Error creating room:", error);
		}
	};

	return (
		<div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
			{/* Rooms */}
			{rooms.map((room) => (
				<Card key={room.id} className="@container/card">
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
			))}

			{/* Create Room Card */}
			<Card className="@container/card justify-center items-center cursor-pointer hover:bg-primary/5 transition-colors min-h-[160px]">
				<Button
					variant="ghost"
					className="flex flex-col gap-2 h-full w-full hover:bg-transparent"
					onClick={handleCreateRoom}
				>
					<Plus className="w-15 h-15 text-muted-foreground" />
					<p>Create New Room</p>
				</Button>
			</Card>
		</div>
	);
}
