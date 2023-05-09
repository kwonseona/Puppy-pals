import React from "react"
import { useLocation } from "react-router-dom"
import PostList from "../components/PostList"
import styles from "../styles/SearchResultPage.module.css"
import { Post } from "../components/PostList"

interface LocationState {
  results: Post[]
}

export default function SearchResultsPage() {
  const location = useLocation()
  const searchResults = (location.state as LocationState)?.results || []

  return (
    <div className={styles.container}>
      <h1>검색 결과</h1>
      <PostList collectionName="posts" searchResults={searchResults} />
    </div>
  )
}
