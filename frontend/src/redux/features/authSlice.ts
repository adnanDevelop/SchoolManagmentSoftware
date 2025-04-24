import { createSlice } from "@reduxjs/toolkit";
import { setCookie, removeCookie, getCookie } from "../../utils/cookie";

const initialState = {
  token: getCookie("token") || "",
  // isAuthenticated: !!getCookie("token"),
  isAuthenticated: false,
  user: JSON.parse(getCookie("userData") || "{}"),
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      setCookie("userData", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      removeCookie("token");
      removeCookie("userData");
    },
  },
});

export const { logout, login } = authSlice.actions;
export default authSlice.reducer;
