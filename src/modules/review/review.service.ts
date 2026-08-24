import { prisma } from "../../lib/prisma";
import type { ICreateReview } from "./review.interface";

const createReviewIntoDB = async (
  customerId: string,
  payload: ICreateReview,
) => {
  const { bookingId, rating, review } = payload;

  if (!bookingId) {
    throw new Error("Booking ID is required");
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error("Rating must be an integer between 1 and 5");
  }

  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.customerId !== customerId) {
    throw new Error("You can only review your own bookings");
  }

  if (booking.status !== "Completed") {
    throw new Error("You can only review a completed booking");
  }

  const existingReview = await prisma.review.findUnique({
    where: {
      bookingId,
    },
  });

  if (existingReview) {
    throw new Error("This booking has already been reviewed");
  }

  try {
    const result = await prisma.review.create({
      data: {
        bookingId,
        customerId,
        technicianId: booking.technicianId,
        rating,
        review: review || null,
      },
    });

    return result;
  } catch (error: any) {
    if (error?.code === "P2002") {
      throw new Error("This booking has already been reviewed");
    }

    throw error;
  }
};

// GET reviews for a technician
const getTechnicianByIdFromDB = async (id: string) => {
  const technician = await prisma.technicianProfile.findUnique({
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

  if (!technician) {
    throw new Error("Technician not found");
  }

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

export const reviewService = {
  createReviewIntoDB,
  getTechnicianByIdFromDB,
};
