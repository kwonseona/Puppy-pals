import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import styles from "../styles/PostCard.module.css"
import { firebase } from "../components/firebaseConfig"

export interface PostData {
  id: string
  title: string
  content: string
  author: string
  imageUrl: string
  likes: number
}

interface PostCardProps {
  data: PostData
}

function PostCard({ data }: PostCardProps) {
  const navigate = useNavigate()
  const [nickname, setNickname] = useState("")

  useEffect(() => {
    const fetchNickname = async () => {
      const userRef = firebase.firestore().collection("users").doc(data.author)
      const userDoc = await userRef.get()
      if (userDoc.exists) {
        const userData = userDoc.data()
        if (userData) {
          setNickname(userData.nickname)
        }
      }
    }
    fetchNickname()
  }, [data.author])

  const handleClick = () => {
    navigate(`/posts/${data.id}`)
  }

  return (
    <div className={styles.card} onClick={handleClick}>
      <div className={styles.cardImg}>
        {data.imageUrl && <img src={data.imageUrl} alt={data.title} />}
      </div>
      <span className={styles.title}>{data.title}</span>
      <p className={styles.text}>{data.content}</p>
      <span className={styles.author}>{nickname}</span>
    </div>
  )
}

export default PostCard
