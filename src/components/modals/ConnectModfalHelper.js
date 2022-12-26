import MyAlgoConnect from "@randlabs/myalgo-connect";

export const connectMM = async (activate, acc) => {
    if (!window.ethereum) {
        alert("Install metaMask");
        return;
    }
    try {
        await activate(acc);
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x38" }], // chainId must be in hexadecimal numbers
        });
    } catch (e) {
        throw e;
    }
};

export const connectAlgo = async () => {
    const myAlgoConnect = new MyAlgoConnect({ disableLedgerNano: false });

    const settings = {
        shouldSelectOneAccount: false,
        openManager: true,
    };
    const accountsSharedByUser = await myAlgoConnect
        .connect(settings)
        .catch((e) => {
            throw e;
        });

    return accountsSharedByUser;
};
