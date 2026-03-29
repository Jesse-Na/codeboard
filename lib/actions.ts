"use server";

import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from "./prisma";
import { s3Client } from "./spaces";

type createRoomProps = {
  ownerId: string;
  name: string;
  desc?: string;
  language: string;
};

export async function createRoom({
  ownerId,
  name,
  desc,
  language,
}: createRoomProps): Promise<number> {
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

export async function updateRoom(
  roomId: number,
  name: string,
  isActive: boolean | undefined,
  desc: string | undefined,
) {
  await prisma.room.update({
    where: {
      id: roomId,
    },
    data: {
      name,
      isActive,
      desc,
    },
  });
}

export async function deleteRoom(roomId: number) {
  await prisma.room.delete({
    where: {
      id: roomId,
    },
  });
}

export async function saveCode(roomId: number, code: File) {
  try {
    const room = await prisma.room.findUnique({
      where: {
        id: roomId,
      },
    });

    if (!room) {
      throw new Error("Room not found");
    }

    // Upload code file to Spaces
    const codeKey = `room-${roomId}/${Date.now()}-${code.name}`;
    const codeBuffer = Buffer.from(await code.arrayBuffer());
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.SPACES_BUCKET!,
        Key: codeKey,
        Body: codeBuffer,
        ContentType: code.type || "application/octet-stream",
      }),
    );

    await prisma.record.create({
      data: {
        roomId,
        codeFile: codeKey,
      },
    });
  } catch (error) {
    console.error("Error saving room data:", error);
    throw new Error("Failed to save room data");
  }
}

export async function saveBoard(roomId: number, board: File) {
  try {
    const room = await prisma.room.findUnique({
      where: {
        id: roomId,
      },
    });

    if (!room) {
      throw new Error("Room not found");
    }

    const boardKey = `room-${roomId}/${Date.now()}-board.png`;
    const boardBuffer = Buffer.from(await board.arrayBuffer());
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.SPACES_BUCKET!,
        Key: boardKey,
        Body: boardBuffer,
        ContentType: board.type || "application/octet-stream",
      }),
    );

    await prisma.record.create({
      data: {
        roomId,
        boardFile: boardKey,
      },
    });
  } catch (error) {
    console.error("Error saving board data:", error);
    throw new Error("Failed to save board data");
  }
}

export type S3Record = {
  code: Uint8Array<ArrayBufferLike> | null;
  board: Uint8Array<ArrayBufferLike> | null;
  room: {
    name: string;
  };
  id: number;
  codeFile: string | null;
  boardFile: string | null;
  lastUpdated: Date;
  roomId: number;
};

export async function getAllFiles(ownerId: string) {
  const records = await prisma.record.findMany({
    where: {
      room: { ownerId },
    },
    include: {
      room: { select: { name: true } },
    },
    orderBy: {
      lastUpdated: "desc",
    },
  });

  const codeFiles = await Promise.all(
    records.map(async (record) => {
      if (record.codeFile) {
        const code = await s3Client.send(
          new GetObjectCommand({
            Bucket: process.env.SPACES_BUCKET!,
            Key: record.codeFile,
          }),
        );

        const body = await code.Body?.transformToByteArray();

        return { code: body ?? null };
      }
      return { code: null };
    }),
  );

  const boardFiles = await Promise.all(
    records.map(async (record) => {
      if (record.boardFile) {
        const board = await s3Client.send(
          new GetObjectCommand({
            Bucket: process.env.SPACES_BUCKET!,
            Key: record.boardFile,
          }),
        );

        const body = await board.Body?.transformToByteArray();

        return { board: body ?? null };
      }
      return { board: null };
    }),
  );

  return records.map((record, index) => ({
    ...record,
    code: codeFiles[index].code,
    board: boardFiles[index].board,
  }));
}
