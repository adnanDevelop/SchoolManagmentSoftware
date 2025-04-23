/* eslint-disable @typescript-eslint/no-explicit-any */
// import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import Modal from "@/components/ui/Modal";

import { useAppSelector } from "@/redux/store";

import { LuSend } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";
import { BsEmojiSmile } from "react-icons/bs";
import { useListMessagesQuery } from "@/redux/services/messageApi";
import { Key } from "react";
import { convertTime } from "@/utils/date";
// import { useGetClientByIdQuery } from "@/redux/services/clientApi";

interface IClientMessageProps {
  message: string;
}

const MessageModal = ({ data }: { data: any; id?: string }) => {
  const {
    register,
    formState: { errors },
  } = useForm<IClientMessageProps>();
  const { user } = useAppSelector((state) => state.auth);

  const { data: chatData } = useListMessagesQuery({ id: data?._id });

  return (
    <Modal id={data?._id}>
      <div className="modal-box p-0 max-w-[450px] h-[550px] bg-white select-none flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between w-full p-4 border-b basis-[10%]">
          <div className="flex items-center gap-2 ">
            <div className="border-none avatar online before:!outline-none before:!border-none">
              <div className="w-[40px] rounded-full ">
                <img src={data?.profilePicture} />
              </div>
            </div>
            <div>
              <p className="font-medium leading-none text-dark-gray">
                {data?.name}
              </p>
              <p className="text-[10px] text-dark-gray">Online</p>
            </div>
          </div>
          <button
            className="text-lg"
            onClick={() => {
              const element = document.getElementById(
                data?._id
              ) as HTMLDialogElement;
              if (element) {
                element.close();
              }
            }}
          >
            <RxCross2 />
          </button>
        </div>

        {/* Message listing */}
        <div className="w-full p-4 overflow-auto scroll-y-scroll basis-[80%]">
          {chatData?.data?.messages?.map(
            (
              element: {
                sender: { profilePicture: string | undefined; _id: string };
                message: string;
                createdAt: string;
              },
              index: Key | null | undefined
            ) => {
              const isSentByUser = element?.sender?._id === user?._id;
              return (
                <div
                  className={`chat ${isSentByUser ? "chat-end" : "chat-start"}`}
                  key={index}
                >
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                      <img
                        alt="User profile"
                        src={element?.sender?.profilePicture}
                      />
                    </div>
                  </div>
                  <div className="text-sm chat-bubble">{element.message}</div>
                  <div className="mt-1 text-xs opacity-50 chat-footer">
                    {convertTime(element?.createdAt)}
                  </div>
                </div>
              );
            }
          )}
        </div>

        {/* Input */}

        <form
          className="p-4 pb-1.5 block basis-[10%] border-t"
          //   onSubmit={handleSubmit(submitData)}
        >
          {/* Name input */}
          <div className="w-full mb-2">
            <div className="w-full h-[45px] flex items-center rounded-full bg-gray-100 ps-2 pe-3">
              <BsEmojiSmile className="text-[22px] text-content cursor-pointer" />
              <input
                type="text"
                className="w-full h-full text-xs bg-transparent rounded-md outline-none px-2.5 placeholder:text-slate text-content focus:outline-none"
                placeholder="Enter message..."
                {...register("message", {
                  required: "Message is required",
                })}
              />
              <LuSend className="text-[22px] text-content cursor-pointer" />
            </div>
            {errors.message && (
              <p className="mt-1 text-xs text-red-500">
                {errors.message.message}
              </p>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default MessageModal;
