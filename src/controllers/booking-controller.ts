import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import httpStatus from "http-status";
import bookingService from "@/services/booking-service";

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const booking = await bookingService.getBooking(Number(userId));
    res.status(httpStatus.OK).send(booking);
  } 
  catch (error) {
    res.sendStatus(httpStatus.NOT_FOUND);
  }
  return;
}

export async function createBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;

  try {
    const booking = await bookingService.newBooking(Number(userId), roomId);
    res.status(httpStatus.OK).send(booking);
  } catch (error) {
    if (error.name === "NotFoundError") {
      res.sendStatus(httpStatus.NOT_FOUND);
    } else {
      res.sendStatus(httpStatus.FORBIDDEN);
    }
  }
  return;
}

export async function updateBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;
  const { bookingId } = req.params;

  if (!roomId) {
    res.sendStatus(httpStatus.NOT_FOUND);
    return;
  }

  try {
    const booking = await bookingService.updateBooking(Number(userId), roomId, Number(bookingId));
    res.status(httpStatus.OK).send(booking);
    return;
  } 
  catch (error) {
    if (error.name === "NotFoundError") {
      res.sendStatus(httpStatus.NOT_FOUND);
    }else{
      res.sendStatus(httpStatus.FORBIDDEN);
    }
  }
  return;
}

