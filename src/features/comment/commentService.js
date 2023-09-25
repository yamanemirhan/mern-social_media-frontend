import { del, post } from "../request";
const BASE_URL = "https://mern-social-media-6y61.onrender.com/api/comment";

const addComment = (data, id) =>
  post(`${BASE_URL}/${id}`, data, "application/json");
const deleteComment = (id) => del(`${BASE_URL}/${id}`);

const commentService = {
  addComment,
  deleteComment,
};

export default commentService;
