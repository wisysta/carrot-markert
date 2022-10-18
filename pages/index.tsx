import type { NextPage } from "next";
import FloatingButton from "@components/floating-button";
import Item from "@components/item";
import Layout from "@components/layout";
import useUser from "@libs/client/useUser";
import Head from "next/head";
import useSWR, { SWRConfig } from "swr";
import { Product } from "@prisma/client";
import client from "@libs/server/client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";

// const BS = dynamic(() => import("@components/item"), {
//     ssr: false,
//     loading: () => <span>Loading...</span>,
//     suspense: true,
// });

import {
    QueryClient,
    QueryClientProvider,
    useQuery,
    dehydrate,
    Hydrate,
} from "react-query";

export interface ProductWithCount extends Product {
    _count: {
        fav_set: number;
    };
}

interface ProductsResponse {
    ok: boolean;
    products: ProductWithCount[];
}

const queryClient = new QueryClient();
const url: string = "/api/products";

const fetcher = (url: string) => fetch(url).then((response) => response.json());

const Home: NextPage<{
    products: ProductWithCount[];
}> = ({ products }) => {
    // console.log(products);
    const [api, setApi] = useState<string>("");

    useEffect(() => {
        setApi(url);
    }, []);

    const { isLoading, error, data } = useQuery<ProductsResponse>(
        api,
        () => fetch(api).then((res) => res.json()),
        { initialData: { ok: true, products }, enabled: api !== "" }
    );
    return (
        <Layout title="홈" hasTabBar>
            <div className="flex flex-col space-y-5 divide-y">
                {data
                    ? data?.products?.map(
                          ({ id, name, price, _count, image }, i) => {
                              return (
                                  <Item
                                      id={id}
                                      key={id}
                                      title={name}
                                      price={price}
                                      hearts={_count?.fav_set}
                                      image={image}
                                  />
                              );
                          }
                      )
                    : "Loading"}
                <FloatingButton href="/items/upload">
                    <svg
                        className="h-6 w-6"
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
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                    </svg>
                </FloatingButton>
            </div>
        </Layout>
    );
};

// const Page: NextPage<{ products: ProductWithCount[] }> = ({ products }) => (
//     <SWRConfig
//         value={{
//             fallback: {
//                 "/api/products": { ok: true, products },
//             },
//         }}
//     >
//         <Home />
//     </SWRConfig>
// );

const PageProvidedReactQuery: NextPage<{
    products: ProductWithCount[];
}> = ({ products }) => (
    <QueryClientProvider client={queryClient}>
        <Home products={products} />
    </QueryClientProvider>
);

export async function getServerSideProps() {
    const products = await client.product.findMany({
        include: {
            _count: {
                select: {
                    fav_set: true,
                },
            },
        },
    });

    return {
        props: {
            products: JSON.parse(JSON.stringify(products)),
        },
    };
}

export default PageProvidedReactQuery;
