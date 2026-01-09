import CoinsPagination from "@/components/CoinsPagination";
import DataTable from "@/components/DataTable";
import { fetcher } from "@/lib/coingecko.actions";
import { cn, formatCurrency, formatCurrencyShrt, formatPercentage } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const columns: DataTableColumn<CoinMarketData>[] = [
  {
    header: "Rank",
    cellClassName: "rank-cell",
    cell: coin => (
      <>
        #{coin.market_cap_rank}
        <Link href={`/coins/${coin.id}`} aria-label="View coin" />
      </>
    )
  },
  {
    header: "Token",
    cellClassName: "token-cell",
    cell: coin => (
      <div className="token-info">
        <Image src={coin.image} alt={coin.name} width={36} height={36} />
        <p>{coin.name} ({coin.symbol.toUpperCase()})</p>
      </div>
    )
  },
  {
    header: "Price",
    cellClassName: "price-cell",
    cell: coin => formatCurrency(coin.current_price)
  },
  {
    header: "24h Change",
    cellClassName: "change-cell",
    cell: coin => {
      const isTrendingUp = coin.price_change_percentage_24h > 0;

      return (
        <span
          className={cn("change-value", {
            "text-green-600": isTrendingUp,
            "text-red-500": !isTrendingUp,
          })}
        >
          {isTrendingUp && "+"}
          {formatPercentage(coin.price_change_percentage_24h)}
        </span>
      );
    }
  },
  {
    header: 'Market Cap',
    cellClassName: 'market-cap-cell',
    cell: (coin) => formatCurrencyShrt(coin.market_cap),
  },
];


export default async function page({ searchParams }: NextPageProps) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const per_page = 10;

  try {
    const coins = await fetcher<CoinMarketData[]>("/coins/markets", {
      vs_currency: "usd",
      per_page,
      page: currentPage,
      sparkline: false,
      price_change_percentage: "24h",
    });

    const hasMorePages = coins.length === per_page;

    const estimatedTotalPages = currentPage >= 100 ? Math.ceil(currentPage / 100) * 100 + 100 : 100;

    return (
      <main id="coins-page">
        <div className="content">
          <h4>All Coins</h4>

          <DataTable
            columns={columns}
            data={coins ?? []}
            rowKey={(coin) => coin.id}
            tableClassName="coins-table"
          />

          <CoinsPagination
            currentPage={currentPage}
            totalPages={estimatedTotalPages}
            hasMorePages={hasMorePages}
          />
        </div>
      </main>
    )
  } catch (error) {
    console.error("Failed to load all coins", error);
    return <p className="text-gray-500 text-center">Failed to load all coins</p>
  }
};