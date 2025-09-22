import { create } from "zustand";
import Cookies from "js-cookie";

const useAuth = create((set) => ({
  user: null,
  token: null,
  userType: null,

  login: (user, token, userType) => {
    Cookies.set("token", token);
    Cookies.set("userType", userType);
    set({ user, token, userType });
  },

  loadAuth: () => {
    const token = Cookies.get("token");
    const userType = Cookies.get("userType");
    if (token && userType) {
      set({ token, userType });
    }
  },

  logout: () => {
    Cookies.remove("token");
    Cookies.remove("userType");
    set({ user: null, token: null, userType: null });
  },
}));

export default useAuth;
