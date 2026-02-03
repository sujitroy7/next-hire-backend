import bcrypt from "bcryptjs";
import { prisma } from "../../config/prisma.js";

export const authenticateUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      userType: true,
      createdAt: true,
      passwordHash: true,
    },
  });

  if (!user) return null;

  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) return null;

  const { passwordHash, ...safeUser } = user;
  return safeUser;
};

export const getUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      userType: true,
      createdAt: true,
    },
  });
};
