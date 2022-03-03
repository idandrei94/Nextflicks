export interface Video
{
    kind: string;
    etag: string;
    id: {
        videoId: string;
        kind: string;
    };
    snippet: Snippet;
}

interface Snippet
{
    publicshedAt: Date;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
        default: Thumbnail;
        medium: Thumbnail;
        high: Thumbnail;
    };
    channelTitle: string;
    liveBroadcastContent: string,
    publishTime: Date;
}

interface Thumbnail
{
    url: string;
    width: number;
    height: number;
}

export interface VideoStats
{
    favorite: number,
    id: number,
    userId: string,
    videoId: string,
    watched: boolean;
    likeTotal: number;
    viewsTotal: number;
}