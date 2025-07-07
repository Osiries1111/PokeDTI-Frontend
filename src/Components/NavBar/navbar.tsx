import "./navbar.css";
import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import {
  logo,
  maskPiplup,
  maskTurtwig,
  maskPikachu,
  maskChimchar,
  crown,
} from "../../assets/navbar";

import { star } from "../../assets/others-sprites";

import AuthContext from "../../auth/AuthContext";

type NavBarProps = {
  openLoginModal: () => void;
};

export default function NavBar({ openLoginModal }: NavBarProps) {
  const [showGameBtn, setShowGameBtn] = useState<boolean>(false);

  // Obtener el token del contexto de autenticación

  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error(
      "AuthContext is undefined. Make sure NavBar is wrapped in AuthProvider."
    );
  }
  const { token, currentUser } = auth;

  // Ocultar boton game si no hay token

  useEffect(() => {
    if (token) {
      setShowGameBtn(true);
    } else {
      setShowGameBtn(false);
    }
  }, [token]);

  const dashBoardButton = () => (
    <Link to="/admin" className="navbar__button btn--blue">
      <img src={star} alt="star icon" />
      <p>DASHBOARD</p>
    </Link>
  );

  const gameButton = () => (
    <Link to="/game" className="navbar__button btn--blue">
      <img src={maskChimchar} alt="Chimchar icon" />
      <p>GAME</p>
    </Link>
  );

  const profileButton = () => (
    <Link to="/profile" className="navbar__button btn--blue">
      <img src={crown} alt="Crown icon" />
      <p>PROFILE</p>
    </Link>
  );

  const loginButton = () => (
    <a className="navbar__button btn--yellow" onClick={openLoginModal}>
      <img src={maskPikachu} alt="Pikachu icon" />
      <p>LOGIN</p>
    </a>
  );

  const logoutButton = () => (
    <Link
      to="/logout"
      className="navbar__button btn--red"
    >
      <img src={maskPikachu} alt="Pikachu icon" />
      <p>SIGN OUT</p>
    </Link>
  );

  const NavLinks = () => (
    <div className={"navbar__links"}>
      {currentUser?.type === "admin" ? dashBoardButton() : null}
      {token ? profileButton() : null}
      <Link to="/rules" className="navbar__button btn--blue">
        <img src={maskPiplup} alt="Piplup icon" />
        <p>RULES</p>
      </Link>

      {showGameBtn ? gameButton() : null}

      <Link to="/about-us" className="navbar__button btn--blue">
        <img src={maskTurtwig} alt="Turtwig icon" />
        <p>ABOUT US</p>
      </Link>
      {token ? logoutButton() : loginButton()}
    </div>
  );

  const MenuToggler = () => (
    <label className="event-wrapper">
      <input type="checkbox" defaultChecked className="event-wrapper-inp" />
      <div className="bar">
        <span className="top bar-list" />
        <span className="middle bar-list" />
        <span className="bottom bar-list" />
      </div>
      <NavLinks />
    </label>
  );

  return (
    <nav>
      <div className="navbar__content">
        <div className="navbar__logo">
          <Link to="/" className="navbar__logo-link">
            <img src={logo} alt="Logo" />
          </Link>
        </div>
        <MenuToggler />
      </div>
    </nav>
  );
}
