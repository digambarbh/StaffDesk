import { hashPassword } from "better-auth/crypto";
import type { Request, Response } from "express";
import { signInValidation,createUserValidation } from "../validator/auth.validator.js"
import { user } from "../db/schema/schema.js";
import { db } from "../db/index.js";
export const createUserController = async (req: Request, res: Response) => {
    const result=createUserValidation.safeParse(req.body);
    if(!result.success){
        return res.status(400).json({
            success:false,
            error:result.error.issues
        })
    }
    const { email, password, role } = result.data;
    const passwordHash= await hashPassword(password);
    try {
        const [newUser] = await db
            .insert(user)
            .values({
                email,
                passwordHash,
                role
            })
            .returning({
                id: user.id,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            });

        return res.status(201).json({
            success: true,
            message: "user created succesfully ",
            user: newUser
        });
    } catch (error: unknown) {
        const databaseError = error as {
            code?: string;
            cause?: { code?: string };
        };

        if (databaseError.code === "23505" || databaseError.cause?.code === "23505") {
            return res.status(409).json({
                success: false,
                message: "A user with this email already exists"
            });
        }

        console.error("Failed to create user", error);
        return res.status(500).json({
            success: false,
            message: "Unable to create user"
        });
    }
}
