import React from "react"
import { Link } from "react-router-dom"
import styles from "../styles/Nav.module.css"

const Nav = () => {
  return (
    <ul className={styles.nav}>
      <li>
        <Link to="/MainPage">홈</Link>
      </li>
      <li>
        <Link to="/Community">커뮤니티</Link>
      </li>
      <li>
        <Link to="/QnA">QnA</Link>
      </li>
    </ul>
  )
}

export default Nav
