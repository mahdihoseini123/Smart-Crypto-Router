# 🗺️ Smart Crypto Router

[**🚀 Live Demo**](https://sites.google.com/view/smartcryptorouter/smart-crypto-router)

A simple and efficient web tool for finding the best and most optimal route to swap cryptocurrencies. This project was developed to help users quickly find the easiest way to exchange assets on Centralized Exchanges (CEX).

![Smart Crypto Router Screenshot](https://github.com/mahdihoseini123/Smart-Crypto-Router/blob/main/Screenshot.png?raw=true)

## ✨ Features

- **Centralized Exchange (CEX) Route Analysis:**
  - **Direct Route:** Identifies exchanges that list both the source and destination tokens.
  - **Indirect Route:** Suggests two-step paths through a stablecoin intermediary (like USDT) if no direct route exists.
- **Comprehensive Information:**
  - Displays a list of up to **10 top exchanges** for each token for easy review and access.
- **Smart Search:**
  - Search for tokens by name.
  - Find tokens by pasting their Contract Address.
- **Modern UI:**
  - Clean, simple, and fully responsive design.
  - Includes a Dark Mode for comfortable viewing.
  - Smooth animations to enhance the user experience.

## 🛠️ How It Works

This tool is powered by the public **CoinGecko API**. The route-finding process is as follows:

1.  **Select Tokens:** The user chooses their source and destination tokens.
2.  **Fetch Data:** The app retrieves data for both tokens from CoinGecko, including the list of exchanges where they are listed.
3.  **Analyze & Compare:** The algorithm analyzes this data by:
    - Finding common centralized exchanges.
    - Checking for alternative routes (e.g., via USDT) if necessary.
4.  **Display Results:** The best and simplest routes are displayed in order of priority, allowing the user to make an informed decision.

## ⚠️ Limitations

By default, this tool uses the free version of the CoinGecko API. To prevent access from being blocked due to rate limits, a **2-minute cooldown period** is enforced between searches. This limitation is automatically removed if you purchase a CoinGecko Pro plan and add the API key to the settings.

## 🚀 Tech Stack

- **React:** For building a dynamic, component-based user interface.
- **TypeScript:** To add static typing for more stable and maintainable code.
- **Tailwind CSS:** For rapid and responsive UI development.
- **CoinGecko API:** As the primary data source for cryptocurrency information.

## ⚙️ Local Setup

To run this project locally, create a file named `.env` in the project root and copy the variables below into it. This allows you to easily manage the project's configuration.

```dotenv
# Base URL for the CoinGecko API.
# Change this to https://pro-api.coingecko.com/api/v3 to use the Pro version.
COINGECKO_API_BASE_URL=https://api.coingecko.com/api/v3

# API key for the CoinGecko Pro plan (optional).
# Leave this empty to use the free version.
# By purchasing a Pro plan and adding your key here, the rate limit will be removed.
COINGECKO_API_KEY=
```

## 📜 License

This project is released under the MIT License. See the `LICENSE` file for more details.

---

This project was created as a portfolio piece to demonstrate skills in frontend development and working with external APIs.
