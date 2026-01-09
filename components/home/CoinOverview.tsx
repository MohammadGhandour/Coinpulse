import { fetcher } from "@/lib/coingecko.actions";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import { CoinOverviewFallback } from "./fallback";
import CandlestickChart from "@/components/CandlestickChart";

export default async function CoinOverview() {
  try {
    const [coin, coinOHLCData] = await Promise.all([
      await fetcher<CoinDetailsData>("/coins/bitcoin", {
        dex_pair_format: "symbol"
      }),
      await fetcher<OHLCData[]>("/coins/bitcoin/ohlc", {
        vs_currency: "usd",
        days: 1,
        // interval: "hourly",
        precision: "full"
      })
    ]);

    return (
      <div id="coin-overview">
        <CandlestickChart data={coinOHLCData} coinId="bitcoin">
          <div className="header pt-2">
            <Image
              src={coin.image.large}
              alt={coin.name}
              width={56}
              height={56}
            />
            <div className="info">
              <p>{coin.name} - {coin.symbol.toUpperCase()}</p>
              <h1>{formatCurrency(coin.market_data.current_price.usd, 4, "USD", true)}</h1>
            </div>
          </div>
        </CandlestickChart>
      </div>
    );

  } catch (error) {
    console.error('Failed to fetch coin overview data:', error);
    return <CoinOverviewFallback isError />
  }
};