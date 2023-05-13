import React, { useState } from "react"
import { Link } from "react-router-dom"
import styles from "../styles/Nav.module.css"

interface NavProp {
  toggleMenu: () => void
}

const Nav = ({ toggleMenu }: NavProp) => {
  return (
    <ul className={styles.nav}>
      <li>
        <Link to="/MainPage" onClick={toggleMenu}>
          홈
        </Link>
      </li>
      <li>
        <Link to="/Community" onClick={toggleMenu}>
          커뮤니티
        </Link>
      </li>
      <li>
        <Link to="/QnA" onClick={toggleMenu}>
          QnA
        </Link>
      </li>
    </ul>
  )
}

export default Nav
