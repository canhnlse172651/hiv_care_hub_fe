import { authenService } from "@/services/authenService";
import { localToken } from "@/utils/token";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import { PATHS } from "@/constant/path";

const initialState = {
  showModal: "",
  profile: null,
  loading: {
    login: false,
    register: false,
    getProfile: false,
  },
  error: null,
};

export const handleLogin = createAsyncThunk(
  "auth/handleLogin",
  async (payload, { dispatch }) => {
    try {
      const res = await authenService.login(payload);
      const user = res.data?.data?.user;
      if (res.data?.data) {
        localToken.set(res.data.data);
      }
      if (user) {
        dispatch(handleGetProfile());
        message.success(`Login successful! Welcome ${user.name}`);
        // Redirect based on user role
        switch (user.role) {
          case "ADMIN":
            window.location.href = PATHS.ADMIN.DASHBOARD; break;
          case "DOCTOR":
            window.location.href = PATHS.DOCTOR.DASHBOARD; break;
          case "STAFF":
            window.location.href = PATHS.STAFF.DASHBOARD; break;
          case "PATIENT":
          default:
            dispatch(handleCloseModal());
            break;
        }
      }
      return user;
    } catch (error) {
      const errorInfo = error?.response?.data;
      message.error(errorInfo?.message || "Login failed! Please try again");
      throw error;
    }
  }
);

export const handleRegister = createAsyncThunk(
  "auth/handleRegister",
  async (payload, { dispatch }) => {
    const apiPayload = {
      email: payload.email,
      password: payload.password,
      name: payload.name,
      phoneNumber: payload.phoneNumber,
    };
    const res = await authenService.register(apiPayload);
    if (res.data?.data?.user) {
      message.success("Registration successful");
      await dispatch(handleLogin({ email: payload.email, password: payload.password }));
      window.location.href = PATHS.PATIENT.PROFILE;
      return true;
    }
    return false;
  }
);

export const handleLogout = createAsyncThunk("auth/handleLogout", async () => {
  // Get refreshToken from localStorage before removing
  const authData = localStorage.getItem('auth');
  const refreshToken = authData ? JSON.parse(authData)?.refreshToken : null;
  if (refreshToken) {
    try {
      await authenService.logout({ refreshToken });
    } catch (e) {
      // Optionally handle error
    }
  }
  localStorage.removeItem('auth');
  localStorage.removeItem('token');
  message.success("Logout success");
});

export const handleGetProfile = createAsyncThunk(
  "auth/handleGetProfile",
  async () => {
    const user = authenService.getCurrentUser();
    return user;
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    handleShowModal: (state, action) => { state.showModal = action.payload; },
    handleCloseModal: (state) => { state.showModal = ""; },
    clearErrors: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(handleGetProfile.fulfilled, (state, action) => { state.profile = action.payload; })
      .addCase(handleLogin.pending, (state) => { state.loading.login = true; state.error = null; })
      .addCase(handleLogin.fulfilled, (state, action) => { state.loading.login = false; state.profile = action.payload; })
      .addCase(handleLogin.rejected, (state, action) => { state.loading.login = false; state.error = action.error.message; })
      .addCase(handleRegister.pending, (state) => { state.loading.register = true; })
      .addCase(handleRegister.fulfilled, (state) => { state.loading.register = false; })
      .addCase(handleRegister.rejected, (state, action) => { state.loading.register = false; state.error = action.error.message; })
      .addCase(handleLogout.fulfilled, (state) => { state.profile = null; state.showModal = ""; });
  },
});

export const { handleShowModal, handleCloseModal, clearErrors } = authSlice.actions;
export default authSlice.reducer;
