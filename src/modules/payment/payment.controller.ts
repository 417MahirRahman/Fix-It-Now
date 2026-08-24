import type { Request, Response } from "express";
import httpStatus from "http-status";
import { paymentService } from "./payment.service";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";

const createPaymentSession = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;

  const result = await paymentService.createPaymentSessionIntoDB(
    userId,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Payment session created successfully",
    data: result,
  });
});

const confirmPayment = catchAsync(async (req: Request, res: Response) => {
  const { sessionId } = req.body;

  if (!sessionId) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: "Session ID is required",
      data: null,
    });
  }

  const result = await paymentService.confirmPaymentInDB(sessionId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment confirmed successfully",
    data: result,
  });
});

const getMyPayments = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;

  const result = await paymentService.getMyPaymentsFromDB(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment history retrieved successfully",
    data: result,
  });
});

const getPaymentById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id as string;

  const result = await paymentService.getPaymentByIdFromDB(
    id as string,
    userId,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment details retrieved successfully",
    data: result,
  });
});

const getTechnicianPayments = catchAsync(
  async (req: Request, res: Response) => {
    const technicianUserId = req.user?.id as string;

    const result =
      await paymentService.getTechnicianPaymentsFromDB(technicianUserId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Technician payments retrieved successfully",
      data: result,
    });
  },
);

export const paymentController = {
  createPaymentSession,
  confirmPayment,
  getMyPayments,
  getPaymentById,
  getTechnicianPayments,
};
