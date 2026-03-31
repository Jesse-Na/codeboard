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

import { updateRoom } from "@/lib/actions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LanguageSelector } from "../languages";
import { authClient } from "@/lib/auth-client";
import { Room, User } from "@/generated/prisma/client";

type RoomWithOwner = Room & { owner: User };

interface RoomEditProps {
  open: boolean;
  room: RoomWithOwner;
  onClose: () => void;
  onEdit: (
    id: number,
    name: string,
    isActive: boolean,
    desc: string | null,
  ) => void;
}

export function RoomEditModal({ open, room, onClose, onEdit }: RoomEditProps) {
  const [message, setMessage] = useState<string | null>(null);

  const [language, setLanguage] = useState("js");

  const handleEdit = async (formData: FormData) => {
    const name = formData.get("name") as string;
    const desc = formData.get("desc") as string | null;

    if (!name || name.trim() === "") {
      setMessage("Room name is required");
      return;
    }

    try {
      onEdit(room.id, name, true, desc);
      onClose();
      setMessage(null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error));
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <form action={handleEdit}>
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
            <DialogDescription>
              Update the details for your room below.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="gap-4 py-4">
            <Field>
              <Label htmlFor="name">Room Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. Lecture 5"
                className="text-muted-foreground"
              />
            </Field>
            <Field>
              <Label htmlFor="name-1">Description</Label>
              <Input
                id="desc"
                name="desc"
                placeholder="e.g. Intro to Python"
                className="text-muted-foreground"
              />
            </Field>

            {/* Language Dropdown */}
            <Field>
              <Label htmlFor="language">Language</Label>
              <LanguageSelector value={language} onValueChange={setLanguage} />
            </Field>

            {message && <p className="text-sm text-red-800">{message}</p>}
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="cursor-pointer">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="cursor-pointer">
              Edit Room
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
