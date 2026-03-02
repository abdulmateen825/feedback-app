import { NextRequest , NextResponse } from "next/server";
import {getToken} from 'next-auth/jwt'
export async function middleware (request: NextRequest){


    const token =await getToken({req : request})
    const url = request.nextUrl
    if(token && (
        url.pathname.startsWith('/sign-in'),
        url.pathname.startsWith('/sign-up'),
        url.pathname.startsWith('/verify'),
        url.pathname.startsWith('/')
    )){
        return NextResponse.redirect(new URL ('/dashborad', request.url))
    }



    return NextResponse.redirect(new URL ('/home', request.url))
}

export const config = {
    matcher : [
        '/sign-up',
        '/sign-in',
        '/',
        'dashboard/:path*',
        '/verify/:path*'
    ],
}
export {default} from 'next-auth/middleware'