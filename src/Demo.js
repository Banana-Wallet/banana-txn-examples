import logo from "./logo.svg";
import "./App.css";
import { Banana, Chains } from "@bananahq/banana-sdk-test";
import { useState, useEffect } from "react";
import StakingArtifact from "./abi/Staking.json";
import ERC20 from "./abi/ERC20.json";
import ERC721 from "./abi/ERC721.json";
import BananaAccountArtifact from "./abi/BananaAccount.json";
import { ethers } from "ethers";
import { useSigner, useConnect } from "wagmi";

function Demo() {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();

  const [bananaInstance, setBananaInstance] = useState();

  const { data: signer } = useSigner();
  console.log("this is signer", signer);

  const paymasterOptions = [
    {
      chainId: "420",
      paymasterUrl: `https://demo-paymaster.internal.candidelabs.com/optimism-goerli/71c6bedc7c3d1c7b4773c70fb972707a`,
    },
    {
      chainId: "80001",
      paymasterUrl: `https://demo-paymaster.internal.candidelabs.com/mumbai/71c6bedc7c3d1c7b4773c70fb972707a`,
    },
    {
      chainId: "42161",
      paymasterUrl: 'https://api.pimlico.io/v1/arbitrum/rpc?apikey=1849c85d-46c8-4bee-8a6d-d6a0cba4d445'
    }
  ];

  useEffect(() => {
    console.log("this is signer updated", signer);
  }, [signer]);

  const createInstanceForMumbai = () => {
    // console.log('this is signer', signer)
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

    const instance = new Banana(Chains.optimism, signer, paymasterOptions);

    setBananaInstance(instance);
  };

  const createInstanceForOptGoerli = () => {
    const instance = new Banana(
      Chains.optimismTestnet,
      signer,
      paymasterOptions
    );
    setBananaInstance(instance);
  };

  const createInstanceForAstar = () => {
    const instance = new Banana(Chains.astar, signer, paymasterOptions);
    setBananaInstance(instance);
  };

  const normalTxn = async () => {
    const stakeAddress = "0x2144601Dc1b6220F34cf3070Ce8aE5F425aA96F1";
    let wallet;
    try {
      wallet = await bananaInstance.connectWallet();
      console.log(wallet.walletAddress);
    } catch (err) {
      console.log("Error", err);
    }
    const signer = wallet.getSigner();

    const tx = {
      gasLimit: "0x55555",
      to: stakeAddress,
      value: ethers.utils.parseEther("0.0000001"),
      data: new ethers.utils.Interface(StakingArtifact.abi).encodeFunctionData(
        "stake",
        []
      ),
    };

    const txn = await signer.sendTransaction(tx);
    console.log("transaction ", txn);
    // const txnResp = await txn.wait();
    // console.log('Hash', txnResp.logs[0].transactionHash)
  };

  const bundleTxn = async () => {
    const stakeAddress = "0x2144601Dc1b6220F34cf3070Ce8aE5F425aA96F1";
    let wallet;
    try {
      wallet = await bananaInstance.connectWallet();
    } catch (err) {
      console.log("Error", err);
    }
    const signer = wallet.getSigner();

    const tx = {
      gasLimit: "0x55555",
      to: stakeAddress,
      value: ethers.utils.parseEther("0.0000001"),
      data: new ethers.utils.Interface(StakingArtifact.abi).encodeFunctionData(
        "stake",
        []
      ),
    };

    const txn = await signer.sendBatchTransaction([tx, tx]);
    console.log("transaction ", txn);
  };

  const erc721Transfer = async () => {
    const walletInstance = await bananaInstance.connectWallet();
    const signer = walletInstance.getSigner();
    const bananaERCTokenAddress = "0x4e191815bbD8031955fe355C450eeB629451FfDf";
    console.log("minting tokens ");

    const walletAddress = await walletInstance.getAddress();
    let bananContract = new ethers.Contract(
      bananaERCTokenAddress,
      ERC721,
      signer
    );

    const transferFromCallData = bananContract.interface.encodeFunctionData(
      "transferFrom",
      [walletAddress, "0xA8458B544c551Af2ADE164C427a8A4F13A346F2A", "0"] // update tokenId here
    );

    const tx1 = {
      gasLimit: "0x55555",
      to: bananaERCTokenAddress,
      value: 0,
      data: transferFromCallData,
    };

    let txn = await signer.sendTransaction(tx1);
    console.log(txn);
  };

  const mintERC721 = async () => {
    const walletInstance = await bananaInstance.connectWallet();
    const signer = walletInstance.getSigner();
    const bananaERCTokenAddress = "0x4e191815bbD8031955fe355C450eeB629451FfDf";
    const walletAddress = await walletInstance.getAddress();
    let bananContract = new ethers.Contract(
      bananaERCTokenAddress,
      ERC721,
      signer
    );

    const transferCallData = bananContract.interface.encodeFunctionData(
      "safeMint",
      [walletAddress]
    );

    const tx1 = {
      gasLimit: "0x55555",
      to: bananaERCTokenAddress,
      value: 0,
      data: transferCallData,
    };

    let txn = await signer.sendTransaction(tx1);
    console.log(txn);
  };

  const nativeTransfer = async () => {
    const walletInstance = await bananaInstance.connectWallet();
    const signer = walletInstance.getSigner();
    const tx1 = {
      gasLimit: "0x55555",
      to: "0xF9ca16Fb8D6F38d36505961dAd69d2011C4695cF",
      value: ethers.utils.parseEther("0.0001"),
      data: "0x",
    };

    let txn = await signer.sendTransaction(tx1);
    console.log(txn);
  };

  const transferErc20 = async () => {
    const walletInstance = await bananaInstance.connectWallet();
    const signer = walletInstance.getSigner();
    const bananaAddress = "0x3c75e43725a1EE466984E0A7c9C06A3F20757210"; //mumbai

    let bananContract = new ethers.Contract(bananaAddress, ERC20, signer);

    const transferCallData = bananContract.interface.encodeFunctionData(
      "transfer",
      [
        "0xF9ca16Fb8D6F38d36505961dAd69d2011C4695cF",
        ethers.utils.parseEther("100"),
      ]
    );

    try {
      const tx1 = {
        gasLimit: "0x55555",
        to: bananaAddress,
        value: 0,
        data: transferCallData,
      };

      let txn = await signer.sendTransaction(tx1);
      console.log(txn);
    } catch (err) {
      console.log(err);
    }
  };

  const mintERC20 = async () => {
    const walletInstance = await bananaInstance.connectWallet();
    const signer = walletInstance.getSigner();

    const bananaAddress = "0x3c75e43725a1EE466984E0A7c9C06A3F20757210"; //mumbai

    const walletAddress = await walletInstance.getAddress();
    let bananContract = new ethers.Contract(bananaAddress, ERC20, signer);

    const mintingCallData = bananContract.interface.encodeFunctionData("mint", [
      walletAddress,
      ethers.utils.parseEther("1000000"),
    ]);

    try {
      const tx1 = {
        gasLimit: "0x55555",
        to: bananaAddress,
        value: 0,
        data: mintingCallData,
      };

      let txn = await signer.sendTransaction(tx1);

      console.log(txn);
    } catch (err) {
      console.log(err);
    }
  };

  const withdrawNative = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const activeEoa = await provider.getSigner().getAddress();
    const walletInstance = await bananaInstance.connectWallet();

    const txn = {
      to: walletInstance.walletAddress,
      data: new ethers.utils.Interface(
        BananaAccountArtifact.abi
      ).encodeFunctionData("transfer", [
        activeEoa,
        ethers.utils.parseEther("0.0000001"),
      ]),
      gasLimit: "0x55555",
      value: 0,
    };

    const wallet = new ethers.Wallet(
      process.env.REACT_APP_OWNER_KEY,
      new ethers.providers.JsonRpcProvider(
        "https://polygon-mumbai.g.alchemy.com/v2/cNkdRWeB8oylSQJSA2V3Xev2PYh5YGr4"
      )
    );

    let txnResp = await wallet.sendTransaction(txn);
    console.log("txn resp", txnResp);
  };

  const withdrawErc20 = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const activeEoa = await provider.getSigner().getAddress();
    const walletInstance = await bananaInstance.connectWallet();
    const erc20Address = "0x3c75e43725a1EE466984E0A7c9C06A3F20757210";

    const txn = {
      to: walletInstance.walletAddress,
      data: new ethers.utils.Interface(
        BananaAccountArtifact.abi
      ).encodeFunctionData("pullTokens", [
        erc20Address, // token address to withdraw
        activeEoa, // address where to withdraw
        ethers.utils.parseEther("1000"),
      ]),
      gasLimit: "0x55555",
      value: 0,
    };

    const wallet = new ethers.Wallet(
      process.env.REACT_APP_OWNER_KEY,
      new ethers.providers.JsonRpcProvider(
        "https://polygon-mumbai.g.alchemy.com/v2/cNkdRWeB8oylSQJSA2V3Xev2PYh5YGr4"
      )
    );

    let txnResp = await wallet.sendTransaction(txn); // sending transction from wallet itself
    console.log("Txn resp", txnResp);
  };

  return (
    <div className="App">
      <div>
        {connectors.map((connector) => (
          <button
            disabled={!connector.ready}
            key={connector.id}
            onClick={() => connect({ connector })}
          >
            {connector.name}
            {!connector.ready && " (unsupported)"}
            {isLoading &&
              connector.id === pendingConnector?.id &&
              " (connecting)"}
          </button>
        ))}

        {error && <div>{error.message}</div>}
      </div>
      <button onClick={() => createInstanceForMumbai()}>Mumbai</button>
      <button onClick={() => createInstanceForOptGoerli()}>Opt Goerli</button>
      <button onClick={() => createInstanceForAstar()}>Astar</button>
      <button onClick={() => normalTxn()}> Make txn </button>
      <button onClick={() => bundleTxn()}> Bundle txn </button>
      <button onClick={() => mintERC20()}> Mint erc20 </button>
      <button onClick={() => transferErc20()}> transfer erc20 </button>
      <button onClick={() => mintERC721()}> Mint ERC721 </button>
      <button onClick={() => erc721Transfer()}> Transfer ERC721 </button>
      <button onClick={() => nativeTransfer()}> Native Transfer </button>
      <button onClick={() => withdrawNative()}>Native Token Withdraw</button>
      <button onClick={() => withdrawErc20()}>Withdraw ERC20 Token</button>
    </div>
  );
}

export default Demo;
