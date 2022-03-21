import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-regular-svg-icons";

const Navbar = () => {
  const handleClick = () => {
    document.body.classList.toggle("dark");

    localStorage.setItem("darkMode", document.body.classList.contains("dark"));
  };

  return (
    <nav>
      <div className="dark-mode__toggle">
        <FontAwesomeIcon onClick={handleClick} icon={faSun} size="2x" />
        <FontAwesomeIcon onClick={handleClick} icon={faMoon} size="2x" />
      </div>
    </nav>
  );
};

export default Navbar;
