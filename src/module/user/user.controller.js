import { createRecruiterProfile } from "../recruiter-profile/recruiter-profile.service.js";
import { createUser, getUsers } from "./user.service.js";

export const createUserHandler = async (req, res) => {
  const data = req.body;
  try {
    const user = await createUser(data);
    return res.status(201).json({ status: "success", data: user });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};

export const createRecruiterUserHandler = async (req, res) => {
  const { firstName, lastName, email, password, userType } = req.body;
  try {
    const organizationId = "123123";
    const user = await createUser({ email, password, userType });

    await createRecruiterProfile({
      userId: user.id,
      organizationId,
      firstName,
      lastName,
    });

    return res.status(201).json({ status: "success", data: user });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};

export const getAllUsersHandler = async (req, res) => {
  try {
    const users = await getUsers();
    return res.status(200).json({ status: "success", data: users });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};
