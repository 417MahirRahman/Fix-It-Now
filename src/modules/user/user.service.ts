import bcrypt from "bcryptjs";
import { IUser } from "./user.interface";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { Role } from "../../../generated/prisma/enums";

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

  if(role === Role.Technician){
    await prisma.technicianProfile.create({
      data: {
        userId: createdUser.id,
      },
    });
  }

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
    include: {
      technicianProfile: {
        select: {
          bio: true,
          experienceYears: true,
          services: true,
          availability: true,
        },
      },
    },
  });

  return user;
};

const updateMyProfileInDB = async (userId: string, payload: any) => {
  const { name, email } = payload;

  const updatedUser = await prisma.users.update({
    where: { id: userId },

    data: {
      name,
      email,
    },

    omit: {
      password: true,
    },
  });

  return updatedUser;
};

export const userService = {
  createUserIntoDB,
  getMyProfileFromDB,
  updateMyProfileInDB,
};
