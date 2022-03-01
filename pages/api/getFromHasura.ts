import { fetchGraphQL, getUsersQuery } from 'lib/db/hasura';
import type { NextApiRequest, NextApiResponse } from 'next';


export default async (req: NextApiRequest, res: NextApiResponse<any>) =>
{
    const { query, name } = getUsersQuery();
    const { error, data } = await fetchGraphQL(query, name, {});
    if (error)
    {
        return res.status(500).send({ message: error });
    } else
    {
        return res.status(200).send(data);
    }

};
