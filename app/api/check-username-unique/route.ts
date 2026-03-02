import {z} from 'zod';
import UserModel from '@/model/User';
import { dbConnect } from '@/lib/dbConnect';
import { signupSchema } from '@/schemas/signupschema';

const Usernamequery = z.object({
    username: signupSchema
})

export async function GET(request: Request){


    if(request.method !== "GET"){
         return Response.json({
                success: false,
                message: "method not allowed",

            })

    }
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url)
        const queryParam = {
            username: searchParams.get("username") 
        }
        //validate with zode
        const result = Usernamequery.safeParse(queryParam)       
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: "invalid username",

            })
        }
        const {username} = result.data
        const existingverifieduser = await UserModel.findOne({
            username , isverified:true

        })
        if(existingverifieduser){
            return Response.json({
                 success: false,
                message: "username already exits",
            })
        }else {
            return Response.json({
                 success: true,
                message: "username is unique",

        })
    }} catch (error) {
        console.error("error checking username")
        return Response.json({
            success:false,
            message:"error  checking username"
        })
        
    }

}