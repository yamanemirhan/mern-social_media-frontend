import React from "react";
import Post from "./Post";

function Posts({ posts }) {
  return (
    <div className="flex flex-col gap-8">
      {posts?.length > 0 &&
        posts?.map((post, index) => <Post key={index} post={post} />)}
    </div>
  );
}

export default Posts;
