import bcrypt from "bcryptjs";
import { prisma } from "../../config/prisma.js";

export const createUser = async (data) => {
  const alreadyExist = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (alreadyExist) throw new Error("User already exists");

  const passwordHash = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      userType: data.userType,
    },
    select: {
      id: true,
      email: true,
      userType: true,
      createdAt: true,
    },
  });
  return user;
};

export const getUsers = async () => {
  return await prisma.user.findMany();
};
