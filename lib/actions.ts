"use server";

import { prisma } from "./prisma";

type createRoomProps = {
	ownerId: string,
	name: string,
	desc?: string,
	language: string,
}

export async function createRoom({ownerId, name, desc, language}: createRoomProps): Promise<number> {
	// check if user exists
	if (ownerId === "test-user-id") {
		console.warn(
			"Using test user ID. In production, ensure that the user is authenticated and the ID is valid.",
		);
		await prisma.user.upsert({
			where: { id: ownerId },
			update: {},
			create: {
				id: ownerId,
				name: "Test User",
				email: "test@example.com",
				password: "hashedpassword",
			},
		});
	}

	const user = await prisma.user.findUnique({
		where: {
			id: ownerId,
		},
	});

	if (!user) {
		throw new Error("User not found");
	}

	const room = await prisma.room.create({
		data: {
			ownerId,
			name,
			desc,
			language,
		},
	});

	return room.id;
}
