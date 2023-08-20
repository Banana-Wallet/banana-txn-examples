import "./App.css";
import Demo from "./Demo";

import {
  polygonMumbai,
  optimismGoerli,
} from "@wagmi/chains";

import { publicProvider } from "wagmi/providers/public";

import {  WagmiConfig, createClient, configureChains } from "wagmi";

import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

function App() {

  const { chains, provider, webSocketProvider } = configureChains(
    [polygonMumbai, optimismGoerli],
    [
      publicProvider()
    ]
  );

  const client = createClient({
    autoConnect: true,
    connectors: [
      new MetaMaskConnector({ chains }),
      new CoinbaseWalletConnector({
        chains,
        options: {
          appName: "wagmi",
        },
      }),
      new InjectedConnector({
        chains,
        options: {
          name: "Injected",
          shimDisconnect: true,
        },
      }),
    ],
    provider,
    webSocketProvider,
  });
  
  console.log('chains', chains)
  
  return (
    <div className="App">
      <WagmiConfig client={client}>
          <Demo />
      </WagmiConfig>
    </div>
  );
}

export default App;
