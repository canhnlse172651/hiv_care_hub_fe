import { authenService } from "@/services/authenService";
import { localToken } from "@/utils/token";
import { USER_ROLES, decodeJwt, getUserRole } from "@/utils/jwt";
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
  error: null, // Add error state
};

export const authSlice = createSlice({
  initialState,
  name: "auth",
  reducers: {
    handleShowModal: (state, action) => {
      state.showModal = action.payload;
    },
    handleCloseModal: (state) => {
      // Tìm thẻ có class .modal-backdrop.fade.show và thêm class .hide
      const backdrop = document.querySelector(".modal-backdrop.fade.show");
      if (backdrop) {
        backdrop.classList.add("hide");
      }
      document.body.style.overflow = "";
      state.showModal = "";
    },
    clearErrors: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(handleGetProfile.pending, (state) => {
        state.loading.getProfile = true;
      })
      .addCase(handleGetProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading.getProfile = false;
      })
      .addCase(handleGetProfile.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading.getProfile = false;
      })
      // Xử lý cho handleRegister
      .addCase(handleRegister.pending, (state) => {
        state.loading.register = true;
      })
      .addCase(handleRegister.fulfilled, (state, action) => {
        state.loading.register = false;
      })
      .addCase(handleRegister.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading.register = false;
      })

      // Xử lý cho handleLogin
      .addCase(handleLogin.pending, (state) => {
        state.loading.login = true;
        state.error = null; // Clear previous errors
      })
      .addCase(handleLogin.fulfilled, (state, action) => {
        state.loading.login = false;
        state.error = null;
      })
      .addCase(handleLogin.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        state.loading.login = false;
      })
      .addCase(handleLogout.fulfilled, (state) => {
        state.profile = null;
        state.showModal = "";
      });
  },
});

export const { handleCloseModal, handleShowModal, clearErrors } = authSlice.actions;

export default authSlice.reducer;

export const handleLogout = createAsyncThunk("auth/handleLogout", async (_, { dispatch }) => {
  // Xoá token
  localToken.remove();
  // Remove cart reference until cart functionality is implemented
  // dispatch(clearCart())
  message.success("Logout success");
});

export const handleLogin = createAsyncThunk(
  "auth/handleLogin",
  async (payload, { dispatch }, callback) => {
    try {
      const res = await authenService.login(payload);

      if (res?.data?.data) {
        const { accessToken, refreshToken } = res?.data?.data;

        // Save tokens to storage
        localToken.set({
          accessToken,
          refreshToken,
        });

        // Get user ID from token
        const decodedToken = decodeJwt(accessToken);
        const userId = decodedToken?.userId;

        // Get profile data (might need this later)
        dispatch(handleGetProfile());

        // Route based on user role
        if (userId) {
          message.success(`Login successful! Welcome ${getUserRole(userId)}`);

          // Redirect based on user role
          switch (parseInt(userId)) {
            case USER_ROLES.ADMIN:
              window.location.href = PATHS.ADMIN.DASHBOARD;
              break;
            case USER_ROLES.DOCTOR:
              window.location.href = PATHS.DOCTOR.DASHBOARD;
              break;
            case USER_ROLES.STAFF:
              window.location.href = PATHS.STAFF.DASHBOARD;
              break;
            case USER_ROLES.PATIENT:
              // Close login modal for patients
              dispatch(handleCloseModal());
              break;
            default:
              dispatch(handleCloseModal());
              break;
          }
        }

        return {
          accessToken,
          refreshToken,
          userId,
        };
      }
    } catch (error) {
      const errorInfo = error?.response?.data;
      if (errorInfo?.error === "Not Found") {
        message.error("Login failed! Please try again");
      } else {
        message.error(errorInfo?.message || "Login failed! Please try again");
      }
    } finally {
      callback?.();
    }
  }
);

export const handleRegister = createAsyncThunk(
  "auth/handleRegister",
  async (payload, thunkApi) => {
    try {
      // Format the payload according to API requirements
      const apiPayload = {
        email: payload.email,
        password: payload.password,
        name: payload.name,
        phoneNumber: payload.phoneNumber,
      };
      
      const res = await authenService.register(apiPayload);

      if (res?.data?.data?.id) {
        message.success("Registration successful");
        
        // Login automatically after registration
        thunkApi.dispatch(
          handleLogin({
            email: payload.email,
            password: payload.password,
          }, () => {
            // Navigate to patient profile after successful login
            window.location.href = PATHS.PATIENT.PROFILE;
          })
        );

        return true;
      } else {
        return false;
      }
    } catch (error) {
      const errorInfor = error?.response?.data;

      if (errorInfor.error === "Forbidden") {
        message.error("Email already registered");
      } else {
        message.error(errorInfor?.message || "Registration failed");
      }
      return thunkApi.rejectWithValue(errorInfor);
    }
  }
);

export const handleGetProfile = createAsyncThunk(
  "auth/handleGetProfile",

  async (_, thunkApi) => {
    if (!!localToken.get()) {
      try {
        const profile = await authenService.getProfile();
        return profile?.data?.data;
      } catch (error) {
        return thunkApi.rejectWithValue(error?.response?.data);
      }
    }
  }
);
