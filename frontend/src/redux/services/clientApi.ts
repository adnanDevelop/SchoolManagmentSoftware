import { baseUrl } from "@/utils/baseUrl";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const clientApi = createApi({
  reducerPath: "clientApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/client`,
    credentials: "include",
  }),
  tagTypes: ["client"],

  endpoints: (builder) => ({
    createClient: builder.mutation({
      query: (payload) => ({
        url: `/create/`,
        method: "POST",
        body: payload.body,
      }),
      invalidatesTags: ["client"],
    }),

    // Delete Client Request
    deleteClient: builder.mutation({
      query: (payload) => ({
        url: `/delete/${payload.id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["client"],
    }),
    listClient: builder.query({
      query: (payload) => ({
        url: "/all",
        method: "GET",
        params: payload.params,
      }),
      providesTags: ["client"],
    }),
    getClientById: builder.query({
      query: (payload) => ({
        url: `/${payload.id}`,
        method: "GET",
      }),
      providesTags: ["client"],
    }),
  }),
});

export const {
  useListClientQuery,
  useGetClientByIdQuery,
  useCreateClientMutation,
  useDeleteClientMutation,
} = clientApi;

export default clientApi;
