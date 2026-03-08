import Link from "next/link"

import { Plus } from "lucide-react"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "../ui/button"

type RoomCard = {
  id: number;
  name: string;
  creator: string;
  desc?: string;
}

// temp, fetch from api eventually and replace temp
const roomData: RoomCard[] = [
  {
    id: 1,
    name: "Room 1",
    creator: "Some Body",
    desc: "Optional description maybe"
  },
  {
    id: 2,
    name: "ECE1724 Lecture 10",
    creator: "Someone Else"
  }
]

export function RoomCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      
      {/* Rooms */}
      {roomData.map((room) => (
        <Card key={room.id} className="@container/card">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">{room.name}</CardTitle>
            <CardDescription>Created By: {room.creator}</CardDescription>
          </CardHeader>

          <CardContent className="flex-1">{room.desc && <p>{room.desc}</p>}</CardContent>
          
          <CardFooter>
            <Button asChild className="w-full">
              <Link href={`/rooms/${room.id}`}>Open</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}

      {/* Create Room Card */}
      <Card className="@container/card justify-center items-center cursor-pointer hover:bg-primary/5 transition-colors min-h-[160px]">
        <Button variant="ghost" className="flex flex-col gap-2 h-full w-full hover:bg-transparent">
          <Plus className="w-15 h-15 text-muted-foreground" />
          <p>Create New Room</p>
        </Button>
      </Card>

    </div>
  )
}
