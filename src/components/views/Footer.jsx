import React from "react";
import { ReactComponent as Reddit } from "../../img/footer/redit.svg";
import { ReactComponent as Telegram } from "../../img/footer/telegram.svg";
import { ReactComponent as Twitter } from "../../img/footer/twitter.svg";
import { ReactComponent as Linkedin } from "../../img/footer/linkedin.svg";
import xpsince from "./../../../src/img/XP-NETWORK.svg";

import "./Footer.css";

export const BotFooter = () => {
    const year = new Date().getFullYear();

    return (
        <footer id="footer">
            <div className="footContainer">
                <div className="footLeft">
                    <ul className="socialLInks">
                        <li className="socliLink">
                            <a
                                rel="noreferrer"
                                href="https://www.linkedin.com/company/xpnetwork/mycompany/"
                                target="_blank"
                            >
                                <Linkedin
                                    className="svgWidget"
                                    alt="linkedin"
                                />
                            </a>
                        </li>
                        <li className="socliLink">
                            <a
                                rel="noreferrer"
                                href="https://t.me/xp_network"
                                target="_blank"
                            >
                                <Telegram
                                    className="svgWidget"
                                    alt="telegram"
                                />
                            </a>
                        </li>
                        <li className="socliLink">
                            <a
                                href="https://twitter.com/xpnetwork_"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Twitter className="svgWidget" alt="twitter" />
                            </a>
                        </li>
                        <li className="socliLink">
                            <a
                                href="https://www.reddit.com/user/XP_network/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Reddit className="svgWidget" alt="reddit" />
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="footer-links__container">
                    <span>
                        <a
                            href="bridge.xp.network"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Multi-chain NFT Bridge
                        </a>
                    </span>
                    <span>
                        <a
                            href="https://explorer.xp.network/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Explorer
                        </a>
                    </span>
                    <span>
                        <a
                            href="https://docs.xp.network/docs/Multibridge2.0/faq/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            FAQ
                        </a>
                    </span>
                </div>
                <div className="footRight">
                    <div className="xp-since__container">
                        <span>
                            <img src={xpsince} />
                        </span>
                        <span> &copy; {year}</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};
