import { GetServerSidePropsContext, NextApiRequest, PreviewData } from "next";
import { ParsedUrlQuery } from "querystring";
import jwt, { JwtPayload } from 'jsonwebtoken';

const useRedirectUser = (context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData> | string) =>
{
    try
    {
        const token = typeof context === 'string' ? context : (context.req ? context.req.cookies[process.env.JWT_COOKIE_NAME || 'JWT_AUTH_COOKIE'] : null);
        const payload = verifyToken(token);
        if (!payload || !payload.issuer)
        {
            return {
                redirect: {
                    props: {},
                    redirect: {
                        destination: "/login",
                        permanent: false
                    }
                }
            };
        } else
        {
            return payload ? {
                payload: payload
            } : {
                redirect: {
                    props: {},
                    redirect: {
                        destination: "/login",
                        permanent: false
                    }
                }
            };
        };
    } catch {
        return {
            redirect: {
                props: {},
                redirect: {
                    destination: "/login",
                    permanent: false
                }
            }
        };
    }
};

const verifyToken = (token: string | null): JwtPayload | null =>
{
    if (!token)
    {
        return null;
    } else
    {
        try
        {
            return jwt.verify(token,
                process.env.JWT_SECRET!) as JwtPayload;
        } catch
        {
            return null;
        }
    }
};

export default useRedirectUser;