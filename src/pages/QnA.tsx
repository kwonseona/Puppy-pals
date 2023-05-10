import PostList from "../components/PostList"
import Search from "../components/Search"
import styles from "../styles/QnA.module.css"

export default function QnA() {
  return (
    <div className={styles.QnA}>
      <Search />
      <h1>QnA</h1>
      <PostList collectionName="QnAposts" />
    </div>
  )
}
