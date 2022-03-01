// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Video } from '@/models/video';
import { getVideosByKeyword } from 'lib/videosApi';
import type { NextApiRequest, NextApiResponse } from 'next';


export default (req: NextApiRequest, res: NextApiResponse<Video | { message: string; }>) =>
{
    const { id } = req.query;
    var video = getVideosByKeyword('').find(v => v.id.videoId === id);
    if (video)
    {
        res.status(200).send(video);
    } else
    {
        res.status(404).send({ message: `Video with id ${id} not found` });
    }
};
