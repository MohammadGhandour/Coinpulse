import { fetcher } from "@/lib/coingecko.actions";
import { cn, formatCurrency } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DataTable from "../DataTable";
import { TrendingCoinsFallback } from "./fallback";

const columns: DataTableColumn<TrendingCoin>[] = [
  {
    header: "Name",
    cellClassName: "name-cell",
    cell: (coin) => {
      const { item: { id, large, name } } = coin;
      return (
        <Link href={`/coins/${id}`}>
          <Image
            src={large}
            alt={name}
            width={46}
            height={46}
            className="rounded-full"
          />
          <p>{name}</p>
        </Link>
      )
    }
  },
  {
    header: "24h Change",
    cellClassName: "name-cell",
    cell: (coin) => {
      const { item: { data: { price_change_percentage_24h } } } = coin;
      const isTrendingUp = price_change_percentage_24h.usd > 0;

      return (
        <div className={cn("price-change", isTrendingUp ? "text-green-500" : "text-red-500")}>
          <p>
            {isTrendingUp ? <TrendingUp width={16} height={16} /> : <TrendingDown width={16} height={16} />}
            {Math.abs(price_change_percentage_24h.usd).toFixed(2)}%
          </p>
        </div>
      )
    }
  },
  {
    header: "Price",
    cellClassName: "price-cell",
    cell: (coin) => formatCurrency(coin.item.data.price, "USD", "en-US", 4)
  }
];

export default async function TrendingCoins() {
  let trendingCoins;
  try {
    trendingCoins = await fetcher<{ coins: TrendingCoin[] }>("/search/trending", undefined, 300);
  } catch (error) {
    console.error('Failed to fetch trending coins data:', error);
    return <TrendingCoinsFallback isError />
  }

  return (
    <div id="trending-coins">
      <h4>Trending Coins</h4>
      <DataTable
        data={trendingCoins.coins.slice(0, 6) || []}
        columns={columns}
        rowKey={(coin) => coin.item.id}
        tableClassName="trending-coins-table"
        headerCellClassName="py-3"
        bodyCellClassName="py-2"
      />
    </div>
  );
};