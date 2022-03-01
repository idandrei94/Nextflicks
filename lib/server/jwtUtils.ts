import jwt from 'jsonwebtoken';
import { MagicUserMetadata } from 'magic-sdk';

export const createJwt = (payload: string | object | Buffer, key: string) =>
{
    return jwt.sign(payload, key, {
        algorithm: "HS512"
    });
};

export const createTokenPayload = (metadata: MagicUserMetadata) =>
{
    const exp = Math.floor(Date.now() / Number.parseInt(process.env.MAX_AGE || '604800'));
    return {
        payload: {
            ...metadata,
            iat: Math.floor(Date.now() / 1000),
            exp: exp,
            "https://hasura.io/jwt/claims": {
                "x-hasura-allowed-roles": ["user", "admin"],
                "x-hasura-default-role": "admin",
                "x-hasura-user-id": metadata.issuer
            }
        }, exp: exp
    };
};