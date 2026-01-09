import DataTable from "@/components/DataTable";

export function CoinOverviewFallback() {
  return (
    <div id="coin-overview-fallback">
      <div className="header pt-2">
        <div className="header-image bg-dark-400 animate-pulse" />
        <div className="info">
          <div className="header-line-sm bg-dark-400 animate-pulse" />
          <div className="header-line-lg bg-dark-400 animate-pulse" />
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

export function TrendingCoinsFallback() {
  return (
    <div id="trending-coins-fallback">
      <h4>Trending Coins</h4>
      <DataTable
        data={skeletonTrendingData}
        columns={skeletonColumns}
        rowKey={(_, index) => `skeleton-${index}`}
        tableClassName="trending-coins-table"
      />
    </div>
  );
}