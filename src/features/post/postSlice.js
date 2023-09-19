import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { logoutUser } from "../auth/authSlice";
import postService from "./postService";
import { addPostToLikedPosts } from "../user/userSlice";

const initialState = {
  posts: [],
  loading: {
    likePost: false,
  },
  error: {},
};

export const getFollowingPosts = createAsyncThunk(
  "post/getFollowingPosts",
  async (data = null, thunkAPI) => {
    try {
      const response = await postService.getFollowingPosts();
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message);
      }
      toast.success(result.message);
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

export const createPost = createAsyncThunk(
  "post/createPost",
  async (data = null, thunkAPI) => {
    try {
      const response = await postService.createPost(data);
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message);
      }
      toast.success(result.message);
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

export const updatePost = createAsyncThunk(
  "post/updatePost",
  async (data = null, thunkAPI) => {
    try {
      const response = await postService.updatePost(data.post, data.id);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      toast.success(result.message);
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

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (data = null, thunkAPI) => {
    try {
      const response = await postService.deletePost(data);
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message);
      }
      toast.success(result.message);
      return data;
    } catch (error) {
      toast.error(error.message);
      if (error.message === "You are not authorized to access this route") {
        thunkAPI.dispatch(logoutUser());
      }
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const likePost = createAsyncThunk(
  "post/likePost",
  async (data = null, thunkAPI) => {
    try {
      const response = await postService.likePost(data.postId);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      thunkAPI.dispatch(addPostToLikedPosts(data));

      return data;
    } catch (error) {
      toast.error(error.message);
      if (error.message === "You are not authorized to access this route") {
        thunkAPI.dispatch(logoutUser());
      }
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    addCommentToPost: (state, action) => {
      const { postId } = action.payload.data;

      const postIndex = state.posts.findIndex((post) => post._id === postId);
      if (postIndex === -1) {
        return;
      }
      state.posts[postIndex].comments.unshift(action.payload.data);
    },
    deleteCommentFromPost: (state, action) => {
      const { postId, commentId } = action.payload;
      const postIndex = state.posts.findIndex((post) => post._id === postId);
      if (postIndex === -1) {
        return;
      }
      state.posts[postIndex].comments = state.posts[postIndex].comments.filter(
        (comment) => comment._id !== commentId
      );
    },
    resetPosts: (state, action) => {
      state.posts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFollowingPosts.fulfilled, (state, action) => {
        state.posts = action.payload.data;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload.data);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const updatedPostId = action.payload.data._id;
        const updatedPosts = state.posts.map((post) =>
          post._id === updatedPostId ? action.payload.data : post
        );
        state.posts = updatedPosts;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const postIdToDelete = action.payload;
        state.posts = state.posts.filter((post) => post._id !== postIdToDelete);
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const { postId, userId } = action.meta.arg;
        const post = state.posts.find((post) => post._id === postId);

        if (post) {
          const isLiked = post.likes.includes(userId);

          if (!isLiked) {
            post.likes.push(userId);
          } else {
            post.likes = post.likes.filter(
              (likedUserId) => likedUserId !== userId
            );
          }
        }
      });
  },
});

export const { addCommentToPost, deleteCommentFromPost, resetPosts } =
  postSlice.actions;

export default postSlice.reducer;
