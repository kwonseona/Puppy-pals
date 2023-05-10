import { useState } from "react"
import styles from "../styles/Hamburger.module.css"
import { Link } from "react-router-dom"
import { ImMenu } from "react-icons/im"
import Nav from "./Nav"

const Hamburger = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <div className={styles.hamburger} onClick={toggleMenu}>
        <ImMenu size={24} />
      </div>
      {isOpen && (
        <div className={styles.hamburgerMenu}>
          <button className={styles.close} onClick={toggleMenu}>
            닫기
          </button>
          <Link to="/MyPage">마이페이지</Link>
          <Nav />
        </div>
      )}
    </>
  )
}

export default Hamburger
