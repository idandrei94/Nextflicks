// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { LoginModel } from '@/models/loginModel';
import { createUserMutation, fetchGraphQL, getUsersQuery, hasuraUserExists } from 'lib/db/hasura';
import { setTokenCookie } from 'lib/server/cookies';
import { createJwt, createTokenPayload } from 'lib/server/jwtUtils';
import { magicAdmin } from 'lib/server/magicServer';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse<LoginModel | { message: string; }>) =>
{
    if (req.method !== 'POST')
    {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ message: `Method ${req.method} not allowed.` });
    } else
    {
        const auth = req.headers.authorization;
        const token = auth ? auth.substring(7) : undefined;
        if (!token)
        {
            res.status(401).json({ message: "Invalid login." });
        } else
        {
            const meta = await magicAdmin.users.getMetadataByToken(token);
            const { payload, exp } = createTokenPayload(meta);
            const jwtToken = createJwt(payload, process.env.JWT_SECRET!);
            if (!await hasuraUserExists(meta.issuer!, jwtToken))
            {
                console.log("User doesnt exist, creating...");
                const { query, name } = createUserMutation;
                console.log(await fetchGraphQL(query, name, { email: meta.email!, issuer: meta.issuer }, jwtToken));
            } else
            {
                console.log('user already exists');
            }
            setTokenCookie(jwtToken, res);
            res.status(200).json({ name: meta.email!, validUntil: exp });
        }
    }
};