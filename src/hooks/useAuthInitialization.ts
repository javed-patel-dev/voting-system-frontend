import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { initializeAuth } from "@/store/slices/authSlice";
import decodeJWT from "@/utils/jwt";

export const useAuthInitialization = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initAuth = () => {
      try {
        const token = localStorage.getItem("token");

        if (token) {
          const decoded = decodeJWT(token);

          // Check if token is expired
          if (decoded && decoded.exp && decoded.exp * 1000 > Date.now()) {
            dispatch(initializeAuth({ token, decodedToken: decoded }));
          } else {
            // Token is expired, remove it
            localStorage.removeItem("token");
            dispatch(initializeAuth({ token: null, decodedToken: null }));
          }
        } else {
          // No token found
          dispatch(initializeAuth({ token: null, decodedToken: null }));
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        localStorage.removeItem("token");
        dispatch(initializeAuth({ token: null, decodedToken: null }));
      }
    };

    initAuth();
  }, [dispatch]);
};
