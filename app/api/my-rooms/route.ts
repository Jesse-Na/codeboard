import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { useAuthContext } from "@/contexts/AuthContext";

export async function GET() {
  const myRooms = await prisma.room.findMany({
    // where: {
    //           ownerId: profile.id
    //       },
    //       include: {
    // 	records: {
    // 		orderBy: {
    // 			lastUpdated: "desc",
    // 		},
    // 	},
    // },
    orderBy: {
      id: "asc",
    },
  });

  console.log("Rooms fetched from database:", myRooms);
  return NextResponse.json(myRooms);
}
