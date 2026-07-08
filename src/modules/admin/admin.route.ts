import { Router } from "express";
import { adminController } from "./admin.controller";

const router = Router();

router.get("/users", adminController.getAllUsers);
router.patch("/users/:id", adminController.updateUserStatus);
router.get("/bookings", adminController.getAllBookings);
router.get("/categories", adminController.getAllCategories);
router.post("/categories", adminController.createCategory);

export const adminRoutes = router;
