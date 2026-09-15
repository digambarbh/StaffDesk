import type { NextFunction, Request, Response } from "express"

export const checkAuth=(req: Request, res: Response, next: NextFunction)=>{
    if(!req.session.userId){
        return res.status(401).json({
            success:false,
            error:"unauthorised request"
        })
    }
    next();

}
