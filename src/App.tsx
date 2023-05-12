import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import "./App.css"
import "./styles/reset.css"
import Header from "./components/Header"
import CreatePost from "./components/CreatePost"
import MainPage from "./pages/MainPage"
import Community from "./pages/Coummunity"
import QnA from "./pages/QnA"
import MyPage from "./pages/MyPage"
import MyPagePet from "./pages/MyPagePet"
import Login from "./pages/Login"
import Join from "./pages/Join"
import Content from "./pages/Content"
import Footer from "./components/Footer"
import PostBtn from "./components/PostBtn"
import SearchResultsPage from "./pages/SearchResultPage"
import { useAuth } from "./components/AuthProvider"

function App() {
  const { isLoggedIn } = useAuth()

  return (
    <Router>
      <Header />
      <PostBtn isLoggedIn={isLoggedIn} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/MainPage" element={<MainPage />} />
        <Route path="/Community/*" element={<Community />} />
        <Route path="/QnA" element={<QnA />} />
        <Route path="/Join" element={<Join />} />
        <Route path="/MyPage" element={<MyPage />} />
        <Route path="/MyPagePet" element={<MyPagePet />} />
        <Route
          path="/CreatePost"
          element={<CreatePost collectionName="posts" />}
        />
        <Route
          path="/CreateQnA"
          element={<CreatePost collectionName="QnAposts" />}
        />
        <Route
          path="/posts/:postId"
          element={<Content collectionName="posts" />}
        />
        <Route
          path="/QnAposts/:postId"
          element={<Content collectionName="QnAposts" />}
        />
        <Route
          path="/posts/edit/:postId"
          element={<CreatePost collectionName="posts" />}
        />
        <Route
          path="/QnAposts/edit/:postId"
          element={<CreatePost collectionName="QnAposts" />}
        />
        <Route path="/search-results" element={<SearchResultsPage />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
