import React from 'react';
import { Token } from '../types';
import { ChevronDownIcon } from './icons';

interface TokenSelectorProps {
  label: string;
  token: Token | null;
  onClick: () => void;
}

const TokenSelector: React.FC<TokenSelectorProps> = ({ label, token, onClick }) => {
  return (
    <div className="w-full md:w-2/5">
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{label}</label>
      <button 
        onClick={onClick}
        className="flex items-center justify-between w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
      >
        {token ? (
          <div className="flex items-center space-x-2 overflow-hidden">
            <img src={token.image} alt={token.name} className="w-6 h-6 rounded-full flex-shrink-0" />
            <span className="font-medium truncate">{token.name}</span>
          </div>
        ) : (
          <span className="text-gray-400">Select Token</span>
        )}
        <ChevronDownIcon />
      </button>
    </div>
  );
};

export default TokenSelector;
