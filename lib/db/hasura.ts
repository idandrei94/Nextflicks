import { VideoStats } from "@/models/video";

export const fetchGraphQL = async <T>(operationsDoc: string, operationsName: string | undefined, variables: T) =>
{
    const result = await fetch(process.env.HASURA_URL!, {
        method: "POST",
        body: JSON.stringify({
            query: operationsDoc,
            variables: variables,
            operationsName: operationsName
        }),
        headers: {
            "x-hasura-admin-secret": process.env.HASURA_SECRET!
        }
    });
    return await result.json();
};

export const getUsersQuery = `
        query MyQuery {
            users {
                email
                id
                issuer
                publicAddress
            }
        }
    `;

export const getStatsByUserAndVideoIdQuery = `
        query ($userId: String!, $videoId: String!) {
            stats(where: {userId: {_eq: $userId}, videoId: {_eq: $videoId}}) {
            favorite
            id
            userId
            videoId
            watched
            }
        }
    `;

export const getUserByIssuerQuery = `
    query MyQuery($issuer: String!) {
        users_by_pk(issuer: $issuer) {
          id
          issuer
          email
          publicAddress
        }
      }
    `;

export const getVideoLikeCountQuery = `
query ($videoId: String!) {
    stats(where: {videoId: {_eq: $videoId}}) {
        id
      }
      stats_aggregate {
        aggregate {
          sum {
            favorite
          }
          count
        }
      }
  }
`;

export const getMyVideosQuery = `
query ($userId: String!) {
    stats(where: {userId: {_eq: $userId}}) {
      videoId
    }
  }
`;

export const createUserMutation = `
      mutation MyMutation($email: String!, $issuer: String!) {
        insert_users_one(object: {email: $email, publicAddress: $email, issuer: $issuer }) {
          id
          issuer
          email
          publicAddress
        }
      }
    `;

const createVideoStatsMutation = `
mutation ($userId: String!, $videoId: String!) {
    insert_stats_one(object: {favorite: 0, userId: $userId, watched: false, videoId: $videoId}) {
        id
        userId
        videoId
        watched,
        favorite
    }
  }
`;

const changeStatsFavoriteMutation = `
mutation ($id: Int!, $favorite: Int!) {
    update_stats_by_pk(pk_columns: {id: $id}, _set: {favorite: $favorite}) {
        id
        userId
        videoId
        watched,
        favorite
    }
  }
`;

export const hasuraUserExists = async (issuer: string) =>
{
    const response = await fetchGraphQL(getUserByIssuerQuery, undefined, { issuer: issuer }) as any as {
        data: {
            users_by_pk: {
                id: number,
                issuer: string,
                email: string,
                publicAddress: string;
            };
        };
    };
    return response && response.data && response.data.users_by_pk;
};

export const hasuraGetUserVideos = async (userId: string) =>
{
    const response = (await fetchGraphQL(getMyVideosQuery, undefined, { userId })) as any as {
        data: {
            stats: { videoId: string; }[];
        };
    };
    return response.data.stats;
};

export const hasuraGetStatsByVideoAndUserId = async (userId: string, videoId: string): Promise<VideoStats> =>
{
    const response = (await fetchGraphQL(getStatsByUserAndVideoIdQuery, undefined, { userId: userId, videoId: videoId }) as any as {
        data: {
            users_by_pk: {
                id: number,
                issuer: string,
                email: string,
                publicAddress: string;
            };
        };
    }) as any as {
        data: {
            stats: VideoStats[];
        };
    };
    if (response.data.stats && response.data.stats.length > 0)
    {
        return response.data.stats[0];
    } else
    {
        return await hasuraCreateStatsByVideoAndUserId(userId, videoId);
    }
};

export const hasuraGetLikeCount = async (videoId: string): Promise<{ sum: { favorite: number; }, count: number; }> =>
{

    const response = (await fetchGraphQL(getVideoLikeCountQuery, undefined, { videoId: videoId }) as any as {
        data: {
            users_by_pk: {
                id: number,
                issuer: string,
                email: string,
                publicAddress: string;
            };
        };
    }) as any as {
        data: {
            stats_aggregate: {
                aggregate: {
                    sum: {
                        favorite: 1;
                    },
                    count: number;
                };
            };
        };
    };
    return response.data.stats_aggregate.aggregate;
};

export const hasuraCreateStatsByVideoAndUserId = async (userId: string, videoId: string) =>
{
    const response = await fetchGraphQL(createVideoStatsMutation, undefined, { userId: userId, videoId: videoId }) as any as {
        data: {
            insert_stats_one: {
                id: number,
                issuer: string,
                email: string,
                publicAddress: string;
            };
        };
    };
    return (response as any as {
        data: {
            insert_stats_one: VideoStats;
        };
    }).data.insert_stats_one;
};

const likeStatusToValue = (status: 'like' | 'dislike' | 'clear'): Number =>
{
    switch (status)
    {
        case 'like':
            return 1;
        case 'dislike':
            return -1;
        default:
            return 0;
    }
};

export const hasuraStatsChangeFavorite = async (statsId: number, likeStatus: 'like' | 'dislike' | 'clear') =>
{
    const response = await fetchGraphQL(changeStatsFavoriteMutation, undefined, { id: statsId, favorite: likeStatusToValue(likeStatus) }) as any as {
        data: {
            update_stats_by_pk: VideoStats;
        };
    };
    return response.data.update_stats_by_pk;
};