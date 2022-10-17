import { NextCookies } from "next/dist/server/web/spec-extension/cookies";
import { NextRequest, NextFetchEvent, NextResponse } from "next/server";
import { userAgent } from "next/server";

interface NextCookiesWithIronSession extends NextCookies {
    ironsession?: string;
}

interface NextRequestWidhSessionCookie extends NextRequest {
    cookies: NextCookiesWithIronSession;
}
export const config = {
    matcher: ["/((?!_next|api/auth).*)(.+)"],
};

export function middleware(req: NextRequest, ev: NextFetchEvent) {
    const { isBot } = userAgent(req);

    if (isBot) {
        req.nextUrl.pathname = "/enter";
        return NextResponse.redirect(req.nextUrl);
    }

    if (req.nextUrl.pathname.startsWith("/community")) {
        const ua = userAgent(req);
        console.log(ua);
        console.log("community!!");
    }
    if (req.nextUrl.pathname.startsWith("/api/posts")) {
        console.log("api/posts");
    }

    if (
        req.cookies.get("ironsession") ||
        req.nextUrl.pathname.startsWith("/enter")
    ) {
        return NextResponse.next();
    }

    if (!req.cookies.get("ironsession")) {
        req.nextUrl.pathname = "/enter";

        return NextResponse.redirect(req.nextUrl);
    }
}
