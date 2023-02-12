import { prisma } from "@/config";

async function findBooking(userId: number) {
  const booking = await prisma.booking.findFirst({
    where: { userId }
  });
  return booking;
}

async function findBookingWithRoom(bookingId: number) {
  return prisma.booking.findFirst({
    where: { 
      id: bookingId
    },
    include: {
      Room: true
    }

  });
}

async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({  
    data: {
      userId,
      roomId
    }
  });
}

async function updateBooking(userId: number, roomId: number, bookingId: number) {
  return prisma.booking.update({  
    where: {
      id: bookingId
    },
    data: {
      roomId: roomId
    }
  });
}
const bookingRepository = {
  findBooking,
  createBooking,
  updateBooking,
  findBookingWithRoom
};

export default bookingRepository;
