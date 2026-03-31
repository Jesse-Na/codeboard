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
    language: string,
  ) => void;
}

export function RoomEditModal({ open, room, onClose, onEdit }: RoomEditProps) {
  const [message, setMessage] = useState<string | null>(null);

  const [name, setName] = useState(room.name);
  const [desc, setDesc] = useState(room.desc ?? "");
  const [language, setLanguage] = useState(room.language);

  const handleEdit = async () => {
    if (!name || name.trim() === "") {
      setMessage("Room name is required");
      return;
    }

    try {
      const finalDesc = desc.trim() === "" ? null : desc;
      onEdit(room.id, name, true, finalDesc, language);
      onClose();
      setMessage(null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error));
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleEdit();
          }}
        >
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Lecture 5"
                className="placeholder:text-muted-foreground"
              />
            </Field>
            <Field>
              <Label htmlFor="name-1">Description</Label>
              <Input
                id="desc"
                name="desc"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="e.g. Intro to Python"
                className="placeholder:text-muted-foreground"
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
