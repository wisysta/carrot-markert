import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";

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
        </SWRConfig>
    );
}

export default MyApp;
