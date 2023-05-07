import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import "./App.css"
import "./styles/reset.css"
import PrivateRoute from "./components/PrivateRoute"
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

function App() {
  return (
    <Router>
      <Header />
      <PostBtn />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/Community/*" element={<Community />} />
        <Route path="/QnA" element={<QnA />} />
        <Route path="/Login" element={<Login />} />
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
          path="/content/posts/:postId"
          element={<Content collectionName="posts" />}
        />
        <Route
          path="/content/QnAposts/:postId"
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
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
