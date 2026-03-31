"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { useAuthContext } from "@/contexts/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Room } from "@/generated/prisma/client";

interface JoinRoomProps {
  open: boolean;
  onClose: () => void;
  rooms: Room[]
}

export function JoinRoom({ rooms, open, onClose }: JoinRoomProps) {
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const { profile } = useAuthContext();
  

  const handleJoin = (formData: FormData) => {
    if (!profile?.id) {
      return setMessage("You must be logged in");
    }
    const selectID = Number(formData.get("roomid") as string);
    const checkRoom = rooms.findIndex((room)=> {return room.id == selectID})
    if (checkRoom != -1){
        router.push(`/rooms/${selectID}`);
    }
    return setMessage("Room does not exist");
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <form action={handleJoin}>
            <DialogHeader>
                <DialogTitle>Join Room</DialogTitle>
                <DialogDescription>
                    Enter Room ID to join a room.
                </DialogDescription>
            </DialogHeader>
            <FieldGroup className="gap-4 py-4">
                <Field>
                <Label htmlFor="roomid">Enter Room ID:</Label>
                <Input
                    type="number"
                    id="roomid"
                    name="roomid"
                />
                </Field>
                {message && <p className="text-sm text-red-800">{message}</p>}
            </FieldGroup>
            <DialogFooter>
                <Button type="submit" className="cursor-pointer">Join Room</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
