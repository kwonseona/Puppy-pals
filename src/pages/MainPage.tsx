import styles from "../styles/MainPage.module.css"
import PostCard from "../components/PostCard"
import Search from "../components/Search"

export default function MainPage() {
  return (
    <div>
      <Search />
      <h1>베스트 게시물</h1>
      <div className={styles.cardGrid}>
        <PostCard />
        <PostCard />
        <PostCard />
        <PostCard />
      </div>
      <div className={styles.moreBtn}>
        <button>더보기</button>
      </div>
    </div>
  )
}
