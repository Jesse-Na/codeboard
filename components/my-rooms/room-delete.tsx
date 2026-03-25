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

type deleteRoomProp= {
    onDelete: () => void;
    children: React.ReactNode;
}

export function RoomDeletion({onDelete, children}: deleteRoomProp ) {
    return (
        <AlertDialog>
    <ContextMenu>
        <ContextMenuTrigger asChild>
            {children}
        </ContextMenuTrigger>

      <ContextMenuContent>
            <AlertDialogTrigger asChild>
                <ContextMenuItem onSelect={(e) => e.preventDefault()}>
                <TrashIcon className="mr-2 h-4 w-4" />
                    <span>Delete Room</span>
                </ContextMenuItem>
            </AlertDialogTrigger>
            
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
