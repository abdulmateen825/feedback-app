import UserModel from "@/model/User";
import { dbConnect } from "@/lib/dbConnect";
import { Message } from "@/model/User";
export async function POST(request: Request) 
{
    await dbConnect();
    const { username , content }= await  request.json()
    try {
        const user = await UserModel.findOne({
            username
        })
        if(!user){
             return Response.json({
                success: false,
                message: "No messages found for this user",
            })
        }
        if(!user.isacceptingmessage){
            return  Response.json({
                success: false,
                message: "User is not acccepting message",
            })

        }
        const newMessage = {content, createdAt: new Date()}

        user.message.push(newMessage as Message)
        await user.save()
         return Response.json({
                success: true,
                message: "Message sent successfully",
            })
    } catch (error) {
         return Response.json({
                success: false,
                message: "error",
            })

        
    }
}