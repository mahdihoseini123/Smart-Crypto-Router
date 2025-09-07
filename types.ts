
export interface Token {
  id: string;
  name: string;
  image: string;
  symbol?: string;
}

export interface CoinGeckoCoinData {
  id: string;
  symbol: string;
  name: string;
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  platforms: { [key: string]: string | null };
}

export interface Ticker {
  base: string;
  target: string;
  market: {
    name: string;
    identifier: string;
    has_trading_incentive: boolean;
  };
  trade_url: string | null;
}

export interface TickerResponse {
  name: string;
  tickers: Ticker[];
}

export interface Exchange {
  name: string;
  url?: string | null;
  base?: string;
}

export interface CommonExchange {
  name: string;
  from: Exchange;
  to: Exchange;
}

export interface IndirectExchange {
  name: string;
  hub: Exchange;
}

export interface RouteResult {
  fromData: CoinGeckoCoinData;
  toData: CoinGeckoCoinData;
  commonExchanges: CommonExchange[];
  indirectPathExchanges: IndirectExchange[];
  fromExchanges: Exchange[];
  toExchanges: Exchange[];
}