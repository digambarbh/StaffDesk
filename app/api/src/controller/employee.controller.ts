import { db } from "../db/index.js"
import { employee } from "../db/schema/schema.js"

export const getAllEmployee = async (req: Request, res: Response) => {
    try {
        const employees = await db
            .select()
            .from(employee)

        return res.status(200).json({
            success:true,
            data:employees
        })
    }catch(err){
        console.error(err)
        return res.status(400).json({
            success:false,
            error:"something went wrong"
        })   
    }
}


export const enterEmployeeDetails=async(req:Request,res:Response)=>{
    
}