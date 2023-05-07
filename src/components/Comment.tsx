import { useState, useEffect } from "react"
import styles from "../styles/Comment.module.css"
import firebase from "firebase/compat/app"

interface CommentProps {
  data: CommentData
}

export interface CommentData {
  id: string
  postId: string | undefined
  author: string
  content: string
  createdAt: firebase.firestore.Timestamp
}

interface CommentProps {
  data: CommentData
  onDelete: () => void
  onUpdate: (updatedComment: CommentData) => void
}

export default function Comment({ data, onDelete, onUpdate }: CommentProps) {
  const [authorNickname, setAuthorNickname] = useState("")
  const [editedContent, setEditedContent] = useState(data.content)
  const [isEditing, setIsEditing] = useState(false)
  const currentUser = firebase.auth().currentUser

  const fetchUserNickname = async (userId: string): Promise<string> => {
    try {
      const userDoc = await firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .get()
      const userData = userDoc.data()

      if (userData && userData.nickname) {
        return userData.nickname
      } else {
        throw new Error("닉네임 없음")
      }
    } catch (error: any) {
      console.error("닉네임 수정 실패", error.message)
      return ""
    }
  }

  useEffect(() => {
    fetchUserNickname(data.author).then((fetchedNickname) => {
      setAuthorNickname(fetchedNickname)
    })
  }, [data.author])

  const handleUpdate = async () => {
    try {
      await firebase
        .firestore()
        .collection("comments")
        .doc(data.id)
        .update({ content: editedContent })
      onUpdate({ ...data, content: editedContent })
      setIsEditing(false)
    } catch (error: any) {
      console.error("댓글 업데이트 실패", error.message)
    }
  }

  const handleDelete = async () => {
    if (window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
      try {
        await firebase.firestore().collection("comments").doc(data.id).delete()
        onDelete()
      } catch (error: any) {
        console.error("댓글 삭제 실패", error.message)
      }
    }
  }

  return (
    <div className={styles.container}>
      <span>{authorNickname}</span>
      {isEditing ? (
        <input
          className={styles.text}
          type="text"
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
        />
      ) : (
        <p>{data.content}</p>
      )}
      {currentUser && currentUser.uid === data.author && (
        <div className={styles.btnContainer}>
          {isEditing ? (
            <>
              <button onClick={handleUpdate}>저장</button>
              <button onClick={() => setIsEditing(false)}>취소</button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditing(true)}>수정</button>
              <button onClick={handleDelete}>삭제</button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
