import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    const {
        session: { user },
    } = req;
    const favs = await client.fav.findMany({
        where: {
            user_id: user?.id,
        },
        include: {
            product: {
                include: {
                    _count: {
                        select: { fav_set: true },
                    },
                },
            },
        },
    });
    res.json({
        ok: true,
        favs,
    });
}

export default withApiSession(
    withHandler({
        methods: ["GET"],
        handler,
    })
);
