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

  const amount = Number(booking.service.price);

  // Create a pending Payment record first
  const payment = await prisma.payment.create({
    data: {
      bookingId,
      userId,
      amount,
      provider: "Stripe",
      status: "Pending",
    },
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: booking.service.title,
          },
          unit_amount: Math.round(amount * 100), // Stripe expects cents
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.CLIENT_URL}/payment-success?paymentId=${payment.id}`,
    cancel_url: `${process.env.CLIENT_URL}/payment-cancelled`,
    metadata: {
      paymentId: payment.id,
      bookingId,
    },
  });

  return { checkoutUrl: session.url, paymentId: payment.id };
};

const confirmPaymentInDB = async (sessionId: string) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  const paymentId = session.metadata?.paymentId as string;

  if (session.payment_status !== "paid") {
    throw new Error("Payment not completed");
  }

  const payment = await prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: "Completed",
      transactionId: session.payment_intent as string,
      paidAt: new Date(),
    },
  });

  // Move booking forward to PAID
  await prisma.booking.update({
    where: { id: payment.bookingId },
    data: { status: "Paid" },
  });

  return payment;
};

const getMyPaymentsFromDB = async (userId: string) => {
  const result = await prisma.payment.findMany({
    where: { userId },
    include: {
      booking: {
        include: { service: { select: { title: true } } },
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
        include: { service: { select: { title: true, price: true } } },
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
