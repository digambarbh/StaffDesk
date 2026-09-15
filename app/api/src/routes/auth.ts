import { Router } from "express";
import { createUserController, getSession, loginController, logoutController } from "../controller/auth.controller.js";
const authRouter = Router();
authRouter.post("/create-user",createUserController)

authRouter.post("/login",loginController)

authRouter.post("/session",getSession)


authRouter.post("/logout",logoutController)

export default authRouter;