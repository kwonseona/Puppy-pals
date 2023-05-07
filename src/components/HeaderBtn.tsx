import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import styles from "../styles/HeaderBtn.module.css"

export default function HeaderBtn() {
  const [user, setUser] = useState<firebase.User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user)
      setLoading(false)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <div className={styles.btn}>
      {loading ? (
        <div className={styles.spinner}></div>
      ) : user ? (
        <Link to="/MyPage">
          <button>마이페이지</button>
        </Link>
      ) : (
        <Link to="/Login">
          <button>로그인</button>
        </Link>
      )}
    </div>
  )
}
