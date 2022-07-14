import React, { useState } from "react";
import secureIcon from "../img/secure tx.svg";
import auditedLogo from "../img/audited.svg";
import poweredByLogo from "../img/powered by xp.svg";
import backIcon from "../img/icon back.svg";
import editIcon from "../img/edit/default.svg";
import copyIcon from "../img/copy/default.svg";
import bscIcon from "../img/BSC.svg";
import algorandIcon from "../img/Algorand.svg";
import ToggleButton from "react-toggle-button";

export default function Confirmation() {
  const [approveTransaction, setApproveTransaction] = useState(false);

  const handleChangeApprove = (e) => {
    setApproveTransaction(e.checked);
  };
  return (
    <>
      <div className="flexColumn">
        <div className="transferBox">
          <div className="wraperConfirm">
            <div
              className="connectWalletRow"
              style={{ justifyContent: "flex-start" }}
            >
              <label className="connectWalletLabel selfCenter">
                Bridging confirmation
              </label>
              <button className="navBtn" style={{ margin: "0px" }}>
                <img src={backIcon}></img>
              </button>
            </div>

            <div className="flexColumn">
              <div className="flexColumn" style={{gap:"2px"}}>
                <div className="flexRow">
                  <label className="confirmTitle">Receiving</label>
                  <label className="recievingAmountLabel">
                    15,000 <span className="confirmTextLabel">&nbsp;XPNET</span>
                  </label>
                </div>
                <label className="xpnetValueDollar">$0.078</label>
              </div>
              <label className="line"></label>
              <div className="flexRow">
                <label className="confirmTitle">Sending amount</label>
                <div className="greyBox">
                  15.000
                  <label style={{ color: "#62718A" }}>XPNET</label>
                  <img src={editIcon} />
                </div>
              </div>
              <div className="flexRow">
                <label className="confirmTitle">Destination address</label>
                <div className="greyBox">
                  <label className="accountAddressLabel">0x9es455</label>
                  <img src={copyIcon} />
                </div>
              </div>
              <div className="flexRow">
                <label className="confirmTitle">Destination chain</label>
                <div>
                  <label className="icontext">
                    <img src={algorandIcon} />
                    Algorand
                  </label>
                </div>
              </div>
              <div className="flexRow">
                <label className="confirmTitle">Departure chain</label>
                <div>
                  <label className="icontext">
                    <img src={bscIcon} />
                    BSC
                  </label>
                </div>
              </div>
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
              <div className="flexRow">
                <label className="confirmTitle">Approve transaction</label>
                <ToggleButton
                  className="togglebtn"
                  inactiveLabel={""}
                  activeLabel={""}
                  thumbStyle={{ height: "24px", width: "24px" }}
                  trackStyle={{ height: "24px" }}
                  colors={{
                    activeThumb: {
                      base: "rgb(253, 253, 253, 1)",
                    },
                    inactiveThumb: {
                      base: "rgb(253, 253, 253, 1)",
                    },
                    active: {
                      base: "rgba(57, 95, 235, 1)",
                      hover: "rgba(57, 95, 235, 1)",
                    },
                    inactive: {
                      base: "rgba(212, 215, 221, 1)",
                      hover: "rgba(212, 215, 221, 1)",
                    },
                  }}
                  value={approveTransaction}
                  onToggle={(value) => {
                    setApproveTransaction(!approveTransaction);
                  }}
                />
                {/* <Switch onChange={this.handleChangeApprove} checked={approveTransaction} /> */}
              </div>
            </div>

            <button className="connectYourWalletBtn">Send</button>
            <div className="secureLabel">
              <img src={secureIcon} />
              <label>Secure transaction</label>
            </div>
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
