import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = new URL(request.url).searchParams;
  const userId = params.get("userId");
  console.log(userId)

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
