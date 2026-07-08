import { prisma } from "../../lib/prisma";
import type { ICreateReview } from "./review.interface";

const createReviewIntoDB = async (
  customerId: string,
  payload: ICreateReview,
) => {
  const { bookingId, rating, comment } = payload;

  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId },
  });

  if (booking.customerId !== customerId) {
    throw new Error("You can only review your own bookings");
  }

  if (booking.status !== "Completed") {
    throw new Error("You can only review a completed booking");
  }

  const existingReview = await prisma.review.findUnique({
    where: { bookingId },
  });

  if (existingReview) {
    throw new Error("This booking has already been reviewed");
  }

  const result = await prisma.review.create({
    data: {
      bookingId,
      customerId,
      technicianId: booking.technicianId,
      rating,
      comment,
    },
  });

  // Recalculate and update the service's average rating
  const serviceReviews = await prisma.review.findMany({
    where: {
      booking: { serviceId: booking.serviceId },
    },
  });

  const avgRating =
    serviceReviews.reduce((sum, r) => sum + r.rating, 0) /
    serviceReviews.length;

  await prisma.service.update({
    where: { id: booking.serviceId },
    data: { rating: avgRating },
  });

  return result;
};

export const reviewService = {
  createReviewIntoDB,
};
