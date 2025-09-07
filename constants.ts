import { Token } from './types';

export const SONIC_TOKEN: Token = {
    id: 'sonic-3',
    name: 'Sonic',
    image: 'https://assets.coingecko.com/coins/images/36284/small/sonic.jpg?1708579997'
};

export const TOP_COINS: Token[] = [
    SONIC_TOKEN,
    { id: 'bitcoin', name: 'Bitcoin (BTC)', image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png' },
    { id: 'ethereum', name: 'Ethereum (ETH)', image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
    { id: 'tether', name: 'Tether (USDT)', image: 'https://assets.coingecko.com/coins/images/325/small/Tether.png' },
    { id: 'binancecoin', name: 'BNB (BNB)', image: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png' },
    { id: 'solana', name: 'Solana (SOL)', image: 'https://assets.coingecko.com/coins/images/4128/small/solana.png' },
    { id: 'usd-coin', name: 'USD Coin (USDC)', image: 'https://assets.coingecko.com/coins/images/6319/small/usdc.png' },
    { id: 'ripple', name: 'XRP (XRP)', image: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png' },
    { id: 'dogecoin', name: 'Dogecoin (DOGE)', image: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png' },
];

export const PLATFORM_INFO: { [key: string]: { name: string; dex: string; hubTokenSymbol: string } } = {
    'solana': { name: 'Solana', dex: 'Jupiter (jup.ag)', hubTokenSymbol: 'SOL'},
    'ethereum': { name: 'Ethereum', dex: 'Uniswap', hubTokenSymbol: 'ETH'},
    'binance-smart-chain': { name: 'BNB Chain', dex: 'PancakeSwap', hubTokenSymbol: 'BNB'},
    'polygon-pos': { name: 'Polygon', dex: 'QuickSwap', hubTokenSymbol: 'MATIC'},
    'arbitrum-one': { name: 'Arbitrum', dex: 'Camelot', hubTokenSymbol: 'ETH'},
    'avalanche': { name: 'Avalanche', dex: 'Trader Joe', hubTokenSymbol: 'AVAX'}
};
