import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import styles from "../styles/Header.module.css"
import Nav from "./Nav"
import HeaderBtn from "./HeaderBtn"
import { ImMenu } from "react-icons/im"
import { IoMdClose } from "react-icons/io"
import { useState } from "react"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Link to="/MainPage">
          <img src="../src/assets/Puppy Pals.png" />
        </Link>
      </div>
      <div className={styles.navDesktop}>
        <Nav />
      </div>
      {isOpen == false && (
        <div className={styles.hamburger} onClick={toggleMenu}>
          <ImMenu size={24} />
        </div>
      )}
      <div
        className={`${styles.hamburgerMenu} ${styles.navMobile} ${
          isOpen ? styles.slideIn : styles.slideOut
        }`}
      >
        <div className={styles.top}>
          <Link to="/MainPage">
            <img src="../src/assets/Puppy Pals.png" />
          </Link>
          <button className={styles.close} onClick={toggleMenu}>
            <IoMdClose size={50} />
          </button>
        </div>
        <div className={styles.user}>
          <Link to="/" onClick={toggleMenu}>
            <button className={styles.btn}>로그인</button>
          </Link>
          <Link to="/MyPage" onClick={toggleMenu}>
            <button className={styles.btn}>마이페이지</button>
          </Link>
        </div>
        <Nav />
      </div>
      <HeaderBtn />
    </div>
  )
}
