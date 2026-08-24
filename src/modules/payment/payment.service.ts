import Stripe from "stripe";
import type { ICreatePayment } from "./payment.interface";
import { prisma } from "../../lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const createPaymentSessionIntoDB = async (
  userId: string,
  payload: ICreatePayment,
) => {
  const { bookingId } = payload;

  const booking = await prisma.booking.findUniqueOrThrow({
    where: {
      id: bookingId,
    },
    include: {
      service: true,
    },
  });

  if (booking.customerId !== userId) {
    throw new Error("You can only pay for your own booking");
  }

  if (booking.status !== "Accepted") {
    throw new Error("Booking must be accepted before payment");
  }

  const existingPayment = await prisma.payment.findUnique({
    where: {
      bookingId,
    },
  });

  if (existingPayment?.status === "Paid") {
    throw new Error("This booking has already been paid");
  }

  const amount = Number(booking.service.price);

  let payment = existingPayment;

  if (!payment) {
    payment = await prisma.payment.create({
      data: {
        bookingId,
        userId,
        amount,
        provider: "Stripe",
        status: "Pending",
      },
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: booking.service.service_name,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],

      success_url: `${process.env.FRONTEND_URL}/customer-dashboard/payment-success?sessionId={CHECKOUT_SESSION_ID}`,

      cancel_url: `${process.env.FRONTEND_URL}/customer-dashboard/payment-cancelled`,

      metadata: {
        paymentId: payment.id,
        bookingId,
        userId,
      },
    });

    return {
      checkoutUrl: session.url,
      paymentId: payment.id,
      sessionId: session.id,
    };
  } catch (error) {
    if (!existingPayment) {
      await prisma.payment.delete({
        where: {
          id: payment.id,
        },
      });
    }

    throw error;
  }
};

const confirmPaymentInDB = async (sessionId: string) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    throw new Error("Payment not completed");
  }

  const paymentId = session.metadata?.paymentId;
  const bookingId = session.metadata?.bookingId;
  const userId = session.metadata?.userId;

  if (!paymentId || !bookingId || !userId) {
    throw new Error("Payment metadata is missing");
  }

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;

  if (!paymentIntentId) {
    throw new Error("Payment intent is missing");
  }

  const booking = await prisma.booking.findUniqueOrThrow({
    where: {
      id: bookingId,
    },
    include: {
      service: true,
    },
  });

  if (booking.customerId !== userId) {
    throw new Error("Payment does not belong to this customer");
  }

  const amount = Number(booking.service.price);

  const payment = await prisma.$transaction(async (tx) => {
    const existingPayment = await tx.payment.findUnique({
      where: {
        id: paymentId,
      },
    });

    if (!existingPayment) {
      throw new Error("Payment record not found");
    }

    if (existingPayment.bookingId !== bookingId) {
      throw new Error("Payment does not belong to this booking");
    }

    if (existingPayment.status === "Paid") {
      return existingPayment;
    }

    const updatedPayment = await tx.payment.update({
      where: {
        id: paymentId,
      },
      data: {
        status: "Paid",
        amount,
        transactionId: paymentIntentId,
        paidAt: new Date(),
      },
    });

    await tx.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        status: "InProgress",
      },
    });

    return updatedPayment;
  });

  return payment;
};

const getMyPaymentsFromDB = async (userId: string) => {
  return prisma.payment.findMany({
    where: {
      userId,
    },
    include: {
      booking: {
        include: {
          service: {
            select: {
              service_name: true,
            },
          },
          technician: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getPaymentByIdFromDB = async (id: string, userId: string) => {
  return prisma.payment.findFirstOrThrow({
    where: {
      id,
      userId,
    },
    include: {
      booking: {
        include: {
          service: {
            select: {
              service_name: true,
              price: true,
            },
          },
          technician: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
};

const getTechnicianPaymentsFromDB = async (technicianUserId: string) => {
  return prisma.payment.findMany({
    where: {
      booking: {
        technicianId: technicianUserId,
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      booking: {
        include: {
          service: {
            select: {
              service_name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const paymentService = {
  createPaymentSessionIntoDB,
  confirmPaymentInDB,
  getMyPaymentsFromDB,
  getPaymentByIdFromDB,
  getTechnicianPaymentsFromDB,
};
