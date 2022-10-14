import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
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
    const product = await client.product.findUnique({
        where: {
            id: Number(id),
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                },
            },
        },
    });
    const terms = product?.name.split(" ").map((word) => ({
        name: {
            contains: word,
        },
    }));
    const relatedProducts = await client.product.findMany({
        where: {
            OR: terms,
            AND: {
                id: {
                    not: product?.id,
                },
            },
        },
    });
    const isLiked = Boolean(
        await client.fav.findFirst({
            where: {
                product_id: product?.id,
                user_id: user?.id,
            },
            select: {
                id: true,
            },
        })
    );
    res.json({ ok: true, product, relatedProducts, isLiked });
}

export default withApiSession(
    withHandler({ methods: ["GET"], handler, isPrivate: true })
);
