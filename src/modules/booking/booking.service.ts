import { prisma } from "../../lib/prisma";
import type { ICreateBooking } from "./booking.interface";

const createBookingIntoDB = async (
  customerId: string,
  payload: ICreateBooking,
) => {
  const { serviceId, scheduledTime, notes } = payload;

  // Get the service to find which technician owns it
  const service = await prisma.service.findUniqueOrThrow({
    where: { id: serviceId },
    include: { technician: true },
  });

  const result = await prisma.booking.create({
    data: {
      customerId,
      technicianId: service.technician.userId,
      serviceId,
      scheduledTime,
      notes,
    },
    include: {
      service: { select: { service_name: true, price: true } },
      technician: { select: { name: true, phone: true } },
    },
  });

  return result;
};

const getMyBookingsFromDB = async (userId: string) => {
  // Covers both roles: a booking where the user is either the customer or the technician
  const result = await prisma.booking.findMany({
    where: {
      OR: [{ customerId: userId }, { technicianId: userId }],
    },
    include: {
      customer: { select: { name: true, phone: true } },
      technician: { select: { name: true, phone: true } },
      service: { select: { service_name: true, price: true } },
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return result;
};

const getBookingByIdFromDB = async (id: string, userId: string) => {
  const booking = await prisma.booking.findFirstOrThrow({
    where: {
      id,
      OR: [{ customerId: userId }, { technicianId: userId }],
    },
    include: {
      customer: { select: { name: true, phone: true, address: true } },
      technician: { select: { name: true, phone: true } },
      service: { select: { service_name: true, price: true } },
      payment: true,
      review: true,
    },
  });

  return booking;
};

export const bookingService = {
  createBookingIntoDB,
  getMyBookingsFromDB,
  getBookingByIdFromDB,
};
