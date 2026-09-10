import {email, z} from "zod"

export const signInValidation=z.object({
    email:z.string().email(),
    password:z.string().min(8,"password is required")
})

export type signInInput=z.infer<typeof signInValidation>;

export const createUserValidation=z.object({
    email:z.string().email(),
    password:z.string().min(1,"password is rquuired "),
    role:z.enum(["admin","manager","employee"]).default("employee")
})

export type createUserInput=z.infer<typeof createUserValidation>;