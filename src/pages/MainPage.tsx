import { useState, useEffect } from "react"
import styles from "../styles/MainPage.module.css"
import PostCard from "../components/PostCard"
import Search from "../components/Search"
import { firebase } from "../components/firebaseConfig.js"
import InfiniteScroll from "react-infinite-scroll-component"
import { PostData } from "../components/PostCard"

export default function MainPage() {
  const [posts, setPosts] = useState<PostData[]>([])
  const [lastVisible, setLastVisible] =
    useState<firebase.firestore.DocumentSnapshot | null>(null)
  const [hasMore, setHasMore] = useState(true)

  const fetchPosts = async (
    docSnapshots: firebase.firestore.DocumentSnapshot | null,
  ) => {
    let query = firebase
      .firestore()
      .collection("posts")
      .orderBy("likes", "desc")
      .orderBy("createdAt", "desc")
      .limit(4) // 항상 4개의 게시물만 불러오도록 수정

    if (docSnapshots) {
      query = query.startAfter(docSnapshots)
    }

    const snapshot = await query.get()

    if (snapshot.empty) {
      setHasMore(false)
      return
    }

    setLastVisible(snapshot.docs[snapshot.docs.length - 1])
    const newPosts = snapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title,
      content: doc.data().content,
      author: doc.data().author,
      imageUrl: doc.data().imageUrl,
      likes: doc.data().likes,
    }))

    setPosts((prevPosts) => {
      const uniquePosts = newPosts.filter(
        (newPost) => !prevPosts.some((prevPost) => prevPost.id === newPost.id),
      )
      return [...prevPosts, ...uniquePosts]
    })
  }

  const loadMorePosts = () => {
    fetchPosts(lastVisible)
  }

  useEffect(() => {
    fetchPosts(null) // 첫 로딩 시에는 lastVisible이 null이므로 처음 4개의 게시물이 로딩됨
  }, [])

  return (
    <div className={styles.mainPage}>
      <Search />
      <h1>베스트 게시물</h1>
      <InfiniteScroll
        dataLength={posts.length}
        next={loadMorePosts} // 스크롤이 끝에 도달할 때마다 loadMorePosts 함수를 호출
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
