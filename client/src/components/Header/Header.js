import { useState, useEffect } from "react";
import styles from "./Header.module.css";
import { slide as Menu } from 'react-burger-menu'
import { Switch, Route, Redirect, NavLink, useHistory } from "react-router-dom";

const Header = () => {


  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Menu outerContainerId={"outer-container"} pageWrapId={"page-wrap"} >
          <NavLink className="menu-item" to="/menu">
            <div>Menu</div>
          </NavLink>
          <NavLink className="menu-item" href="/settings">
            Settings
          </NavLink>
          <NavLink className="menu-item" href="/statistics">
            Statistics
          </NavLink>
        </Menu>
        <h1>Checkers</h1>
      </div>
    </div>
  );
};

export default Header;
