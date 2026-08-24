import type { Request, Response } from "express";
import httpStatus from "http-status";
import { reviewService } from "./review.service";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.user?.id as string;
  const payload = req.body;

  const result = await reviewService.createReviewIntoDB(customerId, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Review submitted successfully",
    data: result,
  });
});

const getReviewsByTechnician = catchAsync(
  async (req: Request, res: Response) => {
    const { technicianId } = req.params;

    const result = await reviewService.getTechnicianByIdFromDB(
      technicianId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Reviews retrieved successfully",
      data: result,
    });
  },
);

export const reviewController = {
  createReview,
  getReviewsByTechnician,
};
