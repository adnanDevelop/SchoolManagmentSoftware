import { baseUrl } from "@/utils/baseUrl";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const projectApi = createApi({
  reducerPath: "projectApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}`,
    credentials: "include",
  }),
  tagTypes: ["project"],
  endpoints: (builder) => ({
    createProject: builder.mutation({
      query: (payload) => ({
        url: `/project/create`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["project"],
    }),

    updateProject: builder.mutation({
      query: (payload) => ({
        url: `/project/update/${payload.id}`,
        method: "PUT",
        body: payload.body,
      }),
      invalidatesTags: ["project"],
    }),

    // Delete Project Request
    deleteProject: builder.mutation({
      query: (payload) => ({
        url: `/project/delete/${payload.id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["project"],
    }),

    listProject: builder.query({
      query: (payload) => ({
        url: `/project/all`,
        method: "GET",
        params: payload.params,
      }),
      providesTags: ["project"],
    }),

    getProjectById: builder.query({
      query: (payload) => ({
        url: `/project/${payload.id}`,
        method: "GET",
        params: payload.params,
      }),
      providesTags: ["project"],
    }),

    addComent: builder.mutation({
      query: (payload) => ({
        url: `/coment/create/${payload.id}`,
        method: "POST",
        body: payload.body,
      }),
      invalidatesTags: ["project"],
    }),

    comentReply: builder.mutation({
      query: (payload) => ({
        url: `/coment/update/${payload.id}`,
        method: "PUT",
        body: payload.body,
      }),
      invalidatesTags: ["project"],
    }),
    deleteComent: builder.mutation({
      query: (payload) => ({
        url: `/coment/delete/${payload.id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["project"],
    }),
  }),
});

export const {
  useListProjectQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useAddComentMutation,
  useComentReplyMutation,
  useDeleteComentMutation,
} = projectApi;

export default projectApi;
