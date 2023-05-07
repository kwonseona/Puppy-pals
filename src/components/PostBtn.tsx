import React, { useState } from "react"
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Link,
  useNavigate,
} from "react-router-dom"
import styles from "../styles/PostBtn.module.css"

export default function PostBtn() {
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen)
  }

  const closePopup = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).className.includes(styles.overlay)) {
      setIsPopupOpen(false)
    }
  }

  return (
    <>
      <div className={styles.postBtn}>
        <button onClick={togglePopup}>
          <svg
            width="60"
            height="60"
            viewBox="0 0 60 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_1_627)">
              <path
                d="M11.25 30C14.7018 30 17.5 27.2018 17.5 23.75C17.5 20.2982 14.7018 17.5 11.25 17.5C7.79822 17.5 5 20.2982 5 23.75C5 27.2018 7.79822 30 11.25 30Z"
                fill="white"
              />
              <path
                d="M22.5 20C25.9518 20 28.75 17.2018 28.75 13.75C28.75 10.2982 25.9518 7.5 22.5 7.5C19.0482 7.5 16.25 10.2982 16.25 13.75C16.25 17.2018 19.0482 20 22.5 20Z"
                fill="white"
              />
              <path
                d="M37.5 20C40.9518 20 43.75 17.2018 43.75 13.75C43.75 10.2982 40.9518 7.5 37.5 7.5C34.0482 7.5 31.25 10.2982 31.25 13.75C31.25 17.2018 34.0482 20 37.5 20Z"
                fill="white"
              />
              <path
                d="M48.75 30C52.2018 30 55 27.2018 55 23.75C55 20.2982 52.2018 17.5 48.75 17.5C45.2982 17.5 42.5 20.2982 42.5 23.75C42.5 27.2018 45.2982 30 48.75 30Z"
                fill="white"
              />
              <path
                d="M43.35 37.15C41.175 34.6 39.35 32.425 37.15 29.875C36 28.525 34.525 27.175 32.775 26.575C32.5 26.475 32.225 26.4 31.95 26.35C31.325 26.25 30.65 26.25 30 26.25C29.35 26.25 28.675 26.25 28.025 26.375C27.75 26.425 27.475 26.5 27.2 26.6C25.45 27.2 24 28.55 22.825 29.9C20.65 32.45 18.825 34.625 16.625 37.175C13.35 40.45 9.32499 44.075 10.075 49.15C10.8 51.7 12.625 54.225 15.9 54.95C17.725 55.325 23.55 53.85 29.75 53.85H30.2C36.4 53.85 42.225 55.3 44.05 54.95C47.325 54.225 49.15 51.675 49.875 49.15C50.65 44.05 46.625 40.425 43.35 37.15Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0_1_627">
                <rect width="60" height="60" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </button>
      </div>
      <div
        className={`${styles.overlay} ${isPopupOpen ? styles.show : ""}`}
        onClick={closePopup}
      >
        <div className={`${styles.popup} ${isPopupOpen ? styles.show : ""}`}>
          <div className={styles.container}>
            <Link to="/CreatePost" onClick={togglePopup}>
              <div className={styles.coummunity}>
                <span>커뮤니티 글 작성</span>
                <p>자유롭게 소통해보세요.</p>
              </div>
            </Link>
            <div className={styles.line}></div>
            <Link to="/CreateQnA" onClick={togglePopup}>
              <div className={styles.qna}>
                <span>QnA 글 작성</span>
                <p>궁금한 점을 여러 사람에게 물어보고 답변을 받아보세요.</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
