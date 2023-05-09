import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import styles from "../styles/Header.module.css"
import Nav from "./Nav"
import HeaderBtn from "./HeaderBtn"
import Hamburger from "./Hamburger"

export default function Header() {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Link to="/MainPage">
          <img src="src/assets/Puppy Pals.png" />
        </Link>
      </div>
      <Nav />
      <HeaderBtn />
      <Hamburger />
    </div>
  )
}
