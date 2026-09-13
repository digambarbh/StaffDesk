
export const checkAuth=async(req,res,next)=>{
    if(!req.session.userId){
        return res.status(401).json({
            success:false,
            error:"unauthorised request"
        })
    }
    next();

}
