import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { getFollowingPosts } from "../features/post/postSlice";

function HomeLayout() {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      dispatch(getFollowingPosts());
    }
  }, [isLoggedIn, navigate, dispatch]);

  return (
    <div>
      <Navbar />
      <div className="bg-black-main text-white-main min-h-[calc(100vh-80px)]">
        <Outlet />
      </div>
    </div>
  );
}

export default HomeLayout;
