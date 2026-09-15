import { Router } from "express";
import { getAllEmployee } from "../controller/employee.controller.js";
import { checkAuth } from "../middleware/checkAuth.js";
const employeeRouter=Router()


employeeRouter.get("/get-employee", checkAuth, getAllEmployee)

export default employeeRouter;