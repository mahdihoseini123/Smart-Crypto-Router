import React, { useState, useCallback, useEffect } from 'react';
import { Token, RouteResult, Exchange } from './types';
import { TOP_COINS, SONIC_TOKEN } from './constants';
import { getTokenData, getTokenTickers, findIdFromContractAddress, analyzePaths } from './services/coingeckoService';
import TokenSelector from './components/TokenSelector';
import TokenModal from './components/TokenModal';
import ResultDisplay from './components/ResultDisplay';
import { SwapIcon } from './components/icons';

function App() {
  // State management for the application
  const [fromToken, setFromToken] = useState<Token | null>(SONIC_TOKEN);
  const [toToken, setToToken] = useState<Token | null>(TOP_COINS[1]); // Bitcoin is now at index 1
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSelector, setActiveSelector] = useState<'from' | 'to' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);

  // Effect to clear results when tokens change
  useEffect(() => {
    setRouteResult(null);
    setError(null);
  }, [fromToken, toToken]);

  const handleSelectClick = (selector: 'from' | 'to') => {
    setActiveSelector(selector);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setActiveSelector(null);
  };

  const handleTokenSelect = (token: Token) => {
    if (activeSelector === 'from') {
      setFromToken(token);
    } else {
      setToToken(token);
    }
    handleCloseModal();
  };

  const handleSwapTokens = () => {
    if (fromToken && toToken) {
      setFromToken(toToken);
      setToToken(fromToken);
    }
  };

  const findRoute = useCallback(async () => {
    // Basic validation before starting the search
    if (!fromToken || !toToken) {
      setError('Please select both a source and a destination token.');
      return;
    }
    if (fromToken.id === toToken.id) {
      setError('Source and destination tokens cannot be the same.');
      return;
    }

    // Rate limiting check, only if no API key is provided
    if (!process.env.COINGECKO_API_KEY) {
      const COOLDOWN_PERIOD_MS = 2 * 60 * 1000; // 2 minutes in milliseconds
      const lastRequestTimestamp = localStorage.getItem('lastApiRequestTimestamp');
      
      if (lastRequestTimestamp) {
        const timeSinceLastRequest = Date.now() - parseInt(lastRequestTimestamp, 10);
        if (timeSinceLastRequest < COOLDOWN_PERIOD_MS) {
          const timeLeftSeconds = Math.ceil((COOLDOWN_PERIOD_MS - timeSinceLastRequest) / 1000);
          setError(`Due to free API limitations, please try again in ${timeLeftSeconds} seconds.`);
          return;
        }
      }
    }


    setIsLoading(true);
    setRouteResult(null);
    setError(null);
    setLoadingMessage('Fetching token data...');

    try {
      // Set timestamp for rate limiting only if using the free API
      if (!process.env.COINGECKO_API_KEY) {
        localStorage.setItem('lastApiRequestTimestamp', Date.now().toString());
      }

      // Fetch all necessary data in parallel for efficiency
      const [fromData, toData, fromTickersData, toTickersData] = await Promise.all([
        getTokenData(fromToken.id),
        getTokenData(toToken.id),
        getTokenTickers(fromToken.id),
        getTokenTickers(toToken.id),
      ]);
      
      setLoadingMessage('Analyzing possible routes...');

      // Analyze the fetched data to find swap routes
      const result = analyzePaths(fromData, toData, fromTickersData, toTickersData);
      setRouteResult(result);

    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [fromToken, toToken]);


  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="w-full max-w-2xl mx-auto p-6 md:p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl shadow-blue-500/10 dark:shadow-blue-500/5 transition-all">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Smart Crypto Router</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Find the best route to swap your crypto assets.</p>
        </header>

        <main>
          <div className="flex flex-col md:flex-row items-center gap-2">
            <TokenSelector
              label="From"
              token={fromToken}
              onClick={() => handleSelectClick('from')}
            />
            
            <div className="pt-4 md:pt-6 text-gray-400">
              <button
                onClick={handleSwapTokens}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-transform duration-300 transform hover:rotate-180"
                aria-label="Swap tokens"
              >
                <SwapIcon />
              </button>
            </div>

            <TokenSelector
              label="To"
              token={toToken}
              onClick={() => handleSelectClick('to')}
            />
          </div>
          
          <button
            onClick={findRoute}
            disabled={isLoading}
            className="mt-6 w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800 transition-colors disabled:bg-blue-400 dark:disabled:bg-blue-800 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Searching...' : 'Find Best Route'}
          </button>
          
          <div className="mt-8 text-center min-h-[50px]">
            {isLoading && (
              <div className="flex flex-col items-center justify-center p-4">
                <div className="loader mb-3"></div>
                <p className="text-gray-500 dark:text-gray-400 animate-pulse">{loadingMessage}</p>
              </div>
            )}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg animate-fade-in">
                <p>{error}</p>
              </div>
            )}
            {routeResult && <ResultDisplay result={routeResult} />}
          </div>
        </main>
      </div>
      <TokenModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onTokenSelect={handleTokenSelect}
      />
    </div>
  );
}

export default App;