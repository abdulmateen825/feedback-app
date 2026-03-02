import {dbConnect} from "@/lib/dbConnect";

import UserModel from "@/model/User";

import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendverificationemail";

export async function POST(req: Request){
    await dbConnect();
    try {

        const {username , email , password }=await  req.json()
        const existinguser = await UserModel.findOne({
            username ,
            isverified: true
        })
        if(existinguser){
            return Response.json({
                success: false ,
                message:"user already exists"
            })
        }
        const existinguserbyemail = await UserModel.findOne({email})
        const verifycode = Math.floor(100000 + Math.random() * 900000).toString()
        if(existinguserbyemail){
           if(existinguserbyemail.isverified){
            return Response.json({
                success : false,
                message : "email already registered"
            })
           }else {
            const hashedpassword = await bcrypt.hash(password, 10)
            existinguserbyemail.password=hashedpassword
            existinguserbyemail.verifycode = verifycode
            existinguserbyemail.verifycodeexpiry = new Date(Date.now() + 3600000)
            await existinguserbyemail.save()
           }
        }else {
            const hashedpassword = await bcrypt.hash(password, 10);
            const expirydate = new Date();
            expirydate.setHours(expirydate.getHours() + 1)

            const newuser = new UserModel({
                 username,
                    email,
                    password: hashedpassword,
                    verifycode : verifycode,
                    verifycodeexpiry: expirydate,
                    isverified : false, 
                    isacceptingmessage: true,
                    message: []
                
            })
        await newuser.save()
        }

        //send verify email

        const emailresponse =await sendVerificationEmail(email ,username , verifycode)
         if(!emailresponse.success){
            return Response.json({
                success: false,
                message : "username is already taken"
            })
         }
         return Response.json({
                success: true,
                message : "user registered . plz verify your email"
            })
    } catch (error) {
        console.error("error registering user ")
        return Response.json({
            success: false,
            message: "Error registering user"
        })
    }
}