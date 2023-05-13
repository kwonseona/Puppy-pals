import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import styles from "../styles/Header.module.css"
import Nav from "./Nav"
import HeaderBtn from "./HeaderBtn"
import { ImMenu } from "react-icons/im"
import { IoMdClose } from "react-icons/io"
import { useState, useEffect } from "react"
import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/firestore"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<firebase.User | null>(null)

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setCurrentUser(user)
    })

    return () => unsubscribe()
  }, [])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleLogout = async () => {
    await firebase.auth().signOut()
  }

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Link to="/MainPage">
          <img src="../src/assets/Puppy Pals.png" />
        </Link>
      </div>
      <div className={styles.navDesktop}>
        <Nav toggleMenu={toggleMenu} />
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
          {currentUser ? (
            <Link to="/MainPage" onClick={handleLogout}>
              <button className={styles.btn}>로그아웃</button>
            </Link>
          ) : (
            <Link to="/" onClick={toggleMenu}>
              <button className={styles.btn}>로그인</button>
            </Link>
          )}
          {currentUser ? (
            <Link to="/MyPage" onClick={toggleMenu}>
              <button className={styles.btn}>마이페이지</button>
            </Link>
          ) : (
            <Link to="/Join" onClick={toggleMenu}>
              <button className={styles.btn}>회원가입</button>
            </Link>
          )}
        </div>
        <Nav toggleMenu={toggleMenu} />
      </div>
      <HeaderBtn />
    </div>
  )
}
