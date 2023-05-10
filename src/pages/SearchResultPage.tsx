import React from "react"
import { useLocation } from "react-router-dom"
import PostList from "../components/PostList"
import styles from "../styles/SearchResultPage.module.css"
import { Post } from "../components/PostList"
import Search from "../components/Search"

interface LocationState {
  results: Post[]
  collectionName: string
}

export default function SearchResultsPage() {
  const location = useLocation()
  const locationState = location.state as LocationState
  const searchResults = locationState?.results || []
  const collectionName = locationState?.collectionName || "posts"

  return (
    <>
      <Search />
      <div className={styles.container}>
        <h1>검색 결과</h1>
        <PostList
          collectionName={collectionName}
          searchResults={searchResults}
        />
      </div>
    </>
  )
}
