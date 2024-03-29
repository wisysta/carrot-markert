import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";

declare module "iron-session" {
    interface IronSessionData {
        user?: {
            id: number;
        };
    }
}

const cookieOptions = {
    cookieName: "ironsession",
    password: process.env.IRON_PASSWORD!,
};

export function withApiSession(fn: any) {
    return withIronSessionApiRoute(fn, cookieOptions);
}

export function withSsrSession(handler: any) {
    return withIronSessionSsr(handler, cookieOptions);
}
