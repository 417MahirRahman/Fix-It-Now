import { prisma } from "../../lib/prisma";
import type {
  ITechnicianFilters,
  IUpdateBookingStatus,
  IUpdateTechnicianProfile,
  ICreateService,
  IUpdateService,
  ICreateAvailability,
  IUpdateAvailability,
} from "./technician.interface";

const getAllTechniciansFromDB = async (filters: ITechnicianFilters) => {
  const { type, location, rating } = filters;

  const serviceFilter: any = {};
  if (type) {
    serviceFilter.category = {
      category_name: { equals: type, mode: "insensitive" },
    };
  }
  if (rating) {
    serviceFilter.rating = { gte: rating };
  }

  const technicians = await prisma.technicianProfile.findMany({
    where: {
      services:
        Object.keys(serviceFilter).length > 0
          ? { some: serviceFilter }
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
        include: {
          category: true,
          bookings: {
            select: {
              review: {
                select: {
                  rating: true,
                  review: true,
                  createdAt: true,
                  customer: { select: { name: true } },
                },
              },
            },
          },
        },
      },
    },
  });

  return technicians;
};

const getTechnicianByIdFromDB = async (id: string) => {
  const technician = await prisma.technicianProfile.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address: true,

          reviewsReceived: {
            select: {
              id: true,
              rating: true,
              review: true,
              createdAt: true,

              customer: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      },

      services: {
        include: {
          category: true,
        },
      },

      availability: true,
    },
  });

  const reviews = technician.user.reviewsReceived;

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  return {
    ...technician,
    reviews,
    avgRating: Number(avgRating.toFixed(1)),
  };
};

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
  return updatedProfile;
};

const getTechnicianBookingsFromDB = async (technicianId: string) => {
  const result = await prisma.booking.findMany({
    where: { technicianId },
    include: {
      customer: { select: { name: true, email: true, phone: true } },
      service: { select: { service_name: true, price: true } },
      payment: true,
      review: true,
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
  const booking = await prisma.booking.findFirstOrThrow({
    where: { id: bookingId, technicianId },
  });

  const result = await prisma.booking.update({
    where: { id: booking.id },
    data: { status: payload.status },
  });

  return result;
};

const createServiceInDB = async (
  technicianUserId: string,
  payload: ICreateService,
) => {
  const technician = await prisma.technicianProfile.findUnique({
    where: { userId: technicianUserId },
  });

  if (!technician) {
    throw new Error("Technician profile not found");
  }

  const category = await prisma.category.findFirst({
    where: { category_name: payload.categoryName },
  });

  if (!category) {
    throw new Error(`Category "${payload.categoryName}" not found`);
  }

  const result = await prisma.service.create({
    data: {
      service_name: payload.service_name,
      price: payload.price,
      categoryId: category.id,
      technicianId:technician.id,
    },
  });

  return result;
};

const updateServiceInDB = async (
  serviceId: string,
  technicianUserId: string,
  payload: IUpdateService,
) => {
  const technician = await prisma.technicianProfile.findUnique({
    where: { userId: technicianUserId },
  });

  if (!technician) {
    throw new Error("Technician profile not found");
  }

  const existingService = await prisma.service.findFirst({
    where: { id: serviceId, technicianProfileId: technician.id },
  });

  if (!existingService) {
    throw new Error("Service not found");
  }

  const result = await prisma.service.update({
    where: { id: serviceId },
    data: payload,
  });

  return result;
};

const createAvailabilityInDB = async (
  technicianUserId: string,
  payload: ICreateAvailability,
) => {
  const technician = await prisma.technicianProfile.findUnique({
    where: { userId: technicianUserId },
  });

  if (!technician) {
    throw new Error("Technician profile not found");
  }

  const result = await prisma.availability.create({
    data: {
      dayOfWeek: payload.dayOfWeek as any,
      startTime: payload.startTime,
      endTime: payload.endTime,
      technicianId: technician.id,
    },
  });

  return result;
};

const updateAvailabilityInDB = async (
  availabilityId: string,
  technicianUserId: string,
  payload: IUpdateAvailability,
) => {
  const technician = await prisma.technicianProfile.findUnique({
    where: { userId: technicianUserId },
  });

  if (!technician) {
    throw new Error("Technician profile not found");
  }

  const existing = await prisma.availability.findFirst({
    where: { id: availabilityId, technicianProfileId: technician.id },
  });

  if (!existing) {
    throw new Error("Availability slot not found");
  }

  const result = await prisma.availability.update({
    where: { id: availabilityId },
    data: payload as any,
  });

  return result;
};

const deleteServiceFromDB = async (userId: string, serviceId: string) => {
  const technicianProfile = await prisma.technicianProfile.findUniqueOrThrow({
    where: { userId },
  });

  const existingService = await prisma.service.findFirst({
    where: { id: serviceId, technicianId: technicianProfile.id },
    include: { bookings: true },
  });

  if (!existingService) {
    throw new Error("Service not found or does not belong to you");
  }

  if (existingService.bookings.length > 0) {
    throw new Error(
      "This service has existing bookings and cannot be deleted",
    );
  }

  const result = await prisma.service.delete({
    where: { id: serviceId },
  });

  return result;
};

export const technicianProfile = {
  getAllTechniciansFromDB,
  getTechnicianByIdFromDB,
  updateBookingStatusInDB,
  updateTechnicianProfileInDB,
  getTechnicianBookingsFromDB,
  createServiceInDB,
  updateServiceInDB,
  createAvailabilityInDB,
  updateAvailabilityInDB,
  deleteServiceFromDB,
};
