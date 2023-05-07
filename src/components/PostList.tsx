import { useState, useEffect } from "react"
import firebase from "firebase/compat/app"
import "firebase/compat/firestore"
import "firebase/compat/auth"
import styles from "../styles/PostList.module.css"
import { MdPlayArrow } from "react-icons/md"
import { useNavigate } from "react-router-dom"

interface Post {
  id: string
  title: string
  content: string
  imageUrl: string
  createdAt: firebase.firestore.Timestamp
  author: string
  commentCount: number
}

interface Props {
  collectionName: string
}

export default function PostList({ collectionName }: Props) {
  const postsPerPage = 4
  const [posts, setPosts] = useState<Post[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [lastVisible, setLastVisible] =
    useState<firebase.firestore.QueryDocumentSnapshot | null>(null)
  const [firstVisible, setFirstVisible] =
    useState<firebase.firestore.QueryDocumentSnapshot | null>(null)
  const [hasMorePosts, setHasMorePosts] = useState(true)

  const navigate = useNavigate()

  const handlePostClick = (postId: string) => {
    navigate(`/content/${collectionName}/${postId}`)
  }

  useEffect(() => {
    fetchPosts()
    fetchTotalPosts()
  }, [currentPage, collectionName])

  const fetchCommentCount = async (postId: string): Promise<number> => {
    try {
      const snapshot = await firebase
        .firestore()
        .collection("comments")
        .where("postId", "==", postId)
        .get()

      return snapshot.docs.length
    } catch (error: any) {
      console.error("Failed to fetch comment count:", error.message)
      return 0
    }
  }

  const fetchTotalPosts = async () => {
    const snapshot = await firebase.firestore().collection(collectionName).get()
    const totalPages = Math.ceil(snapshot.docs.length / postsPerPage)
    setTotalPages(totalPages)
  }

  const renderPageLinks = () => {
    const pageLinks = []
    let startPage = currentPage - Math.floor(postsPerPage / 2)
    let endPage = currentPage + Math.floor(postsPerPage / 2)

    if (startPage < 1) {
      endPage = Math.min(totalPages, endPage + (1 - startPage))
      startPage = 1
    }

    if (endPage > totalPages) {
      startPage = Math.max(1, startPage - (endPage - totalPages))
      endPage = totalPages
    }

    for (let i = startPage; i <= endPage; i++) {
      pageLinks.push(
        <button
          key={i}
          className={currentPage === i ? styles.activePage : ""}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>,
      )
    }

    return pageLinks
  }

  const fetchPosts = async () => {
    const query = buildQuery()
    const snapshot = await query.get()

    const fetchedPosts: Post[] = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const postData = doc.data() as Omit<Post, "id" | "commentCount">
        const authorNickname = await fetchUserNickname(postData.author)
        const commentCount = await fetchCommentCount(doc.id)
        return {
          id: doc.id,
          ...postData,
          author: authorNickname,
          commentCount,
        }
      }),
    )

    setPosts(fetchedPosts)

    if (snapshot.docs.length > 0) {
      setLastVisible(snapshot.docs[snapshot.docs.length - 1])
      setFirstVisible(snapshot.docs[0])
    }

    setHasMorePosts(snapshot.docs.length === postsPerPage)
  }

  const buildQuery = () => {
    const baseQuery = firebase
      .firestore()
      .collection(collectionName)
      .orderBy("createdAt", "desc")
      .limit(postsPerPage)

    if (currentPage === 1) {
      return baseQuery
    }

    if (lastVisible) {
      return baseQuery.startAfter(lastVisible)
    }

    return baseQuery.endBefore(firstVisible)
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
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
        throw new Error("User data is undefined or nickname is missing")
      }
    } catch (error: any) {
      console.error("Failed to fetch user nickname:", error.message)
      return ""
    }
  }

  return (
    <div>
      {posts.map((post: Post) => (
        <div
          key={post.id}
          className={styles.container}
          onClick={() => handlePostClick(post.id)}
        >
          <div className={styles.textContainer}>
            <div className={styles.text}>
              <span className={styles.title}>{post.title}</span>
              <p className={styles.text}>{post.content}</p>
            </div>
            <div className={styles.postImg}>
              {post.imageUrl ? (
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className={styles.img}
                />
              ) : (
                <div className={styles.placeholder} />
              )}
            </div>
            <div className={styles.author}>
              <span>{post.author}</span>
              <span>댓글 {post.commentCount}</span>
              <span>
                {post.createdAt &&
                  new Date(
                    post.createdAt.seconds * 1000 +
                      post.createdAt.nanoseconds / 1000000,
                  ).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      ))}
      <div className={styles.pageNation}>
        <button
          className={styles.prev}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <MdPlayArrow className={`${styles.btn} ${styles.next}`} />
        </button>
        {renderPageLinks()}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!hasMorePosts}
        >
          <MdPlayArrow className={styles.btn} />
        </button>
      </div>
    </div>
  )
}
