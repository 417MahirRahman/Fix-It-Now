import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import config from "./config";
import cors from "cors";
import { userRoute } from "./modules/user/user.route";
import { authRoute } from "./modules/aurh/auth.route";
import { serviceRoutes } from "./modules/service/service.route";
import { technicianRoutes } from "./modules/technician/technician.route";
import { adminRoutes } from "./modules/admin/admin.route";
import { availabilityRoutes } from "./modules/availability/availability.route";
import { bookingRoutes } from "./modules/booking/booking.route";
import { paymentRoutes } from "./modules/payment/payment.route";
import { reviewRoutes } from "./modules/review/review.route";

const app : Application = express();
app.use(cors({
    origin: config.app_url,
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req : Request, res : Response) => {
    res.send("Server is running!");
});

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/technician", technicianRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);

export default app;