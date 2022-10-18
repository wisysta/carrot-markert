import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useEffect } from "react";
import Link from "next/link";
import { Product, User } from "@prisma/client";
import useMutation from "@libs/client/useMutation";
import { cls } from "@libs/client/utils";
import Image from "next/image";
import client from "@libs/server/client";

interface ProductWithUser extends Product {
    user: User;
}

interface ItemDetailResponse {
    ok: boolean;
    product: ProductWithUser;
    relatedProducts: Product[];
    isLiked: boolean;
}

const ItemDetail: NextPage<ItemDetailResponse> = ({
    product,
    relatedProducts,
    isLiked,
}) => {
    const router = useRouter();
    const { data, mutate: boundMutate } = useSWR<ItemDetailResponse>(
        router.query.id ? `/api/products/${router.query.id}` : null
    );
    const [toggleFav] = useMutation(`/api/products/${router.query.id}/fav`);
    const onFavClick = () => {
        if (!data) return;
        boundMutate(
            (prev) => prev && { ...prev, isLiked: !data.isLiked },
            false
        );
        toggleFav({});
    };

    if (router.isFallback) {
        return (
            <Layout title="Loading....">
                <span>Loading....</span>
            </Layout>
        );
    }

    return (
        <Layout canGoBack seoTitle="Product Detail">
            <div className="px-4  py-4">
                <div className="mb-8">
                    <div className="relative pb-80">
                        <Image
                            src={`https://imagedelivery.net/1eWj_AuWvuDvW69i0NTKxg/${product.image}/public`}
                            className="h-96 bg-slate-300 object-cover"
                            layout="fill"
                        />
                    </div>
                    <div className="flex cursor-pointer py-3 border-t border-b items-center space-x-3">
                        <Image
                            width={48}
                            height={48}
                            src={`https://imagedelivery.net/1eWj_AuWvuDvW69i0NTKxg/${product.user.avatar}/avatarCrop`}
                            className="w-12 h-12 rounded-full bg-slate-300"
                        />
                        <div>
                            <p className="text-sm font-medium text-gray-700">
                                {product?.user?.name}
                            </p>
                            <Link
                                href={`/users/profile/${product?.user?.name}`}
                            >
                                <a className="text-xs font-medium text-gray-500">
                                    View profile &rarr;
                                </a>
                            </Link>
                        </div>
                    </div>
                    <div className="mt-5">
                        <h1 className="text-3xl font-bold text-gray-900">
                            {product?.name}
                        </h1>
                        <span className="text-2xl block mt-3 text-gray-900">
                            ${product?.price}
                        </span>
                        <p className=" my-6 text-gray-700">
                            {product?.description}
                        </p>
                        <div className="flex items-center justify-between space-x-2">
                            <Button large text="Talk to seller" />
                            <button
                                onClick={onFavClick}
                                className={cls(
                                    "p-3 rounded-md flex items-center hover:bg-gray-100 justify-center ",
                                    isLiked
                                        ? "text-red-500  hover:text-red-600"
                                        : "text-gray-400  hover:text-gray-500"
                                )}
                            >
                                {isLiked ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="w-6 h-6"
                                    >
                                        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                                    </svg>
                                ) : (
                                    <svg
                                        className="h-6 w-6 "
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Similar items
                    </h2>
                    <div className=" mt-6 grid grid-cols-2 gap-4">
                        {relatedProducts.map(({ name, price }, i) => (
                            <div key={i}>
                                <div className="h-56 w-full mb-4 bg-slate-300" />
                                <h3 className="text-gray-700 -mb-1">{name}</h3>
                                <span className="text-sm font-medium text-gray-900">
                                    {price}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export const getStaticPaths: GetStaticPaths = () => {
    return {
        paths: [],
        fallback: true,
    };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
    if (!ctx?.params?.id) {
        return {
            props: {},
        };
    }
    const product = await client.product.findUnique({
        where: {
            id: Number(ctx.params.id),
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
    const isLiked = false;
    await new Promise((resolve) => setTimeout(resolve, 10000));
    return {
        props: {
            product: JSON.parse(JSON.stringify(product)),
            relatedProducts: JSON.parse(JSON.stringify(relatedProducts)),
            isLiked,
        },
        revalidate: 20,
    };
};

export default ItemDetail;
