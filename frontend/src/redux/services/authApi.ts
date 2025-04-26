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
    // Login User
    loginUser: builder.mutation({
      query: (payload) => ({
        url: "/login",
        method: "POST",
        body: payload.body,
      }),
    }),

    // Delete User
    deleteUser: builder.mutation({
      query: (payload) => ({
        url: `/delete/${payload.id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["users"],
    }),

    // Logout User
    logoutUser: builder.mutation({
      query: () => ({
        url: `/logout`,
        method: "GET",
      }),
    }),

    // List all users
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
} = authApi;

export default authApi;
