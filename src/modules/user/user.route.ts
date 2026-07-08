import { Router } from "express";
import { userController } from "./user.controller";
import { Role } from "../../../generated/prisma/client";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post("/", userController.createUser);
router.get(
  "/me",
  auth(Role.Customer, Role.Technician, Role.Admin),
  userController.getMyProfile,
);

export const userRoute = router;
