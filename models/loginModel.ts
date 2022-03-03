export interface LoginModel
{
    name: string;
    validUntil: number;
}

export interface JwtPayloadModel
{
    issuer: string,
    publicAddress: string,
    email: string,
    oauthProvider: string,
    phoneNumber: string,
    iat: number,
    exp: number,
    'https://hasura.io/jwt/claims': {
        'x-hasura-allowed-roles': string[],
        'x-hasura-default-role': string,
        'x-hasura-user-id': string;
    };
}