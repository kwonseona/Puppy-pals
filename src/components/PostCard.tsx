import styles from "../styles/PostCard.module.css"

export default function PostCard() {
  return (
    <div className={styles.card}>
      <div className={styles.cardImg}></div>
      <span className={styles.title}>게시글 제목</span>
      <p className={styles.text}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </p>
      <span className={styles.author}>작성자</span>
    </div>
  )
}
