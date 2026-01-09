import DataTable from "@/components/DataTable";

// Skeleton data for coins table
const skeletonCoinsData = Array(10).fill(null).map((_, index) => ({
  id: `skeleton-${index}`,
}));

const skeletonColumns = [
  {
    header: "Rank",
    cellClassName: "rank-cell",
    cell: () => (
      <div className="rank-skeleton skeleton" />
    )
  },
  {
    header: "Token",
    cellClassName: "token-cell",
    cell: () => (
      <div className="token-info">
        <div className="name-image skeleton" />
        <div className="name-line skeleton" />
      </div>
    )
  },
  {
    header: "Price",
    cellClassName: "price-cell",
    cell: () => (
      <div className="price-line skeleton" />
    )
  },
  {
    header: "24h Change",
    cellClassName: "change-cell",
    cell: () => (
      <div className="price-change">
        <div className="change-icon skeleton" />
        <div className="change-line skeleton" />
      </div>
    )
  },
  {
    header: 'Market Cap',
    cellClassName: 'market-cap-cell',
    cell: () => (
      <div className="value-skeleton-lg skeleton" />
    ),
  },
];

export function CoinsFallback({ isError = false }: { isError?: boolean }) {
  return (
    <main id="coins-page-fallback">
      <div className="content">
        <h4>All Coins</h4>
        {isError ? (
          <p className="text-gray-500 text-center px-6">Failed to load all coins</p>
        ) : (
          <>
            <DataTable
              data={skeletonCoinsData}
              columns={skeletonColumns}
              rowKey={(_, index) => `skeleton-${index}`}
              tableClassName="coins-table"
            />

            {/* Pagination skeleton */}
            <div className="pagination-fallback mt-6 flex justify-center gap-2">
              <div className="pagination-button skeleton" />
              <div className="pagination-button skeleton" />
              <div className="pagination-button skeleton" />
              <div className="pagination-button skeleton" />
              <div className="pagination-button skeleton" />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
