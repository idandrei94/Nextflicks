import { Video } from "@/models/video";
import videoJson from '../data/videos.json';

const getVideosByKeyword = (keyword: string): Video[] =>
{
    keyword.toLowerCase();
    const videos = (videoJson.items as unknown as Video[]).filter(v => v.id.kind === 'youtube#video')
        .sort((a, b) => Math.random() - 0.5);
    return videos;
};

export { getVideosByKeyword };