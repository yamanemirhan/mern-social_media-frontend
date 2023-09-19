import React, { useState } from "react";
import {
  AiOutlineComment,
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineUser,
  AiOutlineEdit,
  AiOutlineDelete,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { FiMoreHorizontal } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import EditPost from "./EditPost";
import { deletePost, likePost } from "../features/post/postSlice";
import { addComment, deleteComment } from "../features/comment/commentSlice";

function Post({ post }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showEditPost, setShowEditPost] = useState(false);
  const [showDeletePost, setShowDeletePost] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [comment, setComment] = useState("");

  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const getTimeDifference = (createdAt) => {
    const currentTime = new Date();
    const postTime = new Date(createdAt);
    const diffInSeconds = Math.floor((currentTime - postTime) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds}s`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d`;
    } else if (diffInSeconds < 2419200) {
      const weeks = Math.floor(diffInSeconds / 604800);
      return `${weeks}w`;
    } else {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return postTime.toLocaleDateString(undefined, options);
    }
  };

  const handleDeletePost = () => {
    setShowDropdown(false);
    dispatch(deletePost(post?._id));
  };

  const handleLikePost = () => {
    dispatch(likePost({ postId: post?._id, userId: user?._id }));
  };

  const handleSendComment = (e) => {
    e.preventDefault();

    dispatch(addComment({ content: comment, id: post?._id }));

    setComment("");
  };

  const handleDeleteComment = (e, comment) => {
    e.preventDefault();

    dispatch(
      deleteComment({ postId: comment?.postId, commentId: comment?._id })
    );
  };

  return (
    <>
      <div className="relative flex flex-col gap-2 p-1 border rounded-md">
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-2 cursor-pointer">
              {post?.author?.profilePicture ? (
                <img
                  src={`${process.env.REACT_APP_API_BASE_URL}/images/${post?.author?.profilePicture}`}
                  alt={post?.author?.name}
                  className="sm:w-10 sm:h-10 w-9 h-9 object-cover rounded-full"
                />
              ) : (
                <AiOutlineUser size={30} color="white" />
              )}
              <Link to={`/profile?id=${post?.author?._id}`}>
                <p>{post?.author?.name}</p>
              </Link>
            </div>
            <p className="text-sm">{getTimeDifference(post?.createdAt)} ago</p>
          </div>
          {user?._id === post?.author?._id && (
            <FiMoreHorizontal
              onClick={() => setShowDropdown(!showDropdown)}
              size={20}
              color="white"
              className="cursor-pointer"
            />
          )}
        </div>
        <div className="flex sm:flex-row flex-col gap-4">
          {post?.images && post?.images?.length > 0 && (
            <Carousel
              showThumbs={false}
              showIndicators={post.images.length === 1 ? false : true}
              showStatus={false}
              selectedItem={currentImageIndex}
              onChange={(index) => setCurrentImageIndex(index)}
              className="flex-1"
            >
              {post.images.map((image, index) => (
                <div key={index}>
                  <img
                    className="h-96 w-full object-cover"
                    src={`${process.env.REACT_APP_API_BASE_URL}/images/${image}`}
                    alt="postimage"
                  />
                </div>
              ))}
            </Carousel>
          )}
          <div className="sm:w-1/2 flex flex-col justify-between">
            {post?.content?.length > 0 && (
              <p className="max-h-80 scrollbar-hide overflow-auto p-1">
                {post.content}
              </p>
            )}
            <div className="flex items-center gap-6 mt-2 sm:mt-0">
              <div className="flex items-center gap-1">
                {user?.likedPosts.includes(post?._id) ? (
                  <AiFillHeart
                    onClick={handleLikePost}
                    size={30}
                    color="red"
                    className="cursor-pointer"
                  />
                ) : (
                  <AiOutlineHeart
                    onClick={handleLikePost}
                    size={30}
                    color="white"
                    className="cursor-pointer"
                  />
                )}

                <span>{post?.likes?.length}</span>
              </div>
              <div className="flex items-center gap-1">
                <AiOutlineComment
                  onClick={() => setShowComments(!showComments)}
                  size={30}
                  color="white"
                  className="cursor-pointer"
                />
                <span>{post.comments.length}</span>
              </div>
            </div>
          </div>
        </div>
        {showComments && (
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                {user?.profilePicture ? (
                  <img
                    src={`${process.env.REACT_APP_API_BASE_URL}/images/${user?.profilePicture}`}
                    alt={user?.name}
                    className="w-9 h-9 cursor-pointer object-cover"
                  />
                ) : (
                  <AiOutlineUser size={30} color="white" />
                )}
                <Link to={`/profile?id=${user?._id}`}>
                  <p>{user?.name}</p>
                </Link>
              </div>
              <form
                onSubmit={handleSendComment}
                className="flex flex-col gap-2"
              >
                <textarea
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Content..."
                  name="content"
                  rows="4"
                  className="resize-none p-1 bg-black-navbar"
                />
                <button
                  type="submit"
                  className="bg-black-navbar w-fit ml-auto py-2 px-6 mt-2 rounded-md text-xl hover:scale-105 duration-500"
                >
                  Send
                </button>
              </form>
            </div>
            <div className="flex flex-col gap-4">
              {post?.comments?.length > 0 ? (
                post?.comments?.map((comment) => (
                  <div key={comment?._id} className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      {comment?.author?.profilePicture ? (
                        <img
                          src={`${process.env.REACT_APP_API_BASE_URL}/images/${comment?.author?.profilePicture}`}
                          alt={comment?.author?.name}
                          className="w-9 h-9 cursor-pointer object-cover"
                        />
                      ) : (
                        <AiOutlineUser size={30} color="white" />
                      )}
                      <Link to={`/profile?id=${comment?.author?._id}`}>
                        <p>{comment?.author?.name}</p>
                      </Link>
                      <p className="ml-8 text-sm">
                        {getTimeDifference(comment?.createdAt)}
                      </p>
                      {user?._id === comment?.author?._id && (
                        <button
                          onClick={(e) => handleDeleteComment(e, comment)}
                          className="ml-auto mr-1"
                        >
                          <AiOutlineDelete size={20} color="red" />
                        </button>
                      )}
                    </div>
                    <p>{comment?.content}</p>
                  </div>
                ))
              ) : (
                <p>No comments yet.</p>
              )}
            </div>
          </div>
        )}
        {showDropdown && (
          <div className="absolute z-40 top-10 right-4 bg-black-navbar p-2 flex flex-col gap-4">
            <button
              onClick={() => setShowEditPost(true)}
              className="flex items-center gap-1 cursor-pointer"
            >
              <AiOutlineEdit size={25} color="white" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => setShowDeletePost(!showDeletePost)}
              className="flex items-center gap-1 cursor-pointer"
            >
              <AiOutlineDelete size={25} color="white" />
              <span>Delete</span>
            </button>
            {showDeletePost && (
              <div className="border-t">
                <p> Are you sure to delete this post?</p>
                <div className="flex items-center justify-around">
                  <button
                    onClick={handleDeletePost}
                    className="bg-red-500 w-fit mx-auto py-2 px-6 mt-2 rounded-md text-xl hover:scale-105 duration-500"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      setShowDeletePost(false);
                    }}
                    className="bg-blue-500 w-fit mx-auto py-2 px-6 mt-2 rounded-md text-xl hover:scale-105 duration-500"
                  >
                    No
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        {showEditPost && (
          <div className="absolute border p-1 rounded-md shadow-md shadow-white-main left-0 right-0 max-w-[1200px] mx-auto max-h-[600px] overflow-auto scrollbar-hide bg-black-navbar z-50">
            <EditPost
              post={post}
              setShowEditPost={setShowEditPost}
              setCurrentImageIndex={setCurrentImageIndex}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default Post;
