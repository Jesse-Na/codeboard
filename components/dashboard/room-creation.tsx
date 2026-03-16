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

interface RoomCreationProps {
  open: boolean
  onClose: () => void
}

export function RoomCreation({open, onClose}: RoomCreationProps) {

  return (
  <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
    <form>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Create a Room</DialogTitle>
            <DialogDescription>
              Enter the details for your workspace below.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name">Room Name</Label>
              <Input id="name" name="name" placeholder="e.g. Lecture 5" className="text-muted-foreground"/>
            </Field>
            <Field>
              <Label htmlFor="name-1">Description</Label>
              <Input id="desc" name="desc" placeholder="e.g. Intro to Python" className="text-muted-foreground"/>
            </Field>
          </FieldGroup>
          {/* Language Dropdown */}

          {/* Private or Public Room - Comment this out for now */}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Create Room</Button>
          </DialogFooter>
        </DialogContent>
      </form>
  </Dialog>
  );
}