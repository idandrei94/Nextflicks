import cookie from 'cookie';
import { NextApiResponse } from 'next';

export const setTokenCookie = (token: string, res: NextApiResponse) =>
{
    const cookieValue = cookie.serialize(process.env.JWT_COOKIE_NAME || 'JWT_AUTH_COOKIE', token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: Number.parseInt(process.env.MAX_AGE || '604800'),
        expires: new Date(Date.now() + Number.parseInt(process.env.MAX_AGE || '604800') * 1000),
        secure: process.env.ENVIRONMENT === 'PRODUCTION',
        path: '/'
    });

    res.setHeader('Set-Cookie', cookieValue);
};