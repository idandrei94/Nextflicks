import { Video } from "@/models/video";
import videoJson from '../data/videos.json';

const getVideosByKeyword = (keyword: string): Video[] =>
{
    keyword.toLowerCase();
    return videoJson.items as unknown as Video[];
};

export { getVideosByKeyword };