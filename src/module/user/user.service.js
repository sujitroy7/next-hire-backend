import { prisma } from "../../config/prisma.js";

export const createUser = async (data)=>{
  const alreadyExist = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (alreadyExist) throw new Error("User already exists");

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash: data.password,
      userType: data.userType,
    },
    select: {
      id: true,
      email: true,
      userType: true,
      created_at: true,
    },
  });
  return user;

}