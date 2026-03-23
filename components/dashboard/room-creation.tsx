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
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button";

import { createRoom } from "@/lib/actions";
import { useAuthContext } from "@/contexts/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LanguageSelector } from "../languages";

interface RoomCreationProps {
  open: boolean
  onClose: () => void
}

export function RoomCreation({open, onClose}: RoomCreationProps) {
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const { userId } = useAuthContext();
  const [language, setLanguage] = useState("js")

  const handleCreate = async (formData: FormData) => {
    const testUserId = "test-user-id"
    
    if (!userId) {
    return setMessage("You must be logged in");
    }

    const name = formData.get("name") as string
    const desc = formData.get("desc") as string
    const language = formData.get("language") as string

    try {
      const roomId = await createRoom({ownerId: testUserId, name, desc, language});

      onClose()
      router.push(`/rooms/${roomId}`)
     
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Error creating room");
    }
  };

  return (
  <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent className="sm:max-w-sm">
          <form action={handleCreate}>
          <DialogHeader>
            <DialogTitle>Create a Room</DialogTitle>
            <DialogDescription>
              Enter the details for your workspace below.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="gap-4 py-4">
            <Field>
              <Label htmlFor="name">Room Name</Label>
              <Input id="name" name="name" placeholder="e.g. Lecture 5" className="text-muted-foreground"/>
            </Field>
            <Field>
              <Label htmlFor="name-1">Description</Label>
              <Input id="desc" name="desc" placeholder="e.g. Intro to Python" className="text-muted-foreground"/>
            </Field>
    
          {/* Language Dropdown */}
            <Field>
              <Label htmlFor="language">Language</Label>
                <LanguageSelector value={language} onValueChange={setLanguage}/>
            </Field>

            {message && <p className="text-sm text-red-800">{message}</p>}
          </FieldGroup>


          {/* Private or Public Room - Future Implementation */}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Create Room</Button>
          </DialogFooter>
          

          </form>
        </DialogContent>
  </Dialog>
  );
}