import { Link } from "react-router-dom";
import logoLight from "../assets/image/shiv.png";
import ProfileDropdown from "../Components/Base/ProfileDropdown";

const Header = ({ headerClass }: any) => {

  const toogleMenuBtn = () => {
    let windowSize = document.documentElement.clientWidth;
    const humberIcon = document.querySelector(".hamburger-icon") as HTMLElement;

    if (windowSize > 767)
        humberIcon.classList.toggle('open');

    //For collapse horizontal menu
    if (document.documentElement.getAttribute('data-layout') === "horizontal") {
        document.body.classList.contains("menu") ? document.body.classList.remove("menu") : document.body.classList.add("menu");
    }
};

  return (
    <header id="page-topbar" className={headerClass}>
      <div className="layout-width">
        <div className="navbar-header">
          <div className="d-flex">
            <div className="navbar-brand-box horizontal-logo">
              <Link to="/" className="logo logo-dark">
                <span className="logo-lg">
                  <img src={logoLight} alt="" height="30" />
                </span>
              </Link>

              <Link to="/" className="logo logo-light">
                <span className="logo-lg">
                  <img src={logoLight} alt="" height="30" />
                </span>
              </Link>
            </div>

            <button
              onClick={toogleMenuBtn}
              type="button"
              className="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger"
              id="topnav-hamburger-icon"
            >
              <span className="hamburger-icon">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
          </div>

          <div className="d-flex align-items-center">
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
