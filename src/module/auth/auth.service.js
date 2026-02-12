import bcrypt from "bcryptjs";
import { prisma } from "../../config/prisma.js";
import { hashToken } from "../../utils/authTokens.js";

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

export const createRefreshToken = async (userId, data) => {
  const { refreshToken, device, ipAddress } = data;
  const hasedRefreshToken = await hashToken(refreshToken);

  return await prisma.refreshToken.create({
    data: {
      tokenHash: hasedRefreshToken,
      userId,
      device,
      ipAddress,
      expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
    },
  });
};

export const getRefreshToken = async (refreshToken) => {
  const hasedRefreshToken = await hashToken(refreshToken);

  return await prisma.refreshToken.findUnique({
    where: { tokenHash: hasedRefreshToken },
  });
};

export const revokeRefreshToken = async (refreshToken) => {
  const storedToken = await getRefreshToken(refreshToken);

  if (
    !storedToken ||
    storedToken.revokedAt ||
    storedToken.expiresAt < new Date()
  ) {
    return null;
  }

  return await prisma.refreshToken.update({
    where: { id: storedToken.id },
    data: {
      revokedAt: new Date(),
      lastUsedAt: new Date(),
    },
  });
};
