import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { logoutUser } from "../features/auth/authSlice";
import { getLikedPosts } from "../features/post/postService";
import Posts from "../components/Posts";

function LikedPosts() {
  const [likedPosts, setLikedPosts] = useState([]);

  const { user } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.post);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getLikedPosts();
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message);
        }

        setLikedPosts(result.data);
      } catch (error) {
        toast.error(error.message);
        if (error.message === "You are not authorized to access this route") {
          dispatch(logoutUser());
        }
      }
    };

    fetchData();
  }, [user, posts, dispatch]);

  return (
    <div className="max-w-[1200px] mx-auto py-5">
      {likedPosts?.length === 0 ? (
        <span>There is no post that you liked.</span>
      ) : (
        <Posts posts={likedPosts} />
      )}
    </div>
  );
}

export default LikedPosts;
