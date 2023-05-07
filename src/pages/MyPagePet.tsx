import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Link,
  useNavigate,
} from "react-router-dom"
import { useEffect, useState, useRef, useCallback } from "react"
import firebase from "firebase/compat/app"
import "firebase/compat/firestore"
import "firebase/compat/auth"
import "firebase/compat/storage"
import styles from "../styles/MyPage.module.css"

export default function MyPagePet() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const fileInput = useRef<HTMLInputElement | null>(null)
  const [profileImgUrl, setProfileImgUrl] = useState("")
  const [petName, setPetName] = useState("")
  const [birthday, setBirthday] = useState("")
  const defaultProfileImgUrl =
    "https://firebasestorage.googleapis.com/v0/b/puppypals-d5a36.appspot.com/o/petProfilePictures%2FnoImg.png?alt=media&token=a3169fa5-3a36-436b-bafd-642f1174625e"

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (user && user.email) {
        setEmail(user.email)
        await fetchProfilePicture()
        await fetchPetData()
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
      const petProfilePictureRef = storageRef.child(
        `petProfilePictures/${user.uid}`,
      )

      try {
        await petProfilePictureRef.put(file)
        const downloadUrl = await petProfilePictureRef.getDownloadURL()
        setProfileImgUrl(downloadUrl)
        alert("프로필 사진이 업로드 성공")
      } catch (error: any) {
        alert("프로필 사진 업로드 실패")
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
        `petProfilePictures/${user.uid}`,
      )

      try {
        const downloadUrl = await petProfilePictureRef.getDownloadURL()
        setProfileImgUrl(downloadUrl)
      } catch (error: any) {
        if (error.code === "storage/object-not-found") {
          console.log("프로필 사진 없음")
          setProfileImgUrl(defaultProfileImgUrl)
        } else {
          console.error("프로필 사진을 가져오지 못했습니다.", error.message)
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
      const profilePictureRef = storageRef.child(
        `petProfilePictures/${user.uid}`,
      )

      try {
        await profilePictureRef.delete()
        setProfileImgUrl("")
        alert("프로필 사진이 삭제되었습니다.")
      } catch (error: any) {
        alert("다시 시도해주세요.")
      }
    }
  }

  const handlePetNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPetName(event.target.value)
  }

  const handleBirthdayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBirthday(event.target.value)
  }

  const savePetData = async (petName: string, birthday: string) => {
    const user = firebase.auth().currentUser

    if (user) {
      const db = firebase.firestore()
      const petRef = db.collection("pets").doc(user.uid)

      try {
        await petRef.set(
          {
            name: petName,
            birthday: birthday,
          },
          { merge: true },
        )
        console.log("반려동물 데이터 저장 성공")
      } catch (error) {
        console.error("반려동물 데이터 저장 실패")
      }
    } else {
      console.log("로그인 후 사용 가능합니다.")
    }
  }

  const handleSavePetData = async () => {
    await savePetData(petName, birthday)
    alert("반려동물 정보가 저장되었습니다.")
  }

  const fetchPetData = async () => {
    const user = firebase.auth().currentUser
    if (user) {
      const db = firebase.firestore()
      const petRef = db.collection("pets").doc(user.uid)

      try {
        const petDoc = await petRef.get()
        if (petDoc.exists) {
          const petData = petDoc.data()
          const rawBirthday = petData?.birthday

          if (rawBirthday) {
            setBirthday(rawBirthday)
          } else {
            setBirthday("")
          }

          setPetName(petData?.name || "")
        }
      } catch (error: any) {
        console.error("Failed to fetch pet data:", error.message)
      }
    }
  }

  return (
    <div className={styles.mypage}>
      <div className={styles.container}>
        <div className={styles.profile}>
          <Link to="/MyPage">
            <span className={styles.myprofile}>내 프로필</span>
          </Link>
          <Link to="/MyPagepet">
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
        <div className={styles.email}>
          <span>이름</span>
          <input
            type="text"
            id="petName"
            value={petName}
            onChange={handlePetNameChange}
          />
        </div>
        <div className={styles.email}>
          <span>생일</span>
          <input
            type="date"
            id="birthday"
            value={birthday}
            onChange={handleBirthdayChange}
          />
        </div>
      </form>
      <div className={styles.btnContainer}>
        <button className={styles.btn} onClick={handleSavePetData}>
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
