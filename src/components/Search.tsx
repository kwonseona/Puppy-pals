import styles from "../styles/Search.module.css"
import { useState, useEffect, ChangeEvent, KeyboardEvent } from "react"
import firebase from "firebase/compat/app"
import "firebase/compat/firestore"
import { useNavigate } from "react-router-dom"

interface Post {
  id: string
  title: string
}

export default function Search() {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [posts, setPosts] = useState<Post[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const db = firebase.firestore()
      const snapshot = await db.collection("posts").get()
      const fetchedPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[]
      setPosts(fetchedPosts)
    }

    fetchData()
  }, [])

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const results = posts.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      navigate("/search-results", { state: { results } })
    }
  }

  return (
    <div>
      <input
        className={styles.searchBar}
        type="text"
        placeholder="제목을 검색하세요."
        value={searchQuery}
        onChange={handleSearchChange}
        onKeyPress={handleKeyPress}
      />
    </div>
  )
}
