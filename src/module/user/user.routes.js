import { Router } from "express";
import {createUserHandler} from './user.controller.js'
import { validateRequest } from "../../middleware/validateRequest.js";
import { createUserSchema } from "./user.schema.js";

const router = Router();

router.post('/', validateRequest(createUserSchema), createUserHandler)

export  default router