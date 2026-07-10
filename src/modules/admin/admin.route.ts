import { Router } from "express";
import { adminController } from "./admin.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
const router = Router();

router.get("/users", auth(Role.Admin), adminController.getAllUsers);
router.patch("/users/:id", auth(Role.Admin), adminController.updateUserStatus);
router.get("/bookings", auth(Role.Admin), adminController.getAllBookings);
router.get("/categories", auth(Role.Admin), adminController.getAllCategories);
router.post("/categories", auth(Role.Admin), adminController.createCategory);

export const adminRoutes = router;
