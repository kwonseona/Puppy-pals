import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/firestore"
import "firebase/compat/storage"
import styles from "../styles/CreatePost.module.css"
import { FaDog, FaCat } from "react-icons/fa"

interface CreatePostProps {
  collectionName: string
}

export default function CreatePost({ collectionName }: CreatePostProps) {
  // 상태 관리 추가
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [userId, setUserId] = useState("")
  const location = useLocation()
  const [postId, setPostId] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserId = () => {
      const user = firebase.auth().currentUser
      if (user) {
        setUserId(user.uid)
      }
    }

    if (location.state && location.state.post) {
      // location.state.post에 게시물 정보가 있으면 상태를 설정
      setTitle(location.state.post.title)
      setContent(location.state.post.content)
      setPostId(location.state.post.id) // postId 상태 설정
    }

    fetchUserId()
  }, [location.state])

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
      console.error("User is not logged in")
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
        console.error("Failed to upload image:", error.message)
      }
    }

    const postData = {
      title,
      content,
      imageUrl,
      author: user.uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    }

    try {
      if (postId) {
        // postId가 있으면 기존 게시물 수정
        const postDoc = await db.collection(collectionName).doc(postId).get()
        if (!postDoc.exists) {
          console.error("Failed to update post: Post not found")
          return
        }
        await db.collection(collectionName).doc(postId).update(postData)
        alert("게시글이 수정되었습니다.")
      } else {
        // postId가 없으면 새 게시물 추가
        const docRef = await db.collection(collectionName).add(postData)
        await db
          .collection(collectionName)
          .doc(docRef.id)
          .update({ ...postData, id: docRef.id })
        alert("게시글이 작성되었습니다.")
      }

      // 컬렉션 이름에 따라 페이지 이동
      if (collectionName === "posts") {
        navigate("/Community")
      } else if (collectionName === "QnAposts") {
        navigate("/QnA")
      }

      setTitle("")
      setContent("")
      setFile(null)
    } catch (error: any) {
      console.error("Failed to save post:", error.message)
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
            type="text"
            placeholder="본문을 입력해주세요."
            value={content}
            onChange={handleContentChange}
          ></input>
        </div>
        <div>
          <h3 className={styles.title}>첨부 파일</h3>
          <input
            className={styles.file}
            type="file"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit" className={styles.smallbtn}>
          글 작성
        </button>
      </form>
    </div>
  )
}
