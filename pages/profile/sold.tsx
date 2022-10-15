import type { NextPage } from "next";
import Item from "@components/item";
import Layout from "@components/layout";
import useSWR from "swr";
import ProductList from "@components/product-list";

const Sold: NextPage = () => {
    const { data } = useSWR(`/api/users/me/sales`);
    return (
        <Layout title="판매내역" canGoBack>
            <div className="flex flex-col space-y-5 pb-10  divide-y">
                <ProductList kind="purchases" />
            </div>
        </Layout>
    );
};

export default Sold;
