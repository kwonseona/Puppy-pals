import styles from "../styles/Search.module.css"

export default function Search() {
  return (
    <div>
      <input
        className={styles.searchBar}
        type="text"
        placeholder="검색할 제목을 입력하세요."
      />
    </div>
  )
}
