import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { JwtPayloadModel } from '@/models/loginModel';
import { hasuraGetLikeCount, hasuraGetStatsByVideoAndUserId, hasuraStatsChangeFavorite } from 'lib/db/hasura';
import { VideoStats } from '@/models/video';

type Data = {
    data?: VideoStats[] | VideoStats;
    message?: string;
};

interface ExtendedNextApiRequest extends NextApiRequest
{
    query: {
        id: string;
    },
    body: {
        action: 'like' | 'dislike' | 'clear';
    };
}

export default async (req: ExtendedNextApiRequest, res: NextApiResponse<Data>) =>
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
            if (req.method === 'GET')
            {
                const { id: videoId } = req.query;
                const data = await hasuraGetStatsByVideoAndUserId(payload!.issuer, videoId);
                const totalLikes = await hasuraGetLikeCount(videoId);
                res.status(200).json({ data: { ...data, likeTotal: totalLikes.sum.favorite, viewsTotal: totalLikes.count } });
            } else if (req.method === 'PUT')
            {
                const { action } = req.body;
                if (!action)
                {
                    res.status(400).json({ message: "Please provide either 'like', 'dislike' or 'clear', as value for 'action'." });
                } else
                {
                    const { id: videoId } = req.query;
                    const data = (await hasuraGetStatsByVideoAndUserId(payload!.issuer, videoId));
                    const updatedStats = await hasuraStatsChangeFavorite(data.id, action);
                    const totalLikes = await hasuraGetLikeCount(videoId);
                    res.status(200).json({ data: { ...updatedStats, viewsTotal: totalLikes.count, likeTotal: totalLikes.sum.favorite } });
                }
            }
            else
            {
                res.setHeader('Allowed', ['GET', 'PUT']);
                res.status(405).json({ message: `Method ${req.method} is not allowed.` });
            }
        }
    }
    catch (err: any)
    {
        console.log(err);
        res.status(500).json({
            message: process.env.ENVIRONMENT === 'DEVELOPMENT' && err ? err.message : "An unknown error occured."
        });
    }
};