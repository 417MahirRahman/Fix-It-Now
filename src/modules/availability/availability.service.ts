import e from "express";
import { prisma } from "../../lib/prisma";
import { ICreateAvailability, IUpdateAvailability } from "./availability.interface";

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

export const availabilityService = {
  createAvailabilityIntoDB,
  updateAvailabilityInDB,
};