import DataTable from "@/components/DataTable";

export function CoinOverviewFallback({ isError = false }: { isError?: boolean }) {
  return (
    <div id="coin-overview-fallback">
      <div className="header pt-2">
        <div className="header-image bg-dark-400 animate-pulse" />
        <div className="info">
          {isError ? (
            <>
              <p className="text-gray-500">Unable to load Coin Overview</p>
              <h1 className="text-gray-400">--</h1>
            </>
          ) : (
            <>
              <div className="header-line-sm bg-dark-400 animate-pulse" />
              <div className="header-line-lg bg-dark-400 animate-pulse" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Skeleton data for trending coins table
const skeletonTrendingData = Array(6).fill(null).map((_, index) => ({
  id: `skeleton-${index}`,
}));

const skeletonColumns = [
  {
    header: "Name",
    cellClassName: "name-cell",
    cell: () => (
      <div className="name-link">
        <div className="name-image bg-dark-400 animate-pulse" />
        <div className="name-line bg-dark-400 animate-pulse" />
      </div>
    )
  },
  {
    header: "24h Change",
    cellClassName: "change-cell",
    cell: () => (
      <div className="price-change">
        <div className="change-icon bg-dark-400 animate-pulse" />
        <div className="change-line bg-dark-400 animate-pulse" />
      </div>
    )
  },
  {
    header: "Price",
    cellClassName: "price-cell",
    cell: () => (
      <div className="price-line bg-dark-400 animate-pulse" />
    )
  }
];

export function TrendingCoinsFallback({ isError = false }: { isError?: boolean }) {
  return (
    <div id="trending-coins-fallback">
      <h4>Trending Coins</h4>
      {isError ? (
        <p className="text-gray-500 text-center px-6">Unable to load trending coins data.</p>
      ) : (
        <DataTable
          data={skeletonTrendingData}
          columns={skeletonColumns}
          rowKey={(_, index) => `skeleton-${index}`}
          tableClassName="trending-coins-table"
          headerCellClassName="py-3"
          bodyCellClassName="py-2"
        />
      )}
    </div>
  );
}