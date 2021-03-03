import { useState, useEffect } from "react";
import styles from "./Header.module.css";
import { slide as Menu } from 'react-burger-menu'
import { Switch, Route, Redirect, NavLink, useHistory } from "react-router-dom";

const Header = () => {


  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Menu outerContainerId={"outer-container"} pageWrapId={"page-wrap"} >
          <a className="menu-item" href="/menu">
            Menu
      </a>
          <a className="menu-item" href="/settings">
            Settings
      </a>
          <a className="menu-item" href="/statistics">
          Statistics
      </a>
        </Menu>
        <h1>Checkers</h1>
      </div>
    </div>
  );
};

export default Header;
