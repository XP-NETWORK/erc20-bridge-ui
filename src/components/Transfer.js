import React, { useState } from "react";
import images from "../utils/imges";
import walletIcon from "../img/wallet.svg";
import xpnetIcon from "../img/XPNET.svg";
import bscIcon from "../img/BSC.svg";
import algorandIcon from "../img/Algorand.svg";
import secureIcon from "../img/secure tx.svg";
import auditedLogo from "../img/audited.svg";
import poweredByLogo from "../img/powered by xp.svg";
import AddressError from "./AddressError";

export default function Transfer() {
  const [xpnetTokenAmount, setXpnetTokenAmount] = useState(0.0);
  return (
    <>
      <div className="flexColumn">
        <div className="transferBox">
          <div className="wraper">
            <h1 className="transferBoxTitle">
              Transfer asset between blockchains
            </h1>
            <div className="Divgap">
              <div className="flexRow">
                <label className="amountLabel">Amount</label>
                <label className="flexRow" style={{ width: "136px" }}>
                  <img src={walletIcon} />
                  <label className="xpnetAmount">
                    {xpnetTokenAmount} XPNET
                  </label>
                  <label className="maxLabel">MAX</label>
                </label>
              </div>
              <div className="fieldBox">
                <input
                  className="textXpAmount"
                  type="text"
                  value={xpnetTokenAmount}
                />
                <label className="icontext">
                  <img src={xpnetIcon} />
                  XPNET
                </label>
              </div>
              <div className="flexRow">
                <div className="fieldBox blockchain">
                  <label className="icontext">
                    <img src={bscIcon} />
                    BSC
                  </label>
                </div>
                <div className="fieldBox blockchain">
                  <label className="icontext">
                    <img src={algorandIcon} />
                    Algorand
                  </label>
                </div>
              </div>
              <div className="fieldBox">
                <input
                  className="textDestAddress"
                  type="text"
                  placeholder="Paste destination address"
                />
              </div>
              <div className="flexRow">
                <label className="amountLabel">Fee:</label>
                <label className="amountLabel flexRow">
                  {xpnetTokenAmount} XPNET
                </label>
              </div>
            </div>
            <button className="connectYourWalletBtn">
              Connect your wallet
            </button>
            <div className="secureLabel">
              <img src={secureIcon} />
              <label>Secure transaction</label>
            </div>
          </div>
        </div>
        <div className="footerlogos">
          <img src={poweredByLogo} />
          <img src={auditedLogo} style={{marginLeft:"20px"}}/>
        </div>
        {/* <AddressError/> */}
      </div>
      
    </>
  );
}
