import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Link,
  useNavigate,
} from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/storage"
import styles from "../styles/MyPage.module.css"

export default function MyPage() {
  const navigate = useNavigate()
  const [nickname, setNickname] = useState("")
  const [email, setEmail] = useState("")
  const fileInput = useRef<HTMLInputElement | null>(null)
  const [profileImgUrl, setProfileImgUrl] = useState("")
  const defaultProfileImgUrl =
    "https://firebasestorage.googleapis.com/v0/b/puppypals-d5a36.appspot.com/o/petProfilePictures%2FnoImg.png?alt=media&token=a3169fa5-3a36-436b-bafd-642f1174625e"

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (user && user.email) {
        setEmail(user.email)
        await fetchProfilePicture()
        await fetchNickName()
      } else {
        setEmail("")
      }
    })

    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await firebase.auth().signOut()
      alert("로그아웃 되었습니다.")
      navigate("/")
    } catch (error: any) {
      alert("로그아웃 실패: " + error.message)
    }
  }

  const handleProfilePictureUpload = async () => {
    const user = firebase.auth().currentUser
    const storageRef = firebase.storage().ref()

    const file = fileInput.current?.files?.[0] || null

    if (user && file !== null) {
      const profilePictureRef = storageRef.child(`profilePictures/${user.uid}`)

      try {
        await profilePictureRef.put(file)
        const downloadUrl = await profilePictureRef.getDownloadURL()
        setProfileImgUrl(downloadUrl)
        alert("프로필 사진이 업로드되었습니다.")
      } catch (error: any) {
        alert("프로필 사진 업로드 실패: " + error.message)
      }
    }
  }

  const handleFileInputChange = async () => {
    await handleProfilePictureUpload()
  }

  const fetchProfilePicture = async () => {
    const user = firebase.auth().currentUser
    if (user) {
      const storageRef = firebase.storage().ref()
      const petProfilePictureRef = storageRef.child(
        `profilePictures/${user.uid}`,
      )

      try {
        const downloadUrl = await petProfilePictureRef.getDownloadURL()
        setProfileImgUrl(downloadUrl)
      } catch (error: any) {
        if (error.code === "storage/object-not-found") {
          // console.log("프로필 사진 없음")
          setProfileImgUrl(defaultProfileImgUrl)
        } else {
          console.error("Failed to fetch profile picture:", error.message)
        }
      }
    }
  }

  const handleFileInputClick = () => {
    fileInput.current?.click()
  }

  const handleProfilePictureDelete = async () => {
    const user = firebase.auth().currentUser
    if (user) {
      const storageRef = firebase.storage().ref()
      const profilePictureRef = storageRef.child(`profilePictures/${user.uid}`)

      try {
        await profilePictureRef.delete()
        setProfileImgUrl("")
        alert("프로필 사진이 삭제되었습니다.")
      } catch (error: any) {
        alert("프로필 사진 삭제 실패했습니다. 다시 시도해주세요.")
      }
    }
  }

  // 닉네임
  const fetchNickName = async () => {
    const user = firebase.auth().currentUser
    if (user) {
      const db = firebase.firestore()
      const nicknameRef = db.collection("users").doc(user.uid)

      try {
        const nicknameDoc = await nicknameRef.get()
        if (nicknameDoc.exists) {
          const nicknameData = nicknameDoc.data()
          setNickname(nicknameData?.nickname || "")
        }
      } catch (error: any) {
        console.error("변경에 실패하였습니다. 다시 시도해주세요.")
      }
    }
  }

  const handleNickNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value)
  }

  const saveData = async (nickname: string) => {
    const user = firebase.auth().currentUser

    if (user) {
      const db = firebase.firestore()
      const petRef = db.collection("users").doc(user.uid)

      try {
        await petRef.set({ nickname }, { merge: true })
        console.log("닉네임 변경 완료")
      } catch (error) {
        console.error("변경 실패")
      }
    } else {
      console.log("User is not logged in.")
    }
  }

  const handleSaveData = async () => {
    if (nickname.trim() === "") {
      const user = firebase.auth().currentUser
      if (user) {
        await saveData(user.uid)
        alert("닉네임이 저장되었습니다.")
      } else {
        alert("사용자 정보를 찾을 수 없습니다.")
      }
    } else {
      await saveData(nickname)
      alert("닉네임이 저장되었습니다.")
    }
    await fetchNickName() // 닉네임 변경 후 새로운 닉네임을 불러옵니다.
  }

  return (
    <div className={styles.mypage}>
      <div className={styles.container}>
        <div className={styles.profile}>
          <Link to="/MyPage">
            <span className={styles.myprofile}>내 프로필</span>
          </Link>
          <Link to="/MyPagePet">
            <span className={styles.petprofile}>반려동물 프로필</span>
          </Link>
        </div>
      </div>
      <div className={styles.profileImg}>
        <input
          type="file"
          ref={fileInput}
          className={styles.inputFile}
          onChange={handleFileInputChange}
        />
        {profileImgUrl ? (
          <img
            src={profileImgUrl}
            alt="Profile"
            className={styles.profilePicture}
          />
        ) : (
          <img
            src={defaultProfileImgUrl}
            alt="Profile"
            className={styles.profilePicture}
          />
        )}
        <div className={styles.btnContainer}>
          <button onClick={handleFileInputClick} className={styles.smallbtn}>
            이미지 변경
          </button>
          <button
            onClick={handleProfilePictureDelete}
            className={styles.smallbtn}
          >
            이미지 삭제
          </button>
        </div>
      </div>

      <form className={styles.profileForm}>
        <div className={styles.nickname}>
          <span>닉네임</span>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={handleNickNameChange}
          />
        </div>
        <div className={styles.email}>
          <span>이메일</span>
          <input type="email" value={email} readOnly />
        </div>
      </form>
      <div className={styles.btnContainer}>
        <button className={styles.btn} onClick={handleSaveData}>
          프로필 수정
        </button>
        <Link to="/">
          <button className={styles.btn} onClick={handleLogout}>
            로그아웃
          </button>
        </Link>
      </div>
    </div>
  )
}
