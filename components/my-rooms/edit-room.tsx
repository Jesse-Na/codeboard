"use client"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { TrashIcon } from "lucide-react"
import { RefreshCcw } from "lucide-react"
import { useState } from "react"

import { RoomEditModal } from "./edit-modal";
import { Room, User } from "@/generated/prisma/client";

type optionsRoomProp= {
    room: RoomWithOwner;
    onDelete: () => void;
    onEdit?: () => void;
    children: React.ReactNode;
}

type RoomWithOwner = Room & { owner: User };

export function RoomEdit({onDelete, room, children}: optionsRoomProp ) {
   const [editOpen, setEditOpen] = useState(false);

    return (
    <AlertDialog>
    <ContextMenu>
        <ContextMenuTrigger asChild>
            {children}
        </ContextMenuTrigger>

      <ContextMenuContent>

        {/* Edit Room */}
        <ContextMenuItem onSelect={(e) => e.preventDefault()} onClick={
            () => setEditOpen(true)}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            <span>Edit Room</span>
        </ContextMenuItem>

        <RoomEditModal open={editOpen} onClose={() => setEditOpen(false)} room={room} />

        {/* Delete Room */}
        <AlertDialogTrigger asChild>
            <ContextMenuItem onSelect={(e) => e.preventDefault()}>
                <TrashIcon className="mr-2 h-4 w-4" />
                    <span>Delete Room</span>
            </ContextMenuItem>
        </AlertDialogTrigger>
        
        {/* Delete Room Dialog */}
        <AlertDialogContent size="sm">
            <AlertDialogHeader>
                <AlertDialogTitle>Delete room?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete the room.
                    </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
                <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete} variant="destructive">Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>

      </ContextMenuContent>

    </ContextMenu>
    </AlertDialog>

    )
}
