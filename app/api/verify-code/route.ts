import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request){
    dbConnect();
    try {
        const {username , code } = await request.json()
        const decodeduser =  decodeURIComponent(username)
        const user = await UserModel.findOne({
            username : decodeduser,

        })

        if(!user){
             return Response.json({
                success: false ,
                message:"user not found"
            })
        }

        const iscodevalid = user.verifycode === code
        const notexpired = new Date(user.verifycode) >new Date()

        if (iscodevalid && notexpired){
            user.isverified = true
            await user.save()
            return Response.json({
                success: true ,
                message:"account has been verified"
            })



        }
        else {
            return Response.json({
                success: false ,
                message:"account has notbeen verified"
            })
        }
    } catch (error) {
        return Response.json({
                success: false ,
                message:"error verifying code"
            })
        
    }
}