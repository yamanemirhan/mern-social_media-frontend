import { del, get, post, put } from "../request";
const BASE_URL = "https://mern-social-media-6y61.onrender.com/api/post";

const getFollowingPosts = () => get(`${BASE_URL}/followings`);
const createPost = (data) => post(`${BASE_URL}/create`, data);
const updatePost = (data, id) => put(`${BASE_URL}/update/${id}`, data);
const deletePost = (id) => del(`${BASE_URL}/delete/${id}`);
const likePost = (id) => post(`${BASE_URL}/like/${id}`);

export const getUserPosts = (id) => get(`${BASE_URL}/get/${id}`);
export const getLikedPosts = () => get(`${BASE_URL}/likedPosts`);

const postService = {
  getFollowingPosts,
  createPost,
  getUserPosts,
  updatePost,
  deletePost,
  likePost,
};

export default postService;
