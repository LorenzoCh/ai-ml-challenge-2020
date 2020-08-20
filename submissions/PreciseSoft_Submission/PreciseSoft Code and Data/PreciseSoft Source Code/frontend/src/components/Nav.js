import React from "react";
import { Link, NavLink } from "react-router-dom";

const Nav = () => {
  return (
    <nav className="nav-wrapper black darken-1">
      <div className="">
        <Link className="brand-logo center" to="/">
          GSA ML/AI Challenge 2020
        </Link>
      </div>
    </nav>
  );
};

export default Nav;
