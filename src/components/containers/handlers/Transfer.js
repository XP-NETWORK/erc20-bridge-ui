import React, { useEffect, useState, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";

import { updateTransactionDetails } from "../../../store/accountSlice";
import { setError } from "../../../store/errorsSlice";

import { verifyAddress } from "../../helpers";

import { useNavigate } from "react-router";

export const TransferHandlers = (Next) =>
  function A(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
      amountError,
      wrongAddressError,
      insufficient,
      showAddressPasted,
      amountZero,
    } = useSelector(({ errors }) => ({
      amountError: errors.amountError,
      wrongAddressError: errors.wrongAddressError,
      insufficient: errors.insufficient,
      showAddressPasted: errors.showAddressPasted,
      amountZero: errors.amountZero,
    }));

    const {
      transaction,
      transaction: { destinationAddress, xpnetAmount, toChain, fromChain },
      data: { tokenBalance },
    } = props;

    const handleTokenAmountChange = (e) => {
      const val = e.target.value;

      const dots = val.match(/\./g);

      if (dots && dots.length > 1) {
        return;
      }

      if (!val || /[A-Za-z]/.test(val)) {
        return dispatch(
          updateTransactionDetails({
            ...transaction,
            xpnetAmount: 0,
          })
        );
      }

      if (val.at(-1) === ".") {
        return dispatch(
          updateTransactionDetails({
            ...transaction,
            xpnetAmount: val,
          })
        );
      }

      dispatch(
        setError({
          key: "amountZero",
          value: false,
        })
      );

      return dispatch(
        updateTransactionDetails({
          ...transaction,
          xpnetAmount: parseFloat(val).toString(),
        })
      );
    };

    const handleAddressChanged = (e) => {
      //if (e.target.value !== "") {

      dispatch(
        updateTransactionDetails({
          ...transaction,
          destinationAddress: e.target.value,
        })
      );

      dispatch(
        setError({
          key: "showAddressPasted",
          value: false,
        })
      );
    };

    const handleMaxAmount = () => {
      dispatch(
        updateTransactionDetails({
          ...transaction,
          xpnetAmount: tokenBalance,
        })
      );
    };

    const handleBtnClick = () => {
      if (/*insufficient ||*/ amountError || amountZero || wrongAddressError) {
        return;
      }
      if (destinationAddress === "") {
        dispatch(
          setError({
            key: "showAddressPasted",
            value: true,
          })
        );
      }
      if (Number(xpnetAmount) === 0) {
        dispatch(
          setError({
            key: "amountZero",
            value: true,
          })
        );
      }
      console.log(xpnetAmount, destinationAddress, toChain);
      if (
        Number(xpnetAmount) > 0 &&
        destinationAddress !== "" &&
        verifyAddress(destinationAddress, toChain)
        // &&getNumberType(xpnetTokenAmount) + calculatedFee <= accountBalance
      ) {
        navigate("/BridgingConfirmation");
      }
      // }
    };

    const swapChains = async () => {
      /*  try {
      if (fromChain === ChainInfo[]) {
        const accountsSharedByUser = await connectAlgo();

        if (accountsSharedByUser) {
          dispatch(
            updateTransactionDetails({
              ...transaction,
              fromChain: toChain,
              toChain: fromChain,
            })
          );

          setTimeout(() => {
            deactivate();
            dispatch(connectedAccount(accountsSharedByUser[0].address));
          }, 500);
        }
      } else {
        dispatch(
          updateTransactionDetails({
            ...transaction,
            fromChain: toChain,
            toChain: fromChain,
          })
        );
        await connectMM(activate, InjectedMetaMask);

      }
    } catch (e) {}*/
    };

    const handlers = {
      handleTokenAmountChange,
      handleAddressChanged,
      handleMaxAmount,
      handleBtnClick,
      swapChains,
    };

    const errors = {
      amountError,
      wrongAddressError,
      insufficient,
      showAddressPasted,
      amountZero,
    };

    return <Next {...props} handlers={handlers} errors={errors} />;
  };
