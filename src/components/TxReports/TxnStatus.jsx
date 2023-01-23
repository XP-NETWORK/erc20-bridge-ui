import React from "react";
import failed from "./../../img/icon/failed.svg";
import successIcon from "./../../img/success.svg";

export default function TxnStatus({ hash }) {
    return (
        <>
            <div className="flexRow mobileColumn">
                <label className="confirmTitle">Tx Status</label>
                {hash ? (
                    <div className="status greyBoxMobileConfirmation">
                        <div className="status__container">
                            <img src={successIcon} alt="#" />
                        </div>
                        <div>Success</div>
                    </div>
                ) : (
                    <div className="status--failed greyBoxMobileConfirmation">
                        <div className="status__container">
                            <img src={failed} alt="#" />
                        </div>
                        <div>Failed</div>
                    </div>
                )}
            </div>
        </>
    );
}
