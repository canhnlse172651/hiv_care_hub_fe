import { ENV } from "@/constant/environment";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Reducer/authReducer";


const store = configureStore({
  reducer: {
    auth: authReducer,
    
  },
  // preloadedState,
  devTools: ENV === 'development',
});


export default store;
