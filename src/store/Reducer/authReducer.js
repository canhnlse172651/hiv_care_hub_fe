import { authenService } from "@/services/authenService";
import { authManager } from "@/utils/auth";
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
    logout: false,
  },
  error: null,
};

export const handleLogin = createAsyncThunk(
  "auth/handleLogin",
  async (payload, { dispatch }) => {
    try {
      const res = await authenService.login(payload);
      const user = res.data?.data?.user;
      
      if (user) {
        // Get fresh profile data from server
        await dispatch(handleGetProfile());
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

export const handleRegister = createAsyncThunk(
  "auth/handleRegister",
  async (payload, { dispatch }) => {
    try {
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
    } catch (error) {
      const errorInfo = error?.response?.data;
      message.error(errorInfo?.message || "Registration failed! Please try again");
      throw error;
    }
  }
);

export const handleLogout = createAsyncThunk(
  "auth/handleLogout", 
  async (_, { dispatch }) => {
    try {
      await authManager.logout();
      dispatch(handleCloseModal());
      message.success("Logout successful");
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API call fails, clear local auth data
      authManager.clearAuth();
      dispatch(handleCloseModal());
      message.success("Logout successful");
    }
  }
);

export const handleGetProfile = createAsyncThunk(
  "auth/handleGetProfile",
  async () => {
    try {
      // First try to get from local storage
      let user = authManager.getUser();
      
      // If no local data, try to fetch from server
      if (!user) {
        const response = await authenService.getProfile();
        user = response.data?.data;
      }
      
      return user;
    } catch (error) {
      console.error('Get profile error:', error);
      // Return local user data if server call fails
      return authManager.getUser();
    }
  }
);

export const handleUpdateProfile = createAsyncThunk(
  "auth/handleUpdateProfile",
  async (payload) => {
    try {
      const response = await authenService.updateProfile(payload);
      const updatedUser = response.data?.data;
      
      if (updatedUser) {
        message.success("Profile updated successfully");
      }
      
      return updatedUser;
    } catch (error) {
      const errorInfo = error?.response?.data;
      message.error(errorInfo?.message || "Failed to update profile");
      throw error;
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    handleShowModal: (state, action) => { 
      state.showModal = action.payload; 
      state.error = null; // Clear errors when opening modal
    },
    handleCloseModal: (state) => { 
      state.showModal = ""; 
      state.error = null; // Clear errors when closing modal
    },
    clearErrors: (state) => { 
      state.error = null; 
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Profile
      .addCase(handleGetProfile.pending, (state) => {
        state.loading.getProfile = true;
        state.error = null;
      })
      .addCase(handleGetProfile.fulfilled, (state, action) => {
        state.loading.getProfile = false;
        state.profile = action.payload;
      })
      .addCase(handleGetProfile.rejected, (state, action) => {
        state.loading.getProfile = false;
        state.error = action.error.message;
      })
      
      // Login
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
      
      // Register
      .addCase(handleRegister.pending, (state) => {
        state.loading.register = true;
        state.error = null;
      })
      .addCase(handleRegister.fulfilled, (state) => {
        state.loading.register = false;
      })
      .addCase(handleRegister.rejected, (state, action) => {
        state.loading.register = false;
        state.error = action.error.message;
      })
      
      // Logout
      .addCase(handleLogout.pending, (state) => {
        state.loading.logout = true;
      })
      .addCase(handleLogout.fulfilled, (state) => {
        state.loading.logout = false;
        state.profile = null;
        state.showModal = "";
      })
      .addCase(handleLogout.rejected, (state) => {
        state.loading.logout = false;
        state.profile = null;
        state.showModal = "";
      })
      
      // Update Profile
      .addCase(handleUpdateProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      });
  },
});

export const { 
  handleShowModal, 
  handleCloseModal, 
  clearErrors,
  setProfile 
} = authSlice.actions;

export default authSlice.reducer;
