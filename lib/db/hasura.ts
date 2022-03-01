export const fetchGraphQL = async (operationsDoc: string, operationsName: string, variables: any, token: string) =>
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

export const getUsersQuery = {
    query: `
        query MyQuery {
            users {
                email
                id
                issuer
                publicAddress
            }
        }
    `,
    name: 'MyQuery'
};

export const getUserByIssuerQuery = {
    query: `
    query MyQuery($issuer: String!) {
        users_by_pk(issuer: $issuer) {
          id
          issuer
          email
          publicAddress
        }
      }
    `,
    name: 'MyQuery'
};

export const createUserMutation = {
    name: 'MyMutation',
    query: `
      mutation MyMutation($email: String!, $issuer: String!) {
        insert_users_one(object: {email: $email, publicAddress: $email, issuer: $issuer }) {
          id
        }
      }
    `
};


export const hasuraUserExists = async (issuer: string, token: string) =>
{
    const { query, name } = getUserByIssuerQuery;

    const response = await fetchGraphQL(query, name, { issuer: issuer }, token) as any as {
        data: {
            users_by_pk: {
                id: number,
                issuer: string,
                email: string,
                publicAddress: string;
            };
        };
    };
    console.log(response);
    return response && response.data && response.data.users_by_pk;
};