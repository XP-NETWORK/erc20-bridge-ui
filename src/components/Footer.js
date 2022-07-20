import React from 'react'
import auditedLogo from "../img/audited.svg";
import poweredByLogo from "../img/powered by xp.svg";

export default function Footer() {
  return (
    <div className="footerlogos">
    <img src={poweredByLogo} className="footerImg"/>
    <img src={auditedLogo} className="footerImg" style={{ marginLeft: "20px" }} />
  </div>
  )
}
