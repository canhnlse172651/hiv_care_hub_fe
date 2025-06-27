import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { handleGoogleCallback } from "@/store/Reducer/authReducer";
import { PATHS } from "@/constant/path";

const GoogleCallback = () => {
  const dispatch = useDispatch(); 
  const { loading, error } = useSelector((state) => state.auth);

  console.log('GoogleCallback component render - loading:', loading, 'error:', error);

 
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

   

    if (code && state) {
      dispatch(handleGoogleCallback());
    } else {
      window.location.href = PATHS.HOME;
    }
  }, [dispatch]);

  // Render loading hoặc error UI
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        {error ? (
          <>
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Đăng nhập thất bại</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.href = PATHS.HOME}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Về trang chủ
            </button>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-6"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Đang xử lý đăng nhập</h2>
            <p className="text-gray-600">Vui lòng chờ trong giây lát...</p>
            {loading?.googleAuth && (
              <p className="text-sm text-gray-500 mt-2">Đang xác thực với Google...</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GoogleCallback; 