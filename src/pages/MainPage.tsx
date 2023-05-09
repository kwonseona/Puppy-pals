import { useState, useEffect } from "react"
import styles from "../styles/MainPage.module.css"
import PostCard from "../components/PostCard"
import Search from "../components/Search"
import { firebase } from "../components/firebaseConfig"
import InfiniteScroll from "react-infinite-scroll-component"
import { PostData } from "../components/PostCard" // 임포트 추가

export default function MainPage() {
  const [posts, setPosts] = useState<PostData[]>([]) // 타입 인자 추가
  const [lastVisible, setLastVisible] =
    useState<firebase.firestore.DocumentSnapshot | null>(null) // 타입 추가
  const [hasMore, setHasMore] = useState(true)

  const fetchPosts = async () => {
    let query = firebase
      .firestore()
      .collection("posts")
      .orderBy("likes", "desc")
      .orderBy("createdAt", "desc")
      .limit(5)

    if (lastVisible) {
      query = query.startAfter(lastVisible)
    }

    const snapshot = await query.get()
    if (snapshot.empty) {
      setHasMore(false)
      return
    }

    setLastVisible(snapshot.docs[snapshot.docs.length - 1])
    const newPosts = snapshot.docs
      .map((doc) => ({
        ...doc.data(),
        id: doc.id,
        title: doc.data().title,
        content: doc.data().content,
        author: doc.data().author,
        imageUrl: doc.data().imageUrl,
        likes: doc.data().likes,
      })) // 모든 속성 추가
      .filter((post) => post.likes >= 10)

    setPosts((prevPosts) => {
      const uniquePosts = newPosts.filter(
        (newPost) => !prevPosts.some((prevPost) => prevPost.id === newPost.id),
      )
      return [...prevPosts, ...uniquePosts]
    })
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  return (
    <div className={styles.mainPage}>
      <Search />
      <h1>베스트 게시물</h1>
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchPosts}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={<p>더 이상 게시물이 없습니다.</p>}
        className={styles.cardGrid}
      >
        {posts.map((post) => (
          <PostCard key={post.id} data={post} />
        ))}
      </InfiniteScroll>
    </div>
  )
}
