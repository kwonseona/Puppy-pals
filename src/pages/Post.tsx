import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/firestore"
import "firebase/compat/storage"
import styles from "../styles/Post.module.css"
import { FaDog, FaCat } from "react-icons/fa"

export default function Post() {
  // 상태 관리 추가
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [userId, setUserId] = useState("")
  const location = useLocation()
  const editingPost = location.state?.post || null
  const [prevImageUrl, setPrevImageUrl] = useState("")

  useEffect(() => {
    const fetchUserId = () => {
      const user = firebase.auth().currentUser
      if (user) {
        setUserId(user.uid)
      }
    }

    fetchUserId()

    if (editingPost) {
      setTitle(editingPost.title)
      setContent(editingPost.content)
      setPrevImageUrl(editingPost.imageUrl)
      // 이미지를 수정 로직 추가
    }
  }, [editingPost])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files ? e.target.files[0] : null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 로그인한 사용자 가져오기
    const user = firebase.auth().currentUser

    if (!user) {
      console.error("로그인 후 사용 가능")
      return
    }

    const db = firebase.firestore()

    // 파일 업로드 처리
    let imageUrl = ""
    if (file) {
      const storageRef = firebase.storage().ref()
      const imageRef = storageRef.child(`postImages/${file.name}`)

      try {
        await imageRef.put(file)
        imageUrl = await imageRef.getDownloadURL()
      } catch (error: any) {
        console.error("이미지 업로드 실패", error.message)
      }
    }

    if (editingPost) {
      // 이미지 수정 로직
      if (file && prevImageUrl) {
        // 이전 이미지 삭제
        const prevImageRef = firebase.storage().refFromURL(prevImageUrl)
        try {
          await prevImageRef.delete()
        } catch (error: any) {
          console.error("이전 이미지 삭제 실패", error.message)
        }

        // 새 이미지 업로드 및 Firestore에 글 데이터 업데이트
        try {
          await db.collection("posts").doc(editingPost.id).update({
            title,
            content,
            imageUrl,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          })
          alert("게시글이 수정되었습니다.")
        } catch (error: any) {
          console.error("업데이트 실패", error.message)
        }
      }
    } else {
      // 새 게시물 작성 로직
      // Firestore에 글 데이터 저장
      try {
        await db.collection("posts").add({
          title,
          content,
          imageUrl,
          author: user.uid,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        })
        alert("게시글이 작성되었습니다.")
        setTitle("")
        setContent("")
        setFile(null)
      } catch (error: any) {
        console.error("글 저장 실패", error.message)
      }
    }
  }

  return (
    <div className={styles.post}>
      <div className={styles.topContainer}>
        <span className={styles.title}>카테고리</span>
        <div className={styles.btnContainer}>
          <button className={styles.dogbedge}>
            <FaDog className={styles.icon} />
            강아지
          </button>
          <button className={styles.catbedge}>
            <FaCat />
            고양이
          </button>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={styles.middleContainer}>
          <span className={styles.title}>글 작성</span>
          <input
            className={styles.titleText}
            type="text"
            placeholder="제목을 입력해주세요."
            value={title}
            onChange={handleTitleChange}
          ></input>
          <input
            className={styles.text}
            type="textarea"
            placeholder="본문을 입력해주세요."
            value={content}
            onChange={handleContentChange}
          ></input>
        </div>
        <div className={styles.file}>
          <h3 className={styles.title}>첨부 파일</h3>
          <input type="file" onChange={handleFileChange} />
        </div>
        <button type="submit" className={styles.smallbtn}>
          글 작성
        </button>
      </form>
    </div>
  )
}
