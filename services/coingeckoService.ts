import { CoinGeckoCoinData, TickerResponse, Exchange, RouteResult, CommonExchange, IndirectExchange, Ticker } from '../types';

const API_BASE_URL = process.env.COINGECKO_API_BASE_URL || 'https://api.coingecko.com/api/v3';
const API_KEY = process.env.COINGECKO_API_KEY;

// Helper to construct the final URL with an API key if available
function getApiUrl(path: string): string {
  const url = `${API_BASE_URL}${path}`;
  if (API_KEY) {
    const separator = url.includes('?') ? '&' : '?';
    // The Pro API uses a specific query parameter for the key
    return `${url}${separator}x_cg_pro_api_key=${API_KEY}`;
  }
  return url;
}

// A small helper to handle API responses and errors consistently.
async function handleApiResponse<T,>(response: Response): Promise<T> {
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('The requested resource was not found.');
    }
    if (response.status === 429) {
      throw new Error('You have exceeded the API rate limit. Please wait a minute and try again.');
    }
    if (response.status === 401 || response.status === 403) {
      throw new Error('Invalid API key or access denied.');
    }
    throw new Error(`API Error: ${response.statusText} (Code: ${response.status})`);
  }
  return await response.json();
}

/**
 * Fetches detailed data for a specific coin by its ID.
 */
export async function getTokenData(tokenId: string): Promise<CoinGeckoCoinData> {
  if (!tokenId) throw new Error('Invalid token ID.');
  const response = await fetch(getApiUrl(`/coins/${tokenId.toLowerCase()}`));
  return handleApiResponse<CoinGeckoCoinData>(response);
}

/**
 * Fetches ticker data (exchange listings) for a specific coin.
 */
export async function getTokenTickers(tokenId: string): Promise<TickerResponse> {
  if (!tokenId) return { name: '', tickers: [] };
  const response = await fetch(getApiUrl(`/coins/${tokenId.toLowerCase()}/tickers`));
  // This can fail for some tokens, so we'll handle it gracefully.
  if (!response.ok) {
    console.warn(`Could not fetch tickers for ${tokenId}. Status: ${response.status}`);
    return { name: '', tickers: [] };
  }
  return await response.json();
}

/**
 * Finds a CoinGecko token ID from a contract address by checking multiple platforms.
 */
export async function findIdFromContractAddress(contractAddress: string): Promise<string> {
  const platforms = ['ethereum', 'solana', 'binance-smart-chain', 'polygon-pos', 'arbitrum-one', 'avalanche'];
  for (const platform of platforms) {
    try {
      // Add a small delay to avoid hitting rate limits too quickly in a loop
      await new Promise(resolve => setTimeout(resolve, 250));
      const response = await fetch(getApiUrl(`/coins/${platform}/contract/${contractAddress.toLowerCase()}`));
      if (response.ok) {
        const data = await response.json();
        if (data && data.id) return data.id;
      }
      if (response.status === 429) {
        throw new Error('You have exceeded the API rate limit.');
      }
      if (response.status === 401 || response.status === 403) {
        throw new Error('Invalid API key or access denied.');
      }
    } catch (error) {
      if (error instanceof Error && (error.message.includes('rate limit') || error.message.includes('API'))) throw error;
      console.warn(`Error searching contract on ${platform}:`, error);
    }
  }
  throw new Error('Token with this contract address was not found on supported networks.');
}

/**
 * Analyzes fetched data to find direct and indirect swap routes.
 */
export function analyzePaths(fromData: CoinGeckoCoinData, toData: CoinGeckoCoinData, fromTickersData: TickerResponse, toTickersData: TickerResponse): RouteResult {
  const getUniqueExchangesWithUrls = (tickers: Ticker[]): Exchange[] => {
    const seen = new Set<string>();
    return tickers
      .filter(t => {
        const isSeen = seen.has(t.market.name);
        if (!isSeen) seen.add(t.market.name);
        return !isSeen;
      })
      .map(t => ({ name: t.market.name, url: t.trade_url, base: t.base }));
  };

  // For info cards and analysis
  const fromExchanges = getUniqueExchangesWithUrls(fromTickersData.tickers);
  const toExchanges = getUniqueExchangesWithUrls(toTickersData.tickers);

  // CEX Analysis
  const commonExchangeNames = fromExchanges.map(e => e.name).filter(name => toExchanges.some(e => e.name === name));
  const commonExchanges: CommonExchange[] = commonExchangeNames.map(name => ({
    name,
    from: fromExchanges.find(e => e.name === name)!,
    to: toExchanges.find(e => e.name === name)!,
  }));

  let indirectPathExchanges: IndirectExchange[] = [];
  if (commonExchanges.length === 0) {
    const hubTickersData = fromTickersData.tickers.concat(toTickersData.tickers).filter(t => t.target === 'USDT');
    const hubExchanges = getUniqueExchangesWithUrls(hubTickersData.map(t => ({...t, base: t.target})));
    const fromAndHubNames = fromExchanges.map(e => e.name).filter(name => hubExchanges.some(e => e.name === name));
    const toAndHubNames = toExchanges.map(e => e.name).filter(name => hubExchanges.some(e => e.name === name));
    const indirectCommonNames = fromAndHubNames.filter(name => toAndHubNames.includes(name));
    indirectPathExchanges = indirectCommonNames.map(name => ({
      name,
      hub: hubExchanges.find(e => e.name === name)!,
    }));
  }

  return {
    fromData,
    toData,
    commonExchanges,
    indirectPathExchanges,
    fromExchanges,
    toExchanges,
  };
}
