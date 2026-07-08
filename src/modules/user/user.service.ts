import bcrypt from "bcryptjs";
import { IUser } from "./user.interface";
import { prisma } from "../../lib/prisma";
import config from "../../config";


const createUserIntoDB = async (payload: IUser) => {
  const { name, email, password, role, phone, address } = payload;
  const isUserExist = await prisma.users.findUnique({
    where: { email },
  });

  if (isUserExist) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const createdUser = await prisma.users.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      address,
    },
  });

  const user = await prisma.users.findUnique({
    where: {
      id: createdUser.id,
      email: createdUser.email || email,
    },
    omit: {
      password: true,
    },
  });

  return user;
};

const getMyProfileFromDB = async (userId: string) => {
  const user = await prisma.users.findUniqueOrThrow({
    where: { id: userId },
    omit: {
      password: true,
    },
  });

  return user;
};

export const userService = {
  createUserIntoDB,
  getMyProfileFromDB,
};
