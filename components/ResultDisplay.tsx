import React from 'react';
import { RouteResult, Exchange } from '../types';
import { PLATFORM_INFO } from '../constants';
import { CexDirectIcon, CexIndirectIcon, InfoIcon } from './icons';

interface ResultDisplayProps {
  result: RouteResult;
}

const ExchangeLinks: React.FC<{ exchanges: Exchange[] }> = ({ exchanges }) => {
  if (!exchanges || exchanges.length === 0) return <span className="text-gray-500 dark:text-gray-400">Not found</span>;
  
  const limitedExchanges = exchanges.slice(0, 10);
  
  return (
    <>
      {limitedExchanges.map((ex, index) => (
        <React.Fragment key={ex.name}>
          {ex.url ? (
            <a href={ex.url} target="_blank" rel="noopener noreferrer" className="link">
              {ex.name}
            </a>
          ) : (
            <span>{ex.name}</span>
          )}
          {index < limitedExchanges.length - 1 && ', '}
        </React.Fragment>
      ))}
      {exchanges.length > 10 && ', ...'}
    </>
  );
};


const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  const {
    fromData, toData,
    commonExchanges, indirectPathExchanges, fromExchanges, toExchanges
  } = result;

  const renderCexRoute = () => {
    if (commonExchanges.length > 0) {
      return (
        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 rounded-xl">
          <h3 className="flex items-center text-lg font-bold text-indigo-800 dark:text-indigo-300 mb-2">
            <CexDirectIcon />
            <span className="ml-2">Direct Route: Common Exchanges</span>
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">The easiest way! These exchanges list both tokens:</p>
          <div className="mt-3 space-y-2 text-sm">
            {commonExchanges.slice(0, 3).map(ex => {
               const fromLink = ex.from?.url ? <a href={ex.from.url} target="_blank" rel="noopener noreferrer" className="link">Buy/Sell {ex.from.base}</a> : <span>{ex.from.base}</span>;
               const toLink = ex.to?.url ? <a href={ex.to.url} target="_blank" rel="noopener noreferrer" className="link">Buy/Sell {ex.to.base}</a> : <span>{ex.to.base}</span>;
               return (
                <div key={ex.name} className="flex justify-between items-center text-indigo-600 dark:text-indigo-400">
                    <span className="font-semibold">{ex.name}:</span>
                    <span className="font-normal text-xs flex items-center gap-2">({fromLink} • {toLink})</span>
                </div>
               )
            })}
          </div>
        </div>
      );
    }
    if (indirectPathExchanges.length > 0) {
      return (
        <div className="p-4 bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700 rounded-xl">
          <h3 className="flex items-center text-lg font-bold text-purple-800 dark:text-purple-300 mb-2">
            <CexIndirectIcon />
            <span className="ml-2">Indirect Route: Two-Step Swap</span>
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">On these exchanges, you can swap to USDT first, then to the destination token:</p>
          <div className="mt-3 space-y-1 text-sm">
             {indirectPathExchanges.slice(0, 3).map(ex => (
              <div key={ex.name} className="font-semibold text-purple-600 dark:text-purple-400">{ex.name}</div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };
  
  const cexRoute = renderCexRoute();
  
  return (
    <div className="animate-fade-in text-left space-y-6">
      
      {cexRoute}

      {!cexRoute && (
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl text-center">
              <h3 className="flex items-center justify-center text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
                  <InfoIcon />
                  <span className="ml-2">No Route Found</span>
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Unfortunately, no direct or indirect swap route was found between these two tokens.</p>
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-2 border dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <img src={fromData.image.small} alt={fromData.name} className="w-10 h-10 rounded-full"/>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white">{fromData.name}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">{Object.keys(fromData.platforms).map(p => PLATFORM_INFO[p]?.name || p).filter(Boolean).join(', ') || 'Mainnet'}</p>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-600 pt-2 text-sm">
            <h5 className="font-semibold text-gray-800 dark:text-gray-200">Top Exchanges:</h5>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1"><ExchangeLinks exchanges={fromExchanges} /></p>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-2 border dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <img src={toData.image.small} alt={toData.name} className="w-10 h-10 rounded-full"/>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white">{toData.name}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">{Object.keys(toData.platforms).map(p => PLATFORM_INFO[p]?.name || p).filter(Boolean).join(', ') || 'Mainnet'}</p>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-600 pt-2 text-sm">
            <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Top Exchanges:</h5>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1"><ExchangeLinks exchanges={toExchanges} /></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;