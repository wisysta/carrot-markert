import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    if (req.method === "POST") {
        const {
            body: { question, latitude, longitude },
            session: { user },
        } = req;
        const post = await client.post.create({
            data: {
                question,
                latitude,
                longitude,
                user: {
                    connect: {
                        id: user?.id,
                    },
                },
            },
        });
        res.json({
            ok: true,
            post,
        });
    }
    if (req.method === "GET") {
        const {
            query: { latitude, longitude },
        } = req;

        const parsedLatitude = latitude && parseFloat(latitude.toString());
        const parsedLongitude = longitude && parseFloat(longitude.toString());

        if (!(parsedLatitude && parsedLongitude)) {
            return res.json({
                ok: false,
            });
        }

        const posts = await client.post.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
                _count: {
                    select: {
                        wondering_set: true,
                        answer_set: true,
                    },
                },
            },
            where: {
                latitude: {
                    gte: parsedLatitude - 0.1,
                    lte: parsedLatitude + 0.1,
                },
                longitude: {
                    gte: parsedLongitude - 0.1,
                    lte: parsedLongitude + 0.1,
                },
            },
        });
        res.json({
            ok: true,
            posts,
        });
    }
}

export default withApiSession(
    withHandler({
        methods: ["GET", "POST"],
        handler,
    })
);
