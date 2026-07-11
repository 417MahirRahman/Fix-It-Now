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
    where: { id: bookingId },
    include: { service: true },
  });

  if (booking.customerId !== userId) {
    throw new Error("You can only pay for your own booking");
  }

  if (booking.status !== "Accepted") {
    throw new Error("Booking must be accepted before payment");
  }

  const existingPayment = await prisma.payment.findUnique({
    where: { bookingId },
  });

  if (existingPayment) {
    throw new Error(
      existingPayment.status === "Completed"
        ? "This booking has already been paid"
        : "A payment session already exists for this booking",
    );
  }

  const amount = Number(booking.service.price);

  const payment = await prisma.payment.create({
    data: {
      bookingId,
      userId,
      amount,
      provider: "Stripe",
      status: "Pending",
    },
  });

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
      success_url: `${process.env.APP_URL}/payment-success?paymentId=${payment.id}&sessionId={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL}/payment-cancelled`,
      metadata: {
        paymentId: payment.id,
        bookingId,
      },
    });

    return {
      checkoutUrl: session.url,
      paymentId: payment.id,
      sessionId: session.id,
    };
  } catch (error) {
    await prisma.payment.delete({ where: { id: payment.id } });
    throw error;
  }
};

const confirmPaymentInDB = async (sessionId: string) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  const paymentId = session.metadata?.paymentId as string;

  if (session.payment_status !== "paid") {
    throw new Error("Payment not completed");
  }

  const payment = await prisma.$transaction(async (tx) => {
    const updatedPayment = await tx.payment.update({
      where: { id: paymentId },
      data: {
        status: "Completed",
        transactionId: session.payment_intent as string,
        paidAt: new Date(),
      },
    });

    await tx.booking.update({
      where: { id: updatedPayment.bookingId },
      data: { status: "Paid" },
    });

    return updatedPayment;
  });

  return payment;
};

const getMyPaymentsFromDB = async (userId: string) => {
  const result = await prisma.payment.findMany({
    where: { userId },
    include: {
      booking: {
        include: { service: { select: { service_name: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return result;
};

const getPaymentByIdFromDB = async (id: string, userId: string) => {
  const result = await prisma.payment.findFirstOrThrow({
    where: { id, userId },
    include: {
      booking: {
        include: { service: { select: { service_name: true, price: true } } },
      },
    },
  });

  return result;
};

export const paymentService = {
  createPaymentSessionIntoDB,
  confirmPaymentInDB,
  getMyPaymentsFromDB,
  getPaymentByIdFromDB,
};
