import styles from "../styles/Join.module.css"
import React, { useState, FormEvent } from "react"
import { firebase } from "../components/firebaseConfig"
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Link,
} from "react-router-dom"
import backgroundVideo from "../assets/강아지 배경.mp4"
import { HiMail, HiKey } from "react-icons/hi"
import { GiSittingDog } from "react-icons/gi"
import { BsFillCalendarDateFill } from "react-icons/bs"

export default function Join() {
  const [showPopup, setShowPopup] = useState(false)
  const [joinPopup, setJoinPopup] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [petName, setPetName] = useState("")
  const [birthday, setBirthday] = useState("")
  const [petBirthday, setPetBirthday] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const closePopup = (e: React.MouseEvent<HTMLElement>) => {
    if (e.target === e.currentTarget) {
      setShowPopup(false)
      setJoinPopup(false)
    }
  }

  async function getPetBirthday(userId: string) {
    try {
      const db = firebase.firestore()
      const birthdayRef = db.collection("birthday").doc(userId)
      const doc = await birthdayRef.get()
      if (doc.exists) {
        setPetBirthday(doc.data()?.birthday)
      } else {
        console.log("No such document!")
      }
    } catch (error) {
      console.error("Error getting pet birthday:", error)
    }
  }

  async function signUp(email: string, password: string): Promise<boolean> {
    if (password.length < 6) {
      alert("비밀번호는 최소 6자 이상이어야 합니다.")
      return false
    }

    try {
      const userCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
      const user = userCredential.user

      if (user) {
        getPetBirthday(user.uid)

        const db = firebase.firestore()
        const userRef = db.collection("users").doc(user.uid)
        await userRef.set({ nickname: user.uid })

        console.log("강아지 정보 저장 완료", petName)
        const petRef = db.collection("pets").doc(user.uid)
        await petRef.set({
          name: petName,
          birthday: birthday,
        })
      }

      console.log("로그인 성공", user)
      return true
    } catch (error) {
      console.error("로그인 실패", error)
      return false
    }
  }

  async function checkEmail(email: string) {
    if (email === "") {
      alert("이메일을 입력하세요.")
      return
    }
    try {
      const result = await firebase.auth().fetchSignInMethodsForEmail(email)
      if (result.length > 0) {
        alert("이미 사용중인 이메일입니다.")
      } else {
        setShowPopup(true)
      }
    } catch (error) {
      console.error("이메일 에러", error)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.")
      return
    }
    const isSignedUp = await signUp(email, password)
    if (isSignedUp) {
      setJoinPopup(true)
    }
  }

  const handleSignUpClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!email || !password || !confirmPassword || !petName) {
      alert("모든 입력란을 채워주세요.")
      return
    }
    const isSignedUp = await signUp(email, password)
    if (isSignedUp) {
      setJoinPopup(true)
    }
  }

  return (
    <>
      <div className={styles.container}>
        <video muted autoPlay loop>
          <source src={backgroundVideo} type="video/mp4" />
        </video>
        <div className={styles.loginContainer}>
          <h1>반려인</h1>
          <form className={styles.formContainer} onSubmit={handleSubmit}>
            <div className={styles.inputWrapper}>
              <HiMail className={styles.icon} size={24} />
              <input
                className={styles.input}
                type="email"
                placeholder="이메일을 입력하세요."
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <button
                className={styles.smallbtn}
                onClick={(e) => {
                  e.preventDefault()
                  checkEmail(email)
                }}
              >
                중복체크
              </button>
            </div>
            <div className={styles.inputWrapper}>
              <HiKey className={styles.icon} size={24} />
              <input
                className={styles.input}
                type="password"
                placeholder="비밀번호를 입력하세요."
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <div className={styles.inputWrapper}>
              <HiKey className={styles.icon} size={24} />
              <input
                className={styles.input}
                type="password"
                placeholder="비밀번호를 한번 더 입력하세요."
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </div>
            <h1 className={styles.pet}>반려동물</h1>
            <div className={styles.inputWrapper}>
              <GiSittingDog className={styles.icon} size={24} />
              <input
                className={styles.input}
                type="text"
                placeholder="반려동물 이름을 입력해주세요."
                value={petName}
                onChange={(event) => setPetName(event.target.value)}
              />
            </div>
            <div className={styles.inputWrapper}>
              <BsFillCalendarDateFill className={styles.icon} size={22} />
              <input
                className={styles.input}
                type="date"
                value={birthday}
                onChange={(event) => setBirthday(event.target.value)}
              />
            </div>
            <div className={styles.btnContainer}>
              <button
                className={styles.btn}
                type="submit"
                onClick={handleSignUpClick}
              >
                회원가입
              </button>
              <Link to="/">
                <button className={styles.btn}>홈으로</button>
              </Link>
            </div>
          </form>
        </div>
        {joinPopup && (
          <div className={styles.popup} onClick={closePopup}>
            <div className={styles.popupContainer}>
              <div className={styles.popupTitle}>
                <span>Puppy Pals 회원이 되신걸 축하드립니다.</span>
                <div className={styles.popupBtn}>
                  <Link to="/MainPage">
                    <button className={styles.btn}>홈으로</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
        {showPopup && (
          <div className={styles.popup}>
            <div className={styles.popupContainer}>
              <div className={styles.popupTitle}>
                <span>사용가능한 이메일 입니다.</span>
                <div className={styles.popupBtn}>
                  <button className={styles.btn} onClick={closePopup}>
                    닫기
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
