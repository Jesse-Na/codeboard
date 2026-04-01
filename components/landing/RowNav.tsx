import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react";
import { JoinRoom } from "./JoinRoom";
import { Room } from "@/generated/prisma/client";

export function RowNav() {

    const [modalJoinOpen, setModalJoinOpen] = useState(false);
    const [rooms, setRooms] = useState<Room[]>([]);
    
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
        <div className="flex gap-4 justify-center">
            <Button size={'lg'}  key={"Dashboard"}>
                <Link href={"/dashboard"}>
                <span>Dashboard</span>
                </Link>
            </Button>
            <Button  className="cursor-pointer" size={'lg'} key={"JoinRoom"} onClick={() => setModalJoinOpen(true)}>
                <span>Join a Room</span>
            </Button>
            <JoinRoom open={modalJoinOpen} rooms={rooms} onClose={() => setModalJoinOpen(false)} />
        </div>
  )
}
