import { prisma } from "../../lib/prisma";
import type {
  ITechnicianFilters,
  IUpdateBookingStatus,
  IUpdateTechnicianProfile,
} from "./technician.interface";

const getAllTechniciansFromDB = async (filters: ITechnicianFilters) => {
  const { type, location, rating } = filters;

  const technicians = await prisma.technicianProfile.findMany({
    where: {
      services: type
        ? {
            some: {
              category: {
                category_name: { equals: type, mode: "insensitive" },
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

  return technicians;
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
      availability: true,
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

// Update Technician Profile in the database
const updateTechnicianProfileInDB = async (
  userId: string,
  payload: IUpdateTechnicianProfile,
) => {
  
  const existTechnician = await prisma.technicianProfile.findUnique({
    where: { userId },
  });

  if (!existTechnician) {
    throw new Error(`No TechnicianProfile found for userId: ${userId}`);
  }

  const updatedProfile = await prisma.technicianProfile.update({
      where: { userId },
      data: payload,
    });
    return updatedProfile ;
};

// Get Technician Bookings from the database
const getTechnicianBookingsFromDB = async (technicianId: string) => {
  const result = await prisma.booking.findMany({
    where: { technicianId },
    orderBy: { createdAt: "desc" },
  });

  return result;
};

// Update Booking Status in the database
const updateBookingStatusInDB = async (
  bookingId: string,
  technicianId: string,
  payload: IUpdateBookingStatus,
) => {
  const booking = await prisma.booking.findFirstOrThrow({
    where: { id: bookingId, technicianId },
  });

  const result = await prisma.booking.update({
    where: { id: booking.id },
    data: { status: payload.status },
  });

  return result;
};

export const technicianProfile = {
  getAllTechniciansFromDB,
  getTechnicianByIdFromDB,
  updateBookingStatusInDB,
  updateTechnicianProfileInDB,
  getTechnicianBookingsFromDB,
};
