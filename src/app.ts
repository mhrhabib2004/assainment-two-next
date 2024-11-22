import express, { Request, Response } from "express"

const app = express()
app.get('/',(req:Request,res:Response)=>{
res.send({
    status:true,
    massage:"server is live"
})
})

export default app