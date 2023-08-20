/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import { useAccount, useSigner, useContract, useProvider } from 'wagmi';

// creating chain specific instance of banana module
export const GetContract = (address, abi) => {
  const { data: signerOrProvider, isError, isLoading } = useSigner()
  let contract = null;
  if(!isError && !isLoading) {
    contract = useContract({
      address, abi, signerOrProvider,
    })
  }
  return contract;
}

export const GetProvider = () => {
  const provider = useProvider();
  return provider;
}

export const GetSigner = () => {
    const {data: signer} = useSigner();
    return signer;
}