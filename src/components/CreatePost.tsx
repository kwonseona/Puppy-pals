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
  const [category, setCategory] = useState("")
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

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
  }

  const handleCategoryChange = (category: string) => {
    setCategory(category)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileWithUniqueId = new File(
        [e.target.files[0]],
        `${userId}_${Date.now()}_${e.target.files[0].name}`,
        { type: e.target.files[0].type },
      )
      setFile(fileWithUniqueId)
    } else {
      setFile(null)
    }
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

    const postData = {
      title,
      content,
      category,
      imageUrl,
      author: user.uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    }

    try {
      if (postId) {
        // postId가 있으면 기존 게시물 수정
        const postDoc = await db.collection(collectionName).doc(postId).get()
        if (!postDoc.exists) {
          console.error("게시물 업데이트 실패")
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
      console.error("글 업데이트 실패", error.message)
    }
  }

  return (
    <div className={styles.post}>
      <div className={styles.topContainer}>
        <span className={styles.title}>카테고리</span>
        <div className={styles.btnContainer}>
          <button
            className={styles.dogbedge}
            onClick={() => handleCategoryChange("dog")}
          >
            <FaDog className={styles.icon} />
            강아지
          </button>
          <button
            className={styles.catbedge}
            onClick={() => handleCategoryChange("cat")}
          >
            <FaCat className={styles.icon} />
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
          <textarea
            className={styles.text}
            placeholder="본문을 입력해주세요."
            value={content}
            onChange={handleContentChange}
          ></textarea>
        </div>
        <div className={styles.fileInput}>
          <h3 className={styles.title}>사진 등록</h3>
          <label className={styles.file} htmlFor="file">
            <svg
              width="27"
              height="24"
              viewBox="0 0 27 24"
              fill="#ffffff"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.5 17.6333C15.7828 17.6333 17.6333 15.7828 17.6333 13.5C17.6333 11.2172 15.7828 9.36667 13.5 9.36667C11.2172 9.36667 9.36667 11.2172 9.36667 13.5C9.36667 15.7828 11.2172 17.6333 13.5 17.6333Z"
                fill="#ACACAC"
              />
              <path
                d="M9.62501 0.583344L7.26126 3.16668H3.16668C1.74584 3.16668 0.583344 4.32918 0.583344 5.75001V21.25C0.583344 22.6708 1.74584 23.8333 3.16668 23.8333H23.8333C25.2542 23.8333 26.4167 22.6708 26.4167 21.25V5.75001C26.4167 4.32918 25.2542 3.16668 23.8333 3.16668H19.7388L17.375 0.583344H9.62501ZM13.5 19.9583C9.93501 19.9583 7.04168 17.065 7.04168 13.5C7.04168 9.93501 9.93501 7.04168 13.5 7.04168C17.065 7.04168 19.9583 9.93501 19.9583 13.5C19.9583 17.065 17.065 19.9583 13.5 19.9583Z"
                fill="#ACACAC"
              />
            </svg>
            <span>첨부 파일</span>
          </label>
          <input
            id="file"
            type="file"
            accept=".jpg, .jpeg, .png"
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
