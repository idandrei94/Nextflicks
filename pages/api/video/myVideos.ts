import { Video } from '@/models/video';
import { getVideosByKeyword } from 'lib/videosApi';
import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { hasuraGetUserVideos } from 'lib/db/hasura';
import { JwtPayloadModel } from '@/models/loginModel';

export default async (req: NextApiRequest, res: NextApiResponse<Video[] | { message: string; }>) =>
{
    if (req.method !== 'GET')
    {

        res.setHeader('Allowed', ['GET', 'PUT']);
        res.status(405).json({ message: `Method ${req.method} is not allowed.` });
    }
    else
    {
        try
        {
            const authCookie = req.cookies[process.env.JWT_COOKIE_NAME || 'JWT_AUTH_COOKIE'];
            let payload = undefined;
            if (!authCookie)
            {
                res.status(401).json({ message: "You are not logged in." });
            } else
            {
                try
                {
                    payload = jwt.verify(authCookie, process.env.JWT_SECRET!) as any as JwtPayloadModel;
                } catch (err)
                {
                    return res.status(401).json({ message: "Auth Token invalid." });
                }
                const myVideosIds = await hasuraGetUserVideos(payload!.issuer);
                var videos = getVideosByKeyword('').filter(v => myVideosIds.find(s => s.videoId === v.id.videoId));
                res.status(200).send(videos);
            }
        } catch (err: any)
        {
            console.log(err);
            res.status(500).json({
                message: process.env.ENVIRONMENT === 'DEVELOPMENT' && err ? err.message : "An unknown error occured."
            });
        }
    }
};
