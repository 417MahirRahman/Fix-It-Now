import { prisma } from "../../lib/prisma";
import type {
  ICreateAvailability,
  ICreateService,
  IUpdateAvailability,
  IUpdateBookingStatus,
  IUpdateService,
  IUpdateTechnicianProfile,
} from "./technician.interface";

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

// Create Service in the database
const createServiceIntoDB = async (userId: string, payload: ICreateService) => {
  const technicianProfile = await prisma.technicianProfile.findUniqueOrThrow({
    where: { userId },
  });

  const result = await prisma.service.create({
    data: {
      technicianId: technicianProfile.id,
      service_name: payload.service_name,
      price: payload.price,
      categoryId: payload.categoryId,
    },
  });

  return result;
};

// Update Service in the database
const updateServiceInDB = async (
  userId: string,
  serviceId: string,
  payload: IUpdateService,
) => {
  const technicianProfile = await prisma.technicianProfile.findUniqueOrThrow({
    where: { userId },
  });

  const existingService = await prisma.service.findFirstOrThrow({
    where: { id: serviceId, technicianId: technicianProfile.id },
  });

  const result = await prisma.service.update({
    where: { id: existingService.id },
    data: payload,
  });

  return result;
};

// Create Availability in the database
const createAvailabilityIntoDB = async (
  userId: string,
  payload: ICreateAvailability,
) => {
  const technicianProfile = await prisma.technicianProfile.findUniqueOrThrow({
    where: { userId },
  });

  const result = await prisma.availability.create({
    data: {
      technicianId: technicianProfile.id,
      dayOfWeek: payload.dayOfWeek,
      startTime: payload.startTime,
      endTime: payload.endTime,
    },
  });

  return result;
};

// Update Availability in the database
const updateAvailabilityInDB = async (
  userId: string,
  availabilityId: string,
  payload: IUpdateAvailability,
) => {
  const technicianProfile = await prisma.technicianProfile.findUniqueOrThrow({
    where: { userId },
  });

  const existingSlot = await prisma.availability.findFirstOrThrow({
    where: { id: availabilityId, technicianId: technicianProfile.id },
  });

  const result = await prisma.availability.update({
    where: { id: existingSlot.id },
    data: payload,
  });

  return result;
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

export const technicianService = {
  updateBookingStatusInDB,
  updateTechnicianProfileInDB,
  getTechnicianBookingsFromDB,
  createServiceIntoDB,
  updateServiceInDB,
  createAvailabilityIntoDB,
  updateAvailabilityInDB,
};
