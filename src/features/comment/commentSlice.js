import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { logoutUser } from "../auth/authSlice";
import commentService from "./commentService";
import { addCommentToPost, deleteCommentFromPost } from "../post/postSlice";

const initialState = {
  loading: {
    addComment: false,
  },
  error: {
    addComment: null,
  },
};

export const addComment = createAsyncThunk(
  "comment/addComment",
  async (data = null, thunkAPI) => {
    try {
      const response = await commentService.addComment(
        JSON.stringify(data),
        data.id
      );
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      thunkAPI.dispatch(addCommentToPost(result));
      return result;
    } catch (error) {
      toast.error(error.message);
      if (error.message === "You are not authorized to access this route") {
        thunkAPI.dispatch(logoutUser());
      }
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteComment = createAsyncThunk(
  "comment/deleteComment",
  async (data = null, thunkAPI) => {
    try {
      const response = await commentService.deleteComment(data.commentId);
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message);
      }

      thunkAPI.dispatch(deleteCommentFromPost(data));

      return result;
    } catch (error) {
      toast.error(error.message);
      if (error.message === "You are not authorized to access this route") {
        thunkAPI.dispatch(logoutUser());
      }
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addComment.pending, (state, action) => {
        state.loading.addComment = true;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading.addComment = false;
      });
  },
});

export default commentSlice.reducer;
