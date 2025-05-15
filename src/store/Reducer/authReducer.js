import { authenService } from "@/services/authenService";
import { localToken } from "@/utils/token";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { message } from "antd";

const initialState = {
  showModal: "",
  profile: null,
  loading: {
    login: false,
    register: false,
    getProfile: false,
  },
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
       
      })
      .addCase(handleLogin.fulfilled, (state, action) => {
           state.loading.login = false;
          
      })
      .addCase(handleLogin.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading.login = false;
      
      })
      .addCase(handleLogout.fulfilled,(state) => {
        state.profile = null;
        state.showModal = "";
      
      })
  },
});

export const { handleCloseModal, handleShowModal } =  authSlice.actions;
 
export default authSlice.reducer;


export const handleLogout = createAsyncThunk("auth/handleLogout", async (_, { dispatch }) => {
  // Xoá token
  localToken.remove();
  dispatch(clearCart())
  message.success("Logout success");
});

export const handleLogin = createAsyncThunk(
  "auth/handleLogin",

  async (payload, { dispatch, getState }, callback) => {
    try {
      const res = await authenService.login(payload);

      if (res?.data.data) {
        const { token: accessToken, refreshToken } = res?.data.data || {};
        // save token on client storage
        localToken.set({
          accessToken,
          refreshToken,
        });

        // get infor profile
        if (!!localToken) {
          message.success("Đăng nhập thành công");
          dispatch(handleGetProfile());
          dispatch(handleGetCart());
          dispatch(handleCloseModal());
        }
        return {
          accessToken,
          refreshToken,
        };
      }
    } catch (error) {
      const errorInfor = error?.response?.data;
      if (errorInfor.error === "Not Found") {
        message.error("Login fail ! please try again");
        setTimeout(() => {
          dispatch(handleCloseModal());
        }, 1200);
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
      const res = await authenService.register(payload);

      if (res?.data?.data?.id) {
        message.success("Register success");
        thunkApi.dispatch(
          handleLogin({
            email: payload.email,
            password: payload.password,
          })
        );

        return true;
      } else {
        return false;
      }
    } catch (error) {
      const errorInfor = error?.response?.data;

      if (errorInfor.error === "Forbidden") {
        message.error("Email was regitered");
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
