import React from "react";
import cancelBtn from "../img/close popup.svg";
import auditedLogo from "../img/audited.svg";
import poweredByLogo from "../img/powered by xp.svg";
import bscIcon from "../img/BSC.svg";
import copyIcon from "../img/copy/default.svg";

export default function Report() {
  return (
    <>
      <div className="flexColumn">
        <div className="transferBox">
          <div className="wraper">
            <div className="connectWalletRow" style={{ margin: "0px" }}>
              <label className="connectWalletLabel selfCenter">
                Bridging Report
              </label>
              <button className="navBtn" style={{ margin: "0px" }}>
                <img src={cancelBtn} />
              </button>
            </div>

            <div className="flexColumn center" style={{ gap: "2px" }}>
              <img src={bscIcon} className="blockchainImg" />
              <label className="recievingAmountLabel">
                15,000 <span className="confirmTextLabel">&nbsp;XPNET</span>
              </label>
              <label
                className="xpnetValueDollar center"
                style={{ justifyContent: "center" }}
              >
                $0.078
              </label>
            </div>
            <div className="flexColumn">
              <div className="greyBox">
                <label className="accountAddressLabel">
                  1e10991a2f9d6ff36a5872bcd67d43aa9...4d72
                </label>
                <img src={copyIcon} />
              </div>
              <label className="line" />
              <div className="flexRow">
                <label className="confirmTitle">Departure Address</label>
                <div className="greyBox">
                  <label className="accountAddressLabel">0x9es455</label>
                  <img src={copyIcon} />
                </div>
              </div>
              <label className="line" />
              <div className="flexRow">
                <label className="confirmTitle">XP bridge Fee</label>
                <label>0 XPNET</label>
              </div>
            </div>
            <button className="connectYourWalletBtn">Bridge explorer</button>
          </div>
        </div>
        <div className="footerlogos">
          <img src={poweredByLogo} />
          <img src={auditedLogo} style={{ marginLeft: "20px" }} />
        </div>
        {/* <AddressError/> */}
      </div>
    </>
  );
}
