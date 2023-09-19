import { del, post } from "../request";
const BASE_URL = "http://localhost:4000/api/comment";

const addComment = (data, id) =>
  post(`${BASE_URL}/${id}`, data, "application/json");
const deleteComment = (id) => del(`${BASE_URL}/${id}`);

const commentService = {
  addComment,
  deleteComment,
};

export default commentService;
