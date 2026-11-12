const errorMiddleware=(error,req,res,next)=>{
   const status=error.status || 500
   const message=error.message || "Internal Server Error"
   const extraDetails=error.extraDetails || "error from backend"
   
   return res.status(status).json({message,extraDetails});
}

export default errorMiddleware