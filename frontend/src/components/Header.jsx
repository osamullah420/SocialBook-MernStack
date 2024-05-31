import React, { useState, useEffect, useContext } from "react";
import Profile from "./Profile";
import { useAuth } from "../context/AuthProvider";
import { ThemeContext } from "../context/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";

const Header = () => {
  const [auth] = useAuth();
  const [isStickey, setStickey] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setStickey(offset > 0);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className="max-w-screen-2xl container mx-auto fixed top-0 left-0 right-0 transition-all duration-300 ease-in-out">
      <div
        className={`navbar xl:px-15 ${
          isStickey
            ? "shadow-md bg-base-100 transition-all duration-300 ease-in-out"
            : ""
        }`}
      >
        <div className="flex-1 items-center">
          <a className="btn btn-ghost text-[#0866ff] font-bold text-4xl">
            SocialBook
          </a>
          <button
            className="theme-toggle-button px-4 mt-2"
            onClick={toggleTheme}
            style={{ display: "flex", alignItems: "center" }}
          >
            {theme === "light" ? <FaMoon /> : <FaSun />}
          </button>
        </div>
        {auth?.user && <Profile />}
      </div>
    </header>
  );
};

export default Header;
