import { baseUrl } from "@/utils/baseUrl";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const messageApi = createApi({
  reducerPath: "messageApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}`,
    credentials: "include",
  }),
  tagTypes: ["messages"],
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: (payload) => ({
        url: `/chat/create/${payload.id}`,
        method: "POST",
        body: payload.body,
      }),
      invalidatesTags: ["messages"],
    }),

    deleteMessage: builder.mutation({
      query: (payload) => ({
        url: `/chat/delete/${payload.id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["messages"],
    }),
    listMessages: builder.query({
      query: (payload) => ({
        url: `/chat/all/${payload.id}`,
        method: "GET",
      }),
      providesTags: ["messages"],
    }),
  }),
});

export const {
  useListMessagesQuery,
  useSendMessageMutation,
  useDeleteMessageMutation,
} = messageApi;

export default messageApi;
