import { Router } from "express";
import { paymentController } from "./payment.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/create", auth(Role.Customer), paymentController.createPaymentSession); 
router.post("/confirm", paymentController.confirmPayment);
router.get("/", auth(Role.Customer), paymentController.getMyPayments);
router.get("/:id", auth(Role.Customer), paymentController.getPaymentById); 

export const paymentRoutes = router;
