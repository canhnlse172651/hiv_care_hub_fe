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
    googleAuth: false,
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
            window.location.href = PATHS.ADMIN.DASHBOARD;
            break;
          case "DOCTOR":
            window.location.href = PATHS.DOCTOR.DASHBOARD;
            break;
          case "STAFF":
            window.location.href = PATHS.STAFF.DASHBOARD;
            break;
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

export const handleGoogleLogin = createAsyncThunk(
  "auth/handleGoogleLogin",
  async (_, { dispatch }) => {
    try {
     
      const res = await authenService.getGoogleAuthUrl();
    
      const authUrl = res.data?.data; // URL is directly in res.data.data
    
      if (authUrl) {
        // Store current URL to redirect back after Google auth
        localStorage.setItem("googleAuthRedirect", window.location.pathname);
       
        window.location.href = authUrl;
      }
      return res.data;
    } catch (error) {
      console.error("Google login error:", error);
      message.error("Failed to initiate Google login");
      throw error;
    }
  }
);

export const handleGoogleCallback = createAsyncThunk(
  "auth/handleGoogleCallback",
  async (_, { dispatch }) => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const state = urlParams.get("state");

      if (!code || !state) {
        throw new Error("Missing authorization code or state");
      }

      const res = await authenService.handleGoogleCallback(code, state);

      const user = res.data?.data?.user;

      if (user) {
      
        
        // Check if this is a new user
        const isNewUser = res.data?.data?.isNewUser;
        if (isNewUser) {
          message.success(`Welcome to HIV CARE HUB your password is sent to your email ${user.email}`);
        } else {
          message.success(`Google login successful! Welcome ${user.name}`);
        }
        
        // Redirect based on user role
        switch (user.role) {
          case "ADMIN":
            
            window.location.href = PATHS.ADMIN.DASHBOARD;
            break;
          case "DOCTOR":
           
            window.location.href = PATHS.DOCTOR.DASHBOARD;
            break;
          case "STAFF":
          
            window.location.href = PATHS.STAFF.DASHBOARD;
            break;
          case "PATIENT":
          default:
           
            dispatch(handleCloseModal());
            // Redirect to stored URL or home
            const redirectUrl =
              localStorage.getItem("googleAuthRedirect") || PATHS.HOME;
            localStorage.removeItem("googleAuthRedirect");
            console.log("Final redirect URL:", redirectUrl);
            window.location.href = redirectUrl;
            break;
        }
      } else {
        throw new Error("No user data received");
      }
      return user;
    } catch (error) {
      console.error("Google callback error:", error);
      const errorInfo = error?.response?.data;
      message.error(
        errorInfo?.message || "Google login failed! Please try again"
      );
      // Redirect to home page on error
      window.location.href = PATHS.HOME;
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
      await dispatch(
        handleLogin({ email: payload.email, password: payload.password })
      );
      window.location.href = PATHS.PATIENT.PROFILE;
      return true;
    }
    return false;
  }
);

export const handleLogout = createAsyncThunk("auth/handleLogout", async () => {
  // Get refreshToken from localStorage before removing
  const authData = localStorage.getItem("auth");
  const refreshToken = authData ? JSON.parse(authData)?.refreshToken : null;
  if (refreshToken) {
    try {
      await authenService.logout({ refreshToken });
    } catch (e) {
      // Optionally handle error
    }
  }
  localStorage.removeItem("auth");
  localStorage.removeItem("token");
  message.success("Logout success");
});

export const handleGetProfile = createAsyncThunk(
  "auth/handleGetProfile",
  async () => {
    const user = authenService.getCurrentUser();
    return user;
  }
);

export const syncAuthStateFromStorage = createAsyncThunk(
  "auth/syncAuthStateFromStorage",
  async () => {
    const authData = localToken.get();
    if (authData?.user) {
      return authData.user;
    }
    return null;
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    handleShowModal: (state, action) => {
      state.showModal = action.payload;
    },
    handleCloseModal: (state) => {
      state.showModal = "";
    },
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(handleGetProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(syncAuthStateFromStorage.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(handleLogin.pending, (state) => {
        state.loading.login = true;
        state.error = null;
      })
      .addCase(handleLogin.fulfilled, (state, action) => {
        state.loading.login = false;
        state.profile = action.payload;
      })
      .addCase(handleLogin.rejected, (state, action) => {
        state.loading.login = false;
        state.error = action.error.message;
      })
      .addCase(handleGoogleLogin.pending, (state) => {
        state.loading.googleAuth = true;
        state.error = null;
      })
      .addCase(handleGoogleLogin.fulfilled, (state) => {
        state.loading.googleAuth = false;
      })
      .addCase(handleGoogleLogin.rejected, (state, action) => {
        state.loading.googleAuth = false;
        state.error = action.error.message;
      })
      .addCase(handleGoogleCallback.pending, (state) => {
        state.loading.googleAuth = true;
        state.error = null;
      })
      .addCase(handleGoogleCallback.fulfilled, (state, action) => {
        state.loading.googleAuth = false;
        state.profile = action.payload;
      })
      .addCase(handleGoogleCallback.rejected, (state, action) => {
        state.loading.googleAuth = false;
        state.error = action.error.message;
      })
      .addCase(handleRegister.pending, (state) => {
        state.loading.register = true;
      })
      .addCase(handleRegister.fulfilled, (state) => {
        state.loading.register = false;
      })
      .addCase(handleRegister.rejected, (state, action) => {
        state.loading.register = false;
        state.error = action.error.message;
      })
      .addCase(handleLogout.fulfilled, (state) => {
        state.profile = null;
        state.showModal = "";
      });
  },
});

export const { handleShowModal, handleCloseModal, clearErrors } =
  authSlice.actions;
export default authSlice.reducer;
