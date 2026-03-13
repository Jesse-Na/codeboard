import { prisma } from "./prisma";

export async function createRoom(ownerId: string): Promise<number> {
	const room = await prisma.room.create({
		data: {
			ownerId,
		},
	});

	return room.id;
}
