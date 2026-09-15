import type { Request, Response } from "express"
import { eq, sql } from "drizzle-orm"
import { db } from "../db/index.js"
import { department, employee } from "../db/schema/schema.js"

export const getAllEmployee = async (req: Request, res: Response) => {
    if (req.session.role === "admin") {
        try {
            const employees = await db
                .select()
                .from(employee)

            return res.status(200).json({
                success: true,
                data: employees
            })
        } catch (err) {
            console.error(err)
            return res.status(400).json({
                success: false,
                error: "something went wrong"
            })
        }
    }

    if (req.session.role === "manager") {
        try {
            const [managerEmployee] = await db
                .select({ id: employee.id })
                .from(employee)
                .where(sql`${employee.userId} = ${req.session.userId}`)
                .limit(1);

            if (!managerEmployee) {
                return res.status(403).json({
                    success: false,
                    error: "Manager employee record not found"
                });
            }

            const employees = await db
                .select({
                    id: employee.id,
                    firstName: employee.firstName,
                    lastName: employee.lastName,
                    phone: employee.phone,
                    departmentId: employee.departmentId,
                    designation: employee.designation,
                })
                .from(employee)
                .innerJoin(
                    department,
                    eq(employee.departmentId, department.id)
                )
                .where(
                    eq(department.managerId, managerEmployee.id)
                );

            return res.status(200).json({
                success: true,
                data: employees
            });

        } catch (err) {
            console.error(err);

            return res.status(500).json({
                success: false,
                error: "Something went wrong"
            });
        }
    }

    return res.status(403).json({
        success: false,
        error: "You do not have permission to view employees"
    });
}


// export const enterEmployeeDetails=async(req:Request,res:Response)=>{

// }