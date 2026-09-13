import { hashPassword } from "better-auth/crypto";
import type { Request, Response } from "express";
import argon2 from "argon2";
import { eq } from "drizzle-orm";
import { signInValidation, createUserValidation } from "../validator/auth.validator.js"
import { user } from "../db/schema/schema.js";
import { db } from "../db/index.js";
import session from "express-session";
export const createUserController = async (req: Request, res: Response) => {
    const result = createUserValidation.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            success: false,
            error: result.error.issues
        })
    }
    const { email, password, role } = result.data;
    const passwordHash = await argon2.hash(password);
    try {
        const [newUser] = await db // .returning returns a array of rows [{},{}] . [newuser] holds only one object 
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



export const loginController = async (req: Request, res: Response) => {
    const result = signInValidation.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            success: false,
            error: "invalid credentials"
        })
    }

    const { email, password } = result.data;
    const [existingUser] = await db
        .select()
        .from(user)
        .where(eq(user.email, email))
        .limit(1)

    if (!existingUser) {
        return res.status(404).json({
            success: false,
            error: "user not registerd "
        })
    }

    const istrue: boolean = await argon2.verify(existingUser.passwordHash, password);
    if (!istrue) {
        return res.status(401).json({
            success: false,
            error: "invalid username or password"
        })
    }

    req.session.regenerate((error) => {
        if (error) {
            console.error("session regenration failed ")

            return res.status(500).json({
                success: false,
                error: "unabel to create a session "
            })
        }

        req.session.userId = existingUser.id
        req.session.role = existingUser.role

        req.session.save((error) => {
            if (error) {
                console.log("session save false ")

                return res.status(500).json({
                    success: false,
                    error: "unable to save session"
                })
            }

            return res.status(200).json({
                success: true,
                messsage: "login succesfull",
                user: {
                    id: existingUser.id,
                    email: existingUser.email,
                    role: existingUser.role
                }
            })


        })

    })
}



export const logoutController=async(req:Request,res:Response)=>{
    req.session.destroy((error)=>{
        if(error){
            res.status(500).json({
                success:false,
                error:"unable to logout"
            })
        }
        res.clearCookie("connect.sid");
        res.status(200).json({
            success:true,
            message:"successfully logged out "
        })
    })
}



export const getSession=async(req:Request,res:Response)=>{
    if(!req.session.userId){
        return res.status(401).json({
            success:false,
            message:"not Authenticated "
        })
    }

    res.status(200).json({
        success:true,
            session:{
                userId:req.session.userId,
                role:req.session.role
            }
    })
}

