import { prisma } from "@/config";

async function findRoom(roomId: number) {
  const room = await prisma.room.findFirst({
    where: { 
      id: roomId
    }
  });
  return room;
}

async function updateRoom(roomId: number, capacity: number) {
  const room = await prisma.room.update({
    where: { 
      id: roomId
    }, data: {
      capacity
    }
  });
  return room;
}
const roomRepository = {
  findRoom,
  updateRoom
};

export default roomRepository;
