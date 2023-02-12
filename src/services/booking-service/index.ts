import bookingRepository from "@/repositories/booking-repository";
import { forbidden, notFoundError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import roomRepository from "@/repositories/romm-repository";

async function bookingRules(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw notFoundError();
  }
}

async function getBooking(userId: number) {
  const booking = await bookingRepository.findBooking(userId);
  if (!booking) {
    throw notFoundError();
  }
  const reservation = await bookingRepository.findBookingWithRoom(booking.id);
  const userBooking = {
    id: reservation.id,
    Room: reservation.Room
  };
  return userBooking;
}

async function newBooking(userId: number, roomId: number) {
  const room = await roomRepository.findRoom(roomId);
  if(!room) {
    throw notFoundError();
  }
  
  if(room.capacity === 0) {
    throw forbidden(); 
  }
  await bookingRules(userId);
  const newCapacity = room.capacity - 1;
  const booking = await bookingRepository.createBooking(userId, roomId);
  await roomRepository.updateRoom(roomId, newCapacity);
  const bookingId = {
    bookingId: booking.id
  };
  return bookingId;
} 

async function updateBooking(userId: number, roomId: number, bookingId: number) {
  const booking = await bookingRepository.findBooking(userId);
  if (!booking) {
    throw notFoundError();
  }

  const currentRoom = await roomRepository.findRoom(booking.roomId);
  const newRoom = await roomRepository.findRoom(roomId);

  if (!newRoom) {
    throw notFoundError();
  }

  if(newRoom.capacity === 0) {
    throw forbidden(); 
  }

  const capacityCurrentRoom = currentRoom.capacity + 1;
  const capacityNewRoom = newRoom.capacity -1;
  
  const newBooking = await bookingRepository.updateBooking(userId, roomId, bookingId);
  
  await roomRepository.updateRoom(currentRoom.id, capacityCurrentRoom);
  await roomRepository.updateRoom(newRoom.id, capacityNewRoom);

  const updateBooking = {
    bookingId: newBooking.id
  };
  return updateBooking;
} 
const bookingService = {
  getBooking,
  newBooking,
  updateBooking
};

export default bookingService;
