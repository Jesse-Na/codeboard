import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
	const rooms = await prisma.room.findMany({
		include: {
			records: {
				orderBy: {
					lastUpdated: "desc",
				},
			},
		},
		orderBy: {
			id: "asc",
		},
	});

	console.log("Rooms fetched from database:", rooms);
	return NextResponse.json(rooms);
}
