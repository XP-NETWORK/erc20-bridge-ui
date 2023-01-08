import React, { useEffect, useState, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";

import { setError } from "../../../store/errorsSlice";

import { ChainNonce } from "xpjs-erc20";

import { verifyAddress } from "../../helpers";

export const TransferEffects = (Next) =>
  function A(props) {
    const dispatch = useDispatch();

    const {
      transaction,
      transaction: { destinationAddress, xpnetAmount, toChain, fromChain, fee },
      data: { tokenBalance, balance },
    } = props;

    //XPNET amount check
    useEffect(() => {
      xpnetAmount &&
        dispatch(
          setError({
            key: "amountError",
            value: parseFloat(xpnetAmount) > tokenBalance ? true : false,
          })
        );
    }, [xpnetAmount, tokenBalance]);

    //balance check
    useEffect(() => {
      fee &&
        balance &&
        dispatch(
          setError({
            key: "insufficient",
            value: Number(fee) > Number(balance) ? true : false,
          })
        );
    }, [fee, balance]);

    //Address validity check
    useEffect(() => {
      destinationAddress &&
        dispatch(
          setError({
            key: "wrongAddressError",
            value: !verifyAddress(destinationAddress, toChain) ? true : false,
          })
        );
    }, [destinationAddress, fromChain, toChain]);

    return <Next {...props} />;
  };
