import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userService from "./userService";
import { toast } from "react-toastify";
import { logoutUser } from "../auth/authSlice";

const initialState = {
  user: null,
  loading: {
    getUser: false,
  },
  error: {
    getUser: null,
  },
};

export const getUser = createAsyncThunk(
  "user/getUser",
  async (data = null, thunkAPI) => {
    try {
      const response = await userService.getUser();
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message);
      }
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

export const follow = createAsyncThunk(
  "user/follow",
  async (data = null, thunkAPI) => {
    try {
      const response = await userService.follow(data);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

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

export const unfollow = createAsyncThunk(
  "user/unfollow",
  async (data = null, thunkAPI) => {
    try {
      const response = await userService.unfollow(data);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

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

export const cancelFollowRequest = createAsyncThunk(
  "user/cancelFollowRequest",
  async (data = null, thunkAPI) => {
    try {
      const response = await userService.cancelFollowRequest(data);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

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

export const acceptFollowRequest = createAsyncThunk(
  "user/acceptFollowRequest",
  async (data = null, thunkAPI) => {
    try {
      const response = await userService.acceptFollowRequest(data);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

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

export const dismissFollowRequest = createAsyncThunk(
  "user/dismissFollowRequest",
  async (data = null, thunkAPI) => {
    try {
      const response = await userService.dismissFollowRequest(data);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

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

export const editProfile = createAsyncThunk(
  "user/editProfile",
  async (data = null, thunkAPI) => {
    try {
      const response = await userService.editProfile(data);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

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

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addPostToLikedPosts: (state, action) => {
      const postId = action.payload.postId;

      if (state.user?.likedPosts?.includes(postId)) {
        state.user.likedPosts = state.user.likedPosts.filter(
          (id) => id !== postId
        );
      } else {
        state.user.likedPosts.push(postId);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.loading.getUser = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading.getUser = false;
        state.error.getUser = null;
        state.user = action.payload.data;
      })
      .addCase(getUser.rejected, (state) => {
        state.loading.getUser = false;
        state.error.getUser = null;
        state.user = null;
      })
      .addCase(follow.fulfilled, (state, action) => {
        const followedUser = action.payload.data.user;

        if (followedUser.private) {
          if (!state.user.sentRequests) {
            state.user.sentRequests = [followedUser._id];
          } else if (state.user.sentRequests.indexOf(followedUser._id) === -1) {
            state.user.sentRequests.push(followedUser._id);
          }
        } else {
          if (!state.user.followings) {
            state.user.followings = [followedUser];
          } else {
            const alreadyFollowing = state.user.followings.find(
              (followingUser) => followingUser._id === followedUser._id
            );
            if (!alreadyFollowing) {
              state.user.followings.push(followedUser);
            }
          }
        }
      })
      .addCase(unfollow.fulfilled, (state, action) => {
        const userIdToUnfollow = action.payload;
        state.user.followings = state.user.followings.filter(
          (user) => user._id !== userIdToUnfollow
        );
      })
      .addCase(cancelFollowRequest.fulfilled, (state, action) => {
        state.user.sentRequests = action.payload.data;
      })
      .addCase(acceptFollowRequest.fulfilled, (state, action) => {
        state.user.followerRequests = action.payload.data.followerRequests;
        state.user.followers = action.payload.data.followers;
      })
      .addCase(dismissFollowRequest.fulfilled, (state, action) => {
        state.user.followerRequests = action.payload.data;
      })
      .addCase(editProfile.fulfilled, (state, action) => {
        state.user.name = action.payload.data.name;
        state.user.private = action.payload.data.private;
        state.user.profilePicture = action.payload.data.profilePicture;
      });
  },
});

export const { addPostToLikedPosts } = userSlice.actions;
export default userSlice.reducer;
