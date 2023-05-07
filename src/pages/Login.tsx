import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Link,
  useNavigate,
} from "react-router-dom"
import { useState, FormEvent } from "react"
import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import styles from "../styles/Login.module.css"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    try {
      await firebase.auth().signInWithEmailAndPassword(email, password)
      alert("로그인 되었습니다.")
      navigate("/")
    } catch (error: any) {
      alert("아이디 혹은 비밀번호를 확인하세요.")
    }
  }

  const handleGoogleSignIn = async () => {
    const provider = new firebase.auth.GoogleAuthProvider()

    try {
      await firebase.auth().signInWithPopup(provider)
      alert("구글 로그인이 성공적으로 되었습니다.")
      navigate("/")
    } catch (error: any) {
      if (error.code === "로그인 실패") {
        alert("로그인에 실패 하였습니다.")
      } else {
        alert(error.message)
      }
    }
  }

  return (
    <>
      <div className={styles.container}>
        로고
        <div className={styles.loginContainer}>
          <form onSubmit={handleSubmit}>
            <input
              className={styles.input}
              type="email"
              placeholder="이메일을 입력하세요."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className={styles.input}
              type="password"
              placeholder="비밀번호를 입력하세요."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className={styles.btnContainer}>
              <button className={styles.btn} type="submit">
                로그인
              </button>
              <Link to="/">
                <button className={styles.btn}>비로그인</button>
              </Link>
            </div>
          </form>
          <label className={styles.google} onClick={handleGoogleSignIn}>
            <img src="src/assets/google_signin_buttons/web/2x/btn_google_signin_light_normal_web@2x.png" />
          </label>
          <Link to="/Join">
            <div className={styles.join}>
              <span className={styles.text}>아직 회원이 아니신가요?</span>
              <span className={styles.joinBtn}>회원가입</span>
            </div>
          </Link>
        </div>
      </div>
    </>
  )
}
