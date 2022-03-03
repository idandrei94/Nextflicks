import { LoginModel } from '@/models/loginModel';
import { clearTokenCookie } from 'lib/server/cookies';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse<LoginModel | { message: string; }>) =>
{
    if (req.method !== 'POST')
    {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ message: `Method ${req.method} not allowed.` });
    } else
    {
        clearTokenCookie(res);
        res.redirect(302, '/login');
    };
};