import { baseUrl } from "@/utils/baseUrl";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/auth`,
    credentials: "include",
  }),
  tagTypes: ["users"],
  endpoints: (builder) => ({
    // Register User
    registerUser: builder.mutation({
      query: (payload) => ({
        url: "/register",
        method: "POST",
        body: payload.body,
      }),
      invalidatesTags: ["users"],
    }),
    deleteUser: builder.mutation({
      query: (payload) => ({
        url: `/delete/${payload.id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["users"],
    }),

    // Login User
    loginUser: builder.mutation({
      query: (payload) => ({
        url: "/login",
        method: "POST",
        body: payload.body,
      }),
    }),

    // Logout User
    logoutUser: builder.mutation({
      query: () => ({
        url: `/logout`,
        method: "GET",
      }),
    }),

    // Get all users
    getAllUsers: builder.query({
      query: () => ({
        url: `/all`,
        method: "GET",
      }),
      providesTags: ["users"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useLoginUserMutation,
  useDeleteUserMutation,
  useLogoutUserMutation,
  useRegisterUserMutation,
} = authApi;

export default authApi;
