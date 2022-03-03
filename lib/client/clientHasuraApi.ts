import { Video, VideoStats } from "@/models/video";
import axios from "axios";

export const changeVideoFavorite = async (status: 'like' | 'dislike' | 'clear', videoId: string) =>
{
    return (await axios.put(`/api/video/${videoId}/stats`, {
        action: status
    })).data.data as any as VideoStats;
};

export const getVideoStatsById = async (videoId: string) =>
{
    return (await axios.get(`/api/video/${videoId}/stats`)).data.data as any as VideoStats;
};

export const getMyVideos = async () =>
{
    return (await axios.get('/api/video/myVideos')).data as any as Video[];
};