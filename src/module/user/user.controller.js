import {createUser} from './user.service.js'

export const createUserHandler = async(req, res)=>{
  const data = req.body;
  const user = await createUser(data);
  return res.status(201).json({ status: "success", data: user });
}