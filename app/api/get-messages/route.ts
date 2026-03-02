import { getServerSession} from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from "next-auth";
import mongoose from "mongoose";
export async function GET(request: Request){
    await dbConnect();
     const session = await getServerSession(authOptions)
    const user:User = session?.user as User

    if(!session || !session.user){
         return Response.json({
                success: false,
                message: "not authenticated",

            })
    }

    const userid = new mongoose.Types.ObjectId(user._id)
    try {

        const user = await UserModel.aggregate([
            {
                $match: {id: userid}
            },
            {
                $unwind:'$messages'
            },
            {
                $sort:{'messages.createdAt':-1}
            },
            {
                $group:{_id:'$id',messages:{$push:'$messages'}}

            }
        ])
        if(!user || user.length==0){
            return Response.json({
                success: false,
                message: "No messages found for this user",
            })
        }
        return Response.json({
                success: true,
                messages: user[0].messages,

            })
        
    } catch (error) {
        
    }

}