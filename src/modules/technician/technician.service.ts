import { prisma } from "../../lib/prisma";
import type { ITechnicianFilters, IUpdateBookingStatus, IUpdateTechnicianProfile} from "./technician.interface";

const getAllTechniciansFromDB = async (filters: ITechnicianFilters) => {
  const { type, location, rating } = filters;

  const technicians = await prisma.technicianProfile.findMany({
    where: {
      services: type
        ? {
            some: {
              category: {
                name: { equals: type, mode: "insensitive" },
              },
            },
          }
        : undefined,
      user: location
        ? {
            address: { contains: location, mode: "insensitive" },
          }
        : undefined,
    },
    include: {
      user: {
        select: { name: true, email: true, phone: true, address: true },
      },
      services: {
        include: { category: true },
      },
    },
  });

  const technicianIds = technicians.map((t) => t.userId);

  const reviewAggregates = await prisma.review.groupBy({
    by: ["technicianId"],
    where: { technicianId: { in: technicianIds } },
    _avg: { rating: true },
  });

  const ratingMap = new Map(
    reviewAggregates.map((r) => [r.technicianId, r._avg.rating ?? 0]),
  );

  let result = technicians.map((t) => ({
    ...t,
    avgRating: ratingMap.get(t.userId) ?? 0,
  }));

  if (rating) {
    result = result.filter((t) => t.avgRating >= Number(rating));
  }

  return result;
};

const getTechnicianByIdFromDB = async (id: string) => {
  const technician = await prisma.technicianProfile.findUniqueOrThrow({
    where: { id },
    include: {
      user: {
        select: { name: true, email: true, phone: true, address: true },
      },
      services: {
        include: { category: true },
      },
    },
  });

  const reviews = await prisma.review.findMany({
    where: { technicianId: technician.userId },
    include: {
      customer: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return { ...technician, avgRating, reviews };
};

const updateTechnicianProfileInDB = async (
  userId: string,
  payload: IUpdateTechnicianProfile,
) => {
  const result = await prisma.technicianProfile.update({
    where: { userId },
    data: payload,
  });

  return result;
};

const getTechnicianBookingsFromDB = async (technicianId: string) => {
  const result = await prisma.booking.findMany({
    where: { technicianId },
    include: {
      customer: { select: { name: true, phone: true } },
      service: { select: { title: true, price: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return result;
};

const updateBookingStatusInDB = async (
  bookingId: string,
  technicianId: string,
  payload: IUpdateBookingStatus,
) => {
  // Ensures a technician can only update their own bookings
  const booking = await prisma.booking.findFirstOrThrow({
    where: { id: bookingId, technicianId },
  });

  const result = await prisma.booking.update({
    where: { id: booking.id },
    data: { status: payload.status },
  });

  return result;
};

export const technicianService = {
  getAllTechniciansFromDB,
  getTechnicianByIdFromDB,
  updateBookingStatusInDB,
  updateTechnicianProfileInDB,
  getTechnicianBookingsFromDB,
};
