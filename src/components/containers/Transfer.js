import React, { useEffect, useState, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";

import { updateTransactionDetails } from "../../store/accountSlice";

import { ChainNonce } from "xpjs-erc20";
import ChainFactory from "../../service/chainFactory";

import { bridge } from "../../erc20/erc20Utils";

//TODO as service
const chains = ChainFactory();

export const TransferContainer = (Next) =>
  function A(props) {
    const dispatch = useDispatch();

    const interval = useRef(null);

    const [balance, setBalance] = useState("");
    const [tokenBalance, seTokenBalance] = useState("");
    const [blury, setBlury] = useState(false);
    const [loadingFees, setLoadingFees] = useState(true);

    const { transaction, account } = useSelector(({ account }) => ({
      account: account.address,
      transaction: account.transactionDetails,
    }));

    const { fromChain, toChain } = transaction;

    const fetchData = async () => {
      const chain = await chains.init(bridge).getChain(ChainNonce[fromChain]);

      const [balance, tokenBalance, tokenParams, fee] = await Promise.all([
        chain.getBalance(account),
        chain.getTokens(account),
        chain.getParams(),
        chain.getFees(ChainNonce[fromChain]),
      ]);

      console.log(balance, "balance");

      console.log(tokenBalance, "tokenBalance");

      setBalance(balance);
      seTokenBalance(tokenBalance);
      dispatch(
        updateTransactionDetails({
          ...transaction,
          tokenSymbol: tokenParams?.symbol,
          fee,
        })
      );
    };

    useEffect(() => {
      (async () => {
        //setBlury(true);
        //setLoadingFees(true);
        await fetchData();
        setBlury(false);
        setLoadingFees(false);
      })();
    }, []);

    useEffect(() => {
      //this triggers premanent updateTransactionDetails -> rerender - fix it
      console.log(account, "account");
      const interval = setInterval(() => fetchData(), 32000);
      return () => clearInterval(interval);
    }, [fromChain, account, toChain]);

    const data = { balance, tokenBalance };
    const loaders = { loadingFees, blury };

    return (
      <Next
        {...props}
        data={data}
        transaction={transaction}
        loaders={loaders}
      />
    );
  };
