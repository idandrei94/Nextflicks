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

export const clearTokenCookie = (res: NextApiResponse) =>
{
    const cookieValue = cookie.serialize(process.env.JWT_COOKIE_NAME || 'JWT_AUTH_COOKIE', 'deleted', {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 0,
        expires: new Date(Date.now() - 10000),
        secure: process.env.ENVIRONMENT === 'PRODUCTION',
        path: '/'
    });

    res.setHeader('Set-Cookie', cookieValue);
};