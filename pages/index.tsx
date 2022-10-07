import type { NextPage } from "next";

const Home: NextPage = () => {
    return (
        <div className="bg-slate-400 py-20 px-10 grid gap-10">
            <div className="bg-white p-6 rounded-2xl">
                <span className="font-semibold text-3xl">Select Item</span>
                <div className="flex justify-between my-2">
                    <span className="text-gray-500">Grey Chair</span>
                    <span className="font-semibold">$19</span>
                </div>
                <div className="flex justify-between my-2">
                    <span className="text-gray-500">Grey Table</span>
                    <span className="font-semibold">$19</span>
                </div>
                <div className="flex justify-between -2 pt-2 border-t-2 border-dashed">
                    <span>Total</span>
                    <span className="font-semibold">$10</span>
                </div>
                <div className="mt-5 bg-blue-500 text-white text-center rounded-full p-3 w-2/4 mx-auto">
                    Checkout
                </div>
            </div>
            <div className="bg-white overflow-hidden rounded-2xl shadow-xl">
                <div className="bg-blue-500 p-6 pb-14">
                    <span className="text-white text-2xl">Profile</span>
                </div>
                <div className="rounded-3xl p-6 relative -top-5 bg-white space-x-3">
                    <div className="flex relative -top-16 items-end justify-between">
                        <div className="relative mt-5 flex flex-col items-center">
                            <span className="text-sm text-gray-500">Order</span>
                            <span className="">340</span>
                        </div>
                        <div className="h-24 w-24 bg-red-400 -top-16 rounded-full"></div>
                        <div className="relative mt-5 flex flex-col items-center">
                            <span className="text-sm text-gray-500 inline-block h-20 space">
                                Spent
                            </span>
                            <span className="">340</span>
                        </div>
                    </div>
                    <div className="relative flex flex-col items-center -mt-10 -mb-5">
                        <span className="text-lg font-medium">Tony Molly</span>
                        <span className="text-sm text-gray-400">미국</span>
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl"></div>
            <div className="bg-white p-6 rounded-2xl"></div>
        </div>
    );
};

export default Home;
