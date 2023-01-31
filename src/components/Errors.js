import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AmountError from "./errors/AmountError";
import AmountZeroError from "./errors/AmountZeroError";
import AddressError from "./errors/AddressError";
import WrongAddressError from "./errors/WrongAddressError";

import { setError } from "../store/errorsSlice";
import { verifyAddress } from "./helpers";

const Errors = ({ balance }) => {
    const dispatch = useDispatch();
    const [addressErr, setAddressErr] = useState(false);
    const [showAmountErr, setAmountErr] = useState(false);

    const {
        amountError,
        wrongAddressError,
        showAddressPasted,
        amountZero,
        transaction,
    } = useSelector(({ errors, account }) => ({
        amountError: errors.amountError,
        wrongAddressError: errors.wrongAddressError,
        insufficient: errors.insufficient,
        showAddressPasted: errors.showAddressPasted,
        amountZero: errors.amountZero,
        transaction: account.transactionDetails,
    }));

    const { xpnetAmount, destinationAddress, toChain } = transaction;

    const handleAmountZeroError = (isShow) => {
        if (parseFloat(xpnetAmount) > 0)
            dispatch(
                setError({
                    key: "amountError",
                    value: isShow,
                })
            );
    };

    const handleAddressError = (isShow) => {
        if (destinationAddress)
            dispatch(
                setError({
                    key: "showAddressPasted",
                    value: isShow,
                })
            ); //setShowAddressPasted(isShow);
    };

    const handleWrongAddressError = (isShow) => {
        if (verifyAddress(destinationAddress, toChain) || !destinationAddress)
            dispatch(
                setError({
                    key: "showAddressPasted",
                    value: isShow,
                })
            ); //setWrongAddressError(isShow);
    };

    const handleAmountError = (isShow) => {
        if (parseFloat(xpnetAmount) <= balance)
            dispatch(
                setError({
                    key: "amountError",
                    value: isShow,
                })
            );
    };

    // useEffect(() => {
    //     setAmountErr(!showAmountErr);
    // }, [amountError]);

    return (
        <div className="notifsBlock">
            {amountZero && (
                <AmountZeroError
                    handleAmountZeroError={handleAmountZeroError}
                />
            )}
            {showAddressPasted && (
                <AddressError showAddressError={handleAddressError} />
            )}
            {amountError && <AmountError showAmountError={handleAmountError} />}
            {wrongAddressError && (
                <WrongAddressError
                    showWrongAddressError={handleWrongAddressError}
                />
            )}
        </div>
    );
};

export default Errors;
