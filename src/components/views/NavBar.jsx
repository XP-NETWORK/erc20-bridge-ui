import Logo from "../../img/nav/newXpLogo.svg";
//import AccountModal from "../components/Modals/AccountModal/AccountModal";
import { Navbar, Nav, Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import "./NavBar.css";
//import { LinkContainer } from "react-router-bootstrap";
import DropdownToggle from "react-bootstrap/esm/DropdownToggle";
import faq from "../../img/nav/faq.svg";
import docs from "../../img/nav/doc_icon.svg";
import github from "../../img/nav/github.svg";
import video from "../../img/nav/vid.svg";
import xpnet from "../../img/nav/xpnet.svg";
import message from "../../img/nav/helper.svg";
import deposits from "../../img/nav/deposites.svg";
import security from "../../img/nav/security.svg";
//import UserConnect from "../components/User/UserConnect";
//import { setSearchNFTList, setShowVideo } from "../store/reducers/generalSlice";
import { ReactComponent as Hamburger } from "../../img/nav/burger.svg";
import { ReactComponent as HamburgerClose } from "../../img/nav/burger_close.svg";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
/*mport {
  cleanSelectedNFTList,
  setReceiver,
} from "../store/reducers/generalSlice";*/
//import { biz } from "../components/values";
//import Network from "./Network";

function NavBar() {
  // const staging = useSelector((state) => state.general.staging);

  //const date = useSelector((state) => state.general.gitLatestCommit);
  const [navMenuOpen, toggleNavMenu] = useState(false);
  const dispatch = useDispatch();
  const loc = useLocation();

  useEffect(() => {}, [loc]);

  return (
    <header id="Header">
      <Navbar expand="lg">
        <Navbar.Brand>
          <img src={Logo} alt="Xp Network" />
          <div>MULTICHAIN BRIDGE</div>
        </Navbar.Brand>

        {/* <UserConnect desktop={true} /> */}

        {navMenuOpen ? (
          <>
            <HamburgerClose
              className="svgWidget hamburgerToggle xmobile_only"
              onClick={() => {
                document
                  .querySelector(".navbar-collapse.collapse")
                  .classList.remove("show");
                toggleNavMenu(false);
              }}
            />{" "}
            <div
              className="navbaroverlay"
              onClick={() => {
                document
                  .querySelector(".navbar-collapse.collapse")
                  .classList.remove("show");
                toggleNavMenu(false);
              }}
            >
              {" "}
            </div>
          </>
        ) : (
          <Hamburger
            className="svgWidget hamburgerToggle xmobile_only"
            onClick={() => {
              document
                .querySelector(".navbar-collapse.collapse")
                .classList.add("show");
              toggleNavMenu(true);
            }}
          />
        )}
        <Navbar.Toggle aria-controls="" className="navbarToggleMoblie" />

        <Navbar.Collapse id="">
          <Nav>
            <a
              rel="noreferrer"
              className="nav-link help-center"
              target="_blank"
              href="https://t.me/XP_NETWORK_Bridge_Support_Bot?start=startwithxpbot"
            >
              <div className="nav-link__icon">
                <img src={message} alt="" />
              </div>
              <div className="nav-link__txt">Help Center</div>
            </a>
            <Nav.Link
              className="mob-link"
              target="_blank"
              href="https://docs.xp.network/docs/Multibridge2.0/faq"
            >
              <div className="nav-link__icon">
                <img src={faq} alt="" />
              </div>
              <div className="nav-link__txt">FAQ</div>
            </Nav.Link>
            <Nav.Link
              className="mob-link"
              target="_blank"
              href="https://docs.xp.network/docs/Multibridge2.0/bridge_security/"
            >
              <div className="nav-link__icon">
                <img src={security} alt="" />
              </div>
              <div className="nav-link__txt">Bridge Security</div>
            </Nav.Link>
            <Nav.Link
              className="mob-link"
              target="_blank"
              href="https://docs.xp.network/"
            >
              <div className="nav-link__icon">
                <img src={docs} alt="" />
              </div>
              <div className="nav-link__txt">DOCS</div>
            </Nav.Link>
            <Nav.Link
              className="mob-link"
              target="_blank"
              href="https://github.com/xp-network/"
            >
              <div className="nav-link__icon">
                <img src={github} alt="" />
              </div>
              <div className="nav-link__txt ">
                <span>GitHub</span>
                {false && (
                  <div className="latest">
                    <div className="latest__spot"></div>
                    <div className="latest__date">{}</div>
                  </div>
                )}
              </div>
            </Nav.Link>
            <Nav.Link className="mob-link" target="_blank" href="#">
              <div className="nav-link__icon">
                <img src={video} alt="" />
              </div>
              <div className="nav-link__txt">Video Tutorial</div>
            </Nav.Link>
            <Nav.Link
              className="mob-link"
              target="_blank"
              href="https://xp.network/"
            >
              <div className="nav-link__icon">
                <img src={xpnet} alt="" />
              </div>
              <div className="nav-link__txt">XP.NETWORK</div>
            </Nav.Link>

            <Dropdown className="navbar-dropdown">
              <DropdownToggle>
                <div className="navbar-dropdown__btn">
                  {navMenuOpen ? (
                    <>
                      <div
                        className="navbaroverlay"
                        onClick={() => toggleNavMenu(false)}
                      ></div>{" "}
                      <HamburgerClose
                        className="svgWidget"
                        alt="burgerClose"
                        onClick={() =>
                          toggleNavMenu(navMenuOpen ? false : true)
                        }
                      />{" "}
                    </>
                  ) : (
                    <Hamburger
                      className="svgWidget"
                      alt="burger"
                      onClick={() => toggleNavMenu(navMenuOpen ? false : true)}
                    />
                  )}
                </div>
              </DropdownToggle>
              <Dropdown.Menu>
                <div onClick={() => toggleNavMenu(false)}>
                  {/* <Dropdown.Item
                                            href="https://bridge-explorer.xp.network/"
                                            target="-blank"
                                        >
                                            <div className="drop-item">
                                                <img src={explorer} alt="" />
                                                <div className="drop-icon">
                                                    Explorer
                                                </div>
                                            </div>
                                        </Dropdown.Item> */}
                  <Dropdown.Item
                    href="https://github.com/xp-network/"
                    target="_blank"
                  >
                    <div className="drop-item">
                      <img src={github} alt="" />
                      <div className="drop-git">
                        <span>GitHub</span>
                        {false && (
                          <div className="latest">
                            <div className="latest__spot"></div>
                            <div className="latest__date">{}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Item
                    href="https://docs.xp.network/docs/Multibridge2.0/bridge_security/"
                    target="_blank"
                  >
                    <div className="drop-item">
                      <img src={security} alt="" />
                      <div className="drop-git">
                        <span>Bridge Security</span>
                      </div>
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Item
                    href="https://docs.xp.network/docs/Multibridge2.0/faq"
                    target="_blank"
                  >
                    <div className="drop-item">
                      <img src={faq} alt="" />
                      <div className="drop-icon">FAQs</div>
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Item
                    href="https://docs.xp.network/"
                    target="_blank"
                  >
                    <div className="drop-item">
                      <img src={docs} alt="" />
                      <div className="drop-icon">DOCs</div>
                    </div>
                  </Dropdown.Item>

                  <Dropdown.Item href="https://xp.network/" target="_blank">
                    <div className="drop-item">
                      <img src={xpnet} alt="" />
                      <div className="drop-icon">XP.NETWORK</div>
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Item
                    href="https://t.me/XP_NETWORK_Bridge_Support_Bot?start=startwithxpbot"
                    target="_blank"
                  >
                    <div className="drop-item">
                      <img src={message} alt="" />
                      <div className="drop-icon">Help Center</div>
                    </div>
                  </Dropdown.Item>
                </div>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
        {/* <AccountModal /> */}
      </Navbar>
    </header>
  );
}

export default NavBar;
