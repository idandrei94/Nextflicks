import useRedirectUser from "lib/client/hooks/redirectUser";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export const middleware = (req: NextRequest, ev: NextFetchEvent) =>
{
    if (req.nextUrl.pathname.startsWith('/static'))
    {
        return NextResponse.next();
    }
    const { redirect, payload } = useRedirectUser(req.cookies[process.env.JWT_COOKIE_NAME || 'JWT_AUTH_COOKIE']);
    console.log(req.nextUrl.pathname);
    if (req.nextUrl.pathname === '/video/my-list') 
    {
        const url = req.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.rewrite(url);
    }
    if (req.nextUrl.pathname !== '/login' && (redirect || !payload)) 
    {
        const url = req.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.rewrite(url);
    }
};