import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HomeLayout from "./layouts/HomeLayout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import LikedPosts from "./pages/LikedPosts";
import { getUser } from "./features/user/userSlice";
import CreatePost from "./pages/CreatePost";
import Settings from "./pages/Settings";
import Requests from "./pages/Requests";

function App() {
  const { isLoggedIn } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getUser());
    }
  }, [dispatch, isLoggedIn]);

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<HomeLayout />}>
          <Route index={true} element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="create" element={<CreatePost />} />
          <Route path="likedposts" element={<LikedPosts />} />
          <Route path="settings" element={<Settings />} />
          <Route path="requests" element={<Requests />} />
          <Route path="favs" element={<LikedPosts />} />
        </Route>
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
