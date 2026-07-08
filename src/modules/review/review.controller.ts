import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { reviewService } from "./review.service";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";

const createReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id as string;
    const payload = req.body;

    const result = await reviewService.createReviewIntoDB(customerId, payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Review submitted successfully",
      data: result,
    });
  },
);

export const reviewController = {
  createReview,
};
