import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const userId = params.get("userId");

  const rooms = await prisma.room.findMany({
    where: {
      ownerId: userId ?? undefined,
    },
    include: {
      owner: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  return NextResponse.json(rooms);
}
