import React from "react"
import PostList from "../components/PostList"
import Search from "../components/Search"
import styles from "../styles/Coummunity.module.css"

export default function Community() {
  return (
    <div className={styles.community}>
      <Search />
      <h1>커뮤니티</h1>
      <PostList collectionName="posts" />
    </div>
  )
}
