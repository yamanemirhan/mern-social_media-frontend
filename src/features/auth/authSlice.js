import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import authService from "./authService";
import { resetPosts } from "../post/postSlice";

const initialState = {
  isLoggedIn: JSON.parse(localStorage.getItem("mern-social")) || null,
  loading: {
    register: false,
    login: false,
  },
  error: {
    register: null,
    login: null,
  },
};

export const register = createAsyncThunk(
  "auth/register",
  async (user, thunkAPI) => {
    try {
      const response = await authService.register(JSON.stringify(user));
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message);
      }
      toast.success(result.message);
      return result;
    } catch (error) {
      toast.error(error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
  try {
    const response = await authService.login(JSON.stringify(user));
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message);
    }
    localStorage.setItem("mern-social", JSON.stringify(result.data));
    return result;
  } catch (error) {
    toast.error(error.message);
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const logout = createAsyncThunk(
  "auth/logout",
  async (data = null, thunkAPI) => {
    try {
      const response = await authService.logout();
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message);
      }
      localStorage.removeItem("mern-social");
      toast.success(result.message);
      thunkAPI.dispatch(resetPosts());
      return result;
    } catch (error) {
      toast.error(error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.isLoggedIn = null;
      localStorage.removeItem("mern-social");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading.register = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading.register = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading.register = false;
      })

      .addCase(login.pending, (state) => {
        state.loading.login = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading.login = false;
        state.isLoggedIn = action.payload.data;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading.login = false;
      })

      .addCase(logout.fulfilled, (state, action) => {
        state.isLoggedIn = null;
      });
  },
});

export const { logoutUser } = authSlice.actions;

export default authSlice.reducer;
