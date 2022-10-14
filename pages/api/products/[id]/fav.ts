import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/widthHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    const {
        query: { id },
        session: { user },
    } = req;
    const alreadyExists = await client.fav.findFirst({
        where: {
            product_id: Number(id),
            user_id: user?.id,
        },
    });
    if (alreadyExists) {
        await client.fav.delete({
            where: {
                id: alreadyExists.id,
            },
        });
    } else {
        await client.fav.create({
            data: {
                user: {
                    connect: {
                        id: user?.id,
                    },
                },
                product: {
                    connect: {
                        id: Number(id),
                    },
                },
            },
        });
    }
    res.json({ ok: true });
}

export default withApiSession(
    withHandler({ methods: ["POST"], handler, isPrivate: true })
);
