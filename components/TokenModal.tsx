import React, { useState, useMemo } from 'react';
import { Token } from '../types';
import { TOP_COINS } from '../constants';
import { findIdFromContractAddress, getTokenData } from '../services/coingeckoService';
import { CloseIcon, SearchIcon } from './icons';

interface TokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTokenSelect: (token: Token) => void;
}

const TokenModal: React.FC<TokenModalProps> = ({ isOpen, onClose, onTokenSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [isContractSearching, setIsContractSearching] = useState(false);

  const filteredTokens = useMemo(() => {
    if (!searchTerm) return TOP_COINS;
    const lowercasedFilter = searchTerm.toLowerCase();
    return TOP_COINS.filter(coin =>
      coin.name.toLowerCase().includes(lowercasedFilter)
    );
  }, [searchTerm]);

  const handleContractSearch = async () => {
      const query = searchTerm.trim();
      if (!query.startsWith('0x') || query.length !== 42) {
          setMessage('Invalid contract address. It must start with 0x and be 42 characters long.');
          return;
      }
      
      setIsContractSearching(true);
      setMessage('Searching for contract...');
      try {
          const tokenId = await findIdFromContractAddress(query);
          const tokenData = await getTokenData(tokenId);
          
          const foundToken: Token = {
              id: tokenData.id,
              name: `${tokenData.name} (${tokenData.symbol.toUpperCase()})`,
              image: tokenData.image.small,
              symbol: tokenData.symbol
          };
          onTokenSelect(foundToken);
      } catch (error: any) {
          setMessage(error.message || 'Contract search failed.');
      } finally {
          setIsContractSearching(false);
      }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleContractSearch();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-2xl bg-white dark:bg-gray-800 animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-3 border-b dark:border-gray-700">
          <p className="text-2xl font-bold">Select a Token</p>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <CloseIcon />
          </button>
        </div>
        <div className="my-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <SearchIcon />
            </div>
            <input
              type="text"
              id="token-search-input"
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setMessage('');
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search by name or paste contract address..."
              className="w-full p-2 pl-10 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 transition"
            />
            {searchTerm.startsWith('0x') && (
                 <button
                    onClick={handleContractSearch}
                    disabled={isContractSearching}
                    className="absolute inset-y-0 right-0 flex items-center justify-center px-3 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 disabled:text-gray-400 disabled:cursor-wait"
                >
                    {isContractSearching ? 'Searching...' : 'Search'}
                </button>
            )}
          </div>
          <div id="modal-message" className="text-xs text-center text-red-500 dark:text-red-400 mt-2 h-4">{message}</div>
        </div>
        <ul className="max-h-72 overflow-y-auto space-y-1">
          {filteredTokens.map(coin => (
            <li
              key={coin.id}
              onClick={() => onTokenSelect(coin)}
              className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded-lg text-sm space-x-3"
            >
              <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
              <span className="font-medium">{coin.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// FIX: Add default export for the TokenModal component.
export default TokenModal;