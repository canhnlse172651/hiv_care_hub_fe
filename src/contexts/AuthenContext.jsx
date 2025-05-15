import React, { createContext, useContext, useEffect, useState } from "react";
import { authenService } from "@/services/authenService";
import { MODAL_TYPE } from "@/constant/general";
import { localToken } from "@/utils/token";
import { useNavigate } from "react-router-dom";
import {PATHS} from "@/constant/path";
import { message } from "antd";
const AuthenContext = createContext({});

export const AuthenContextProvider = ({ children }) => {
  
  const [showModal, setShowMadal] = useState("");

  const [privateRegister, setPrivateRegister] = useState(false);

  const [redirectPath, setRedirectPath] = useState(null);

  const [profile, setProfile] = useState({});


  const navigate = useNavigate();

  const handlePrivateRegister = (state) => {
    setPrivateRegister(state);
  };

  useEffect(() => {
    if (!!localToken.get()?.accessToken) {
      handleGetProfile?.();
    }
  }, []);

  const handleShowModal = (type_modal, path = null) => {
    setShowMadal(type_modal || "");
    setRedirectPath(path);
  };

  const handleModalClose = () => {
   // Tìm thẻ có class .modal-backdrop.fade.show và thêm class .hide
  const backdrop = document.querySelector('.modal-backdrop.fade.show');
  if (backdrop) {
    backdrop.classList.add('hide');
  }

  setShowMadal("")
  document.body.style.overflow = '';
 
  };

  const handleLogin = async (loginData, callBack) => {
    const payload = { ...loginData };

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
        handleGetProfile?.();

        handleModalClose?.();
        message.success("Đăng nhập thành công");

        if (redirectPath) {
          navigate(redirectPath);
          setRedirectPath(null);
        } else {
          // redirect home page after login if user not access on private route (origin login)
          navigate(PATHS.HOME);
        }
        // use toast
      } else {
       message.error("Login fail ! please try again")
      }
    } catch (error) {
      console.log("error", error);
      message.error("Login fail ! please try again")
      //use toast
    } finally {
      callBack?.();
    }
  };
 

  const handleRegister = async (registerData, callBack) => {
    const payload = {
      firstName: registerData?.name,
      lastName: "",
      email: registerData?.email,
      password: registerData?.password,
    };

    try {
      const res = await authenService.register(payload);
      if (res?.data?.data?.id) {
        // call handle login after finish register
        // call handleLogin here and push email & password for login after register
        //handleLogin({payload.email, payload.password})
        message.success("Register success");
        handleShowModal(MODAL_TYPE.login);
      } else {
        message.success("Register fail");
      }
    } catch (error) {
      console.log("error", error);
      message.success("Register fail");
    } finally {
      callBack?.();
    }
  };

  const handleLogout = () => {
    localToken.remove();
    navigate(PATHS.HOME);
    message.success("Đăng xuất thành công");
  };

  const handleGetProfile = async () => {
    try {
      const res = await authenService.getProfile();
      if (res?.data?.data) {
        setProfile(res.data.data);
      }
    } catch (error) {
      message.error(error);
      // handleLogout();
    }
  };

 
  return (
    <AuthenContext.Provider
      value={{
        showModal,
        handleShowModal,
        handleModalClose,
        handleLogin,
        handleRegister,
        handleLogout,
        profile,
        handlePrivateRegister,
        privateRegister,
        
      }}
    >
      {children}
    </AuthenContext.Provider>
  );
};

export const useAuthenContext = () => useContext(AuthenContext);
