'use server';

import qs from "query-string";

const BASE_URL = process.env.COINGECKO_BASE_URL;
const API_KEY = process.env.COINGECKO_API_KEY;

if (!BASE_URL) throw new Error("Couldn't find COINGECKO_BASE_URL in env");
if (!API_KEY) throw new Error("Couldn't find COINGECKO_API_KEY in env");

export async function fetcher<T>(
  endpoint: string,
  params?: QueryParams,
  revalidate = 60
): Promise<T> {
  const url = qs.stringifyUrl({
    url: `${BASE_URL}${endpoint}`,
    query: params
  }, { skipEmptyString: true, skipNull: true });

  const response = await fetch(url, {
    headers: {
      "x-cg-demo-api-key": API_KEY,
      "Content-Type": "application/json"
    } as Record<string, string>,
    next: { revalidate }
  });

  if (!response.ok) {
    const errorBody: CoinGeckoErrorBody = await response.json().catch(() => ({}));
    console.log(errorBody);
    throw new Error(`API Error: ${response.status}: - ${errorBody.error || response.statusText}`);
  }

  await new Promise(resolve => setTimeout(resolve, 1000));
  return response.json();
};

export async function getPools(
  id: string,
  network?: string | null,
  contractAddress?: string | null
): Promise<PoolData> {
  const fallback: PoolData = {
    id: "",
    address: "",
    name: "",
    network: "",
  };
  try {
    if (network && contractAddress) {
      const poolData = await fetcher<{ data: PoolData[] }>(
        `/onchain/networks/${network}/tokens/${contractAddress}/pools`
      );

      return poolData.data?.[0] ?? fallback;
    }
  } catch (error) {
    console.error(error);
    return fallback;
  }

  try {
    const poolData = await fetcher<{ data: PoolData[] }>(
      "/onchain/search/pools",
      { query: id }
    );

    return poolData.data?.[0] ?? fallback;
  } catch {
    return fallback;
  }
}