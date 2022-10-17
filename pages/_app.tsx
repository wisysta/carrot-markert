import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import Script from "next/script";

const swrConfig = {
    fetcher: (url: string) => fetch(url).then((response) => response.json()),
    // refreshInterval: 200,
};

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <SWRConfig value={swrConfig}>
            <div className="w-full max-w-xl mx-auto">
                <Component {...pageProps} />
            </div>
            <Script
                src="https://developers.kakao.com/sdk/js/kakao.js"
                strategy="lazyOnload"
            />
            <Script
                src="https://connect.facebook.net/en_US/sdk.js"
                // onLoad={() => {
                //     window.fbAsyncInit = function () {
                //         FB.init({
                //             appId: "your-app-id",
                //             autoLogAppEvents: true,
                //             xfbml: true,
                //             version: "v13.0",
                //         });
                //     };
                // }}
            />
        </SWRConfig>
    );
}

export default MyApp;
