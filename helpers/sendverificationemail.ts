import {resend } from '../lib/resend';
import React from 'react';

import { OtpEmail } from '@/emails/Verificatioemail';

import { ApiResponse } from '@/types/ApiResponse';


export async function sendVerificationEmail(email: string , username : string , otp : string)


: Promise<ApiResponse>{

     try {
         await resend.emails.send({
          from:'onboarding@resend.dev',
          to: email,
          subject: 'verification code',
          react: OtpEmail({
            userName : username,
            otp : otp
          }),


         });

      
         return {
            success : true ,
            message : "Verification email sent successfully"
        }
     } catch (emailError) {
        console.error("error sending verification email")
        return {
            success : false ,
            message : "Failed to send verification email"
        }
     }    
}