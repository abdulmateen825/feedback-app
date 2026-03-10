import {NextAuthOptions} from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { dbConnect } from '@/lib/dbConnect';
import UserModel from '@/model/User';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'credentials',
            credentials: {
                username: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials: any ): Promise<any>{
                 await dbConnect();
                 try {
                   const user = await UserModel.findOne({
                        $or: [
                            {email: credentials.identifier},
                            {username: credentials.identifier}
                        ]

                    })
                    if(!user){
                        throw new Error ("no user find with this email")
                    }
                    if(!user.isverified){
                        throw new Error ("please verify your account")
                    }
                    const ispasswordcorrect = await bcrypt.compare(credentials.password, user.password)
                    if(ispasswordcorrect){
                        return user
                    }else {
                        throw new Error ("ncorrect password")
                    }
                 } catch (error: any) {
                    throw new Error(error.message)
                 }
            }

        })
    ],
    callbacks: {
    
    async jwt({ user, token }) {
      if (user) {
        token._id = user._id?.toString();
        token.isverified = user.isverified;
        token.isacceptingmessage = user.isacceptingmessage;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isverified = token.isverified;
        session.user.isacceptingmessage = token.isacceptingmessage;
        session.user.username = token.username;
      }
      return session;
    },
},
    pages: {
        signIn: '/sign-in',
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXT_AUTH_SECRET,
}