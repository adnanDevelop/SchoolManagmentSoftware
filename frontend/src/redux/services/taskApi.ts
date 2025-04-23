import { baseUrl } from "@/utils/baseUrl";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const taskApi = createApi({
  reducerPath: "taskApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/task`,
    credentials: "include",
  }),
  tagTypes: ["task"],

  endpoints: (builder) => ({
    createTask: builder.mutation({
      query: (payload) => ({
        url: `/create/${payload.id}`,
        method: "POST",
        body: payload.body,
      }),
      invalidatesTags: ["task"],
    }),

    updateTask: builder.mutation({
      query: (payload) => ({
        url: `/update/${payload.id}`,
        method: "PUT",
        body: payload.body,
      }),
      invalidatesTags: ["task"],
    }),

    // Delete comment Request
    deleteTask: builder.mutation({
      query: (payload) => ({
        url: `/delete/${payload.id}`,
        method: "DELETE",
        body: payload.body,
      }),
      invalidatesTags: ["task"],
    }),
    listTask: builder.query({
      query: (payload) => ({
        url: "/all",
        method: "GET",
        params: payload.params,
      }),
      providesTags: ["task"],
    }),
    getTaskById: builder.query({
      query: (payload) => ({
        url: `/${payload.id}`,
        method: "GET",
      }),
      providesTags: ["task"],
    }),
  }),
});

export const {
  useListTaskQuery,
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = taskApi;

export default taskApi;
