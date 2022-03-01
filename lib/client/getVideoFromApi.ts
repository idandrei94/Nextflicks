import { Video } from "@/models/video";
import axios from "axios";

export const getVideoFromApiById = async (id: string) =>
{
    return (await axios.get<Video>(`/api/video/${id}`)).data;
};