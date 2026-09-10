import { Router } from "express";
import { createUserController } from "../controller/auth.controller.js";
const authRouter = Router();
authRouter.post("/create-user",createUserController)






export default authRouter;