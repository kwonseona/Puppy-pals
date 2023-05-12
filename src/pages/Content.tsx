import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import styles from "../styles/Content.module.css"
import btnstyles from "../styles/CreatePost.module.css"
import { FaDog, FaCat, FaHeart } from "react-icons/fa"
import { useDocumentDataOnce } from "react-firebase-hooks/firestore"
import firebase from "firebase/compat/app"
import { firestore } from "../components/firebaseConfig.js"
import "firebase/compat/firestore"
import Comment from "../components/Comment"
import { CommentData } from "../components/Comment"

interface Props {
  collectionName: string
}

export default function Content({ collectionName }: Props) {
  const [nickname, setNickname] = useState("")
  const { postId } = useParams<{ postId: string }>()
  const postRef = firestore.collection(collectionName).doc(postId)
  const [post, loading, error] = useDocumentDataOnce(postRef)
  const postWithDefaults = {
    ...post,
    commentCount: post?.commentCount || 0,
  }
  const createdAt = postWithDefaults?.createdAt
    ? new Date(postWithDefaults.createdAt.seconds * 1000).toLocaleDateString()
    : "Unknown"
  const navigate = useNavigate()
  const [currentUserId, setCurrentUserId] = useState("")
  const [likeCount, setLikeCount] = useState(
    postWithDefaults.likes ? postWithDefaults.likes : 0,
  )
  const [isLiked, setIsLiked] = useState(false)
  const [comments, setComments] = useState<CommentData[]>([])
  const [commentText, setCommentText] = useState("")
  const likeDocRef = firestore
    .collection("likes")
    .doc(`${currentUserId}_${postId}`)

  useEffect(() => {
    if (post) {
      setLikeCount(post.likes)
      fetchUserNickname(post.author).then((fetchedNickname) => {
        setNickname(fetchedNickname)
      })
      checkUserLike()
    }

    const user = firebase.auth().currentUser
    if (user) {
      setCurrentUserId(user.uid)
    }

    if (post) {
      fetchComments().then((commentCount) => {
        const count = commentCount || 0
        postRef.update({ commentCount: count }) // 댓글 개수를 업데이트
      })
      setLikeCount(post.likes)
    }
  }, [post, currentUserId])

  const checkUserLike = async () => {
    if (currentUserId) {
      const likeDoc = await firestore
        .collection("likes")
        .doc(`${currentUserId}_${postId}`)
        .get()

      if (likeDoc.exists) {
        setIsLiked(true)
      } else {
        setIsLiked(false)
      }
    }
  }

  const handleCommentUpdate = (updatedComment: CommentData) => {
    setComments(
      comments.map((comment) =>
        comment.id === updatedComment.id ? updatedComment : comment,
      ),
    )
  }

  const fetchComments = async () => {
    const commentSnapshot = await firestore
      .collection("comments")
      .where("postId", "==", postId)
      .orderBy("createdAt", "desc")
      .get()

    const fetchedComments: CommentData[] = []

    commentSnapshot.forEach((doc) => {
      const data = doc.data() as CommentData
      fetchedComments.push({ ...data, id: doc.id })
    })

    setComments(fetchedComments)

    const count = fetchedComments.length
    await postRef.update({ commentCount: count }) // 댓글 개수 업데이트

    return count // return the comment count
  }

  const handleCommentDelete = async (commentId: string) => {
    setComments(comments.filter((comment) => comment.id !== commentId))

    // 게시글의 commentCount를 업데이트
    const commentCount = await fetchComments()
    await postRef.update({ commentCount })
  }

  const addComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentUserId) {
      alert("로그인 후 이용 가능한 기능입니다.")
      return
    }

    if (commentText.trim() === "") {
      alert("댓글 내용을 입력해주세요.")
      return
    }

    try {
      const newComment: CommentData = {
        id: "",
        postId,
        author: currentUserId,
        content: commentText,
        createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
      }

      const commentCount = await fetchComments()

      await firestore.collection("comments").add(newComment)
      setCommentText("")
      fetchComments()

      // 게시글의 commentCount를 업데이트
      await postRef.update({ commentCount })
    } catch (error: any) {
      console.error("Failed to add comment:", error.message)
    }
  }

  const handleEdit = () => {
    navigate(`/${collectionName}/edit/${postId}`, { state: { post } })
  }

  const handleDelete = async () => {
    if (post.author !== currentUserId) {
      alert("이 게시글을 삭제할 권한이 없습니다.")
      return
    }

    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      try {
        await postRef.delete()
        alert("게시글이 삭제되었습니다.")
        navigate("/Community") // 삭제 후 메인 페이지로 이동
      } catch (error: any) {
        console.error("Failed to delete post:", error.message)
      }
    }
  }

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
        throw new Error("실패")
      }
    } catch (error: any) {
      console.error("닉네임 가져오기 실패", error.message)
      return ""
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!post) return <div>Post not found</div>

  const toggleLike = async () => {
    if (!currentUserId) {
      alert("로그인 후 이용 가능한 기능입니다.")
      return
    }

    const likeDoc = await likeDocRef.get()

    let updatedLikeCount

    if (likeDoc.exists) {
      await likeDocRef.delete()
      setIsLiked(false)
      updatedLikeCount = likeCount ? likeCount - 1 : 0
      setLikeCount(updatedLikeCount)
    } else {
      await likeDocRef.set({
        userId: currentUserId,
        postId,
      })
      setIsLiked(true)
      updatedLikeCount = likeCount ? likeCount + 1 : 1
      setLikeCount(updatedLikeCount)
    }

    await postRef.update({ likes: updatedLikeCount })
  }

  return (
    <div className={styles.content}>
      <div className={styles.titleContainer}>
        <div className={styles.btnContainer}>
          {post.category === "dog" ? (
            <label className={styles.dogbedge}>
              <FaDog className={styles.icon} />
              강아지
            </label>
          ) : post.category === "cat" ? (
            <label className={styles.catbedge}>
              <FaCat className={styles.icon} />
              고양이
            </label>
          ) : null}
        </div>
        <span className={styles.title}>{post.title}</span>
      </div>
      <div>
        <pre className={styles.textContainer}>{post.content}</pre>
      </div>
      <div className={styles.imgContainer}>
        {post.imageUrl && <img src={post.imageUrl} alt="Post" />}
      </div>
      <div className={styles.like} onClick={toggleLike}>
        <button>
          <FaHeart className={isLiked ? styles.liked : styles.notLike} />
        </button>
        <span className={isLiked ? styles.liked : styles.notLike}>
          {likeCount}
        </span>
      </div>
      <div className={styles.info}>
        <div className={styles.userInfo}>
          <span className={styles.author}>{nickname}</span>
          <span>댓글 {postWithDefaults.commentCount || 0}</span>
          <span className={styles.date}>{createdAt}</span>
        </div>
        {post.author === currentUserId && (
          <div className={styles.btnContainer}>
            <button onClick={handleEdit}>수정</button>
            <button onClick={handleDelete}>삭제</button>
          </div>
        )}
      </div>
      <form onSubmit={addComment}>
        <input
          className={styles.comment}
          type="textarea"
          placeholder="댓글을 입력하세요."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button className={styles.btn} type="submit">
          등록
        </button>
      </form>
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          data={comment}
          onDelete={() => handleCommentDelete(comment.id)}
          onUpdate={(updatedComment) => handleCommentUpdate(updatedComment)}
        />
      ))}
    </div>
  )
}
