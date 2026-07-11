import { prisma } from "../../lib/prisma";
import type { ICreateReview } from "./review.interface";

const createReviewIntoDB = async (
  customerId: string,
  payload: ICreateReview,
) => {
  const { bookingId, rating, review } = payload;

  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId },
  });

  console.log("Booking found:", booking.customerId, "Customer ID:", customerId);

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

  if(rating === 0 || rating > 5){
    throw new Error("Rating must be between 1 and 5");
  }

  let avgRating = 0;
  if(avgRating === 0){
    avgRating += rating;
  }else{
    avgRating = (avgRating + rating) / 2;
  }

  const result = await prisma.$transaction(async (tx) => {
    const newReview = await tx.review.create({
      data: {
        bookingId,
        customerId,
        technicianId: booking.technicianId,
        rating: avgRating,
        review,
      },
    });

    return newReview;
  });

  return result;
};

export const reviewService = {
  createReviewIntoDB,
};
