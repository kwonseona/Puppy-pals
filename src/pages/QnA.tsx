import PostList from "../components/PostList"
import Search from "../components/Search"
import CreatePost from "../components/CreatePost"

export default function QnA() {
  return (
    <>
      <Search />
      <h1>QnA</h1>
      <PostList collectionName="QnAposts" />
    </>
  )
}
