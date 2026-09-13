import { Router } from "express";
import { createUserController, loginController } from "../controller/auth.controller.js";
const authRouter = Router();
authRouter.post("/create-user",createUserController)

authRouter.post("/login",loginController)





export default authRouter;