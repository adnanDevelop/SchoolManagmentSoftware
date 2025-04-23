import toast from "react-hot-toast";
import { IAllComentProps } from "../type";
import { useForm } from "react-hook-form";
import { convertTime } from "@/utils/date";
import { useParams } from "react-router-dom";
import ReplyComentModal from "./ComentReplyModal";
import {
  useAddComentMutation,
  useDeleteComentMutation,
} from "@/redux/services/projectApi";

import { LuSend } from "react-icons/lu";
import { BsThreeDotsVertical } from "react-icons/bs";

interface IReplyProps {
  message: string;
}

const ProjectComentSection = ({ data }: { data: IAllComentProps[] }) => {
  const { id } = useParams();
  const { reset, register, handleSubmit } = useForm<IReplyProps>();

  const [addNewComent] = useAddComentMutation();
  const [deleteComent] = useDeleteComentMutation();

  const addComent = async (reply: IReplyProps) => {
    try {
      await addNewComent({
        id,
        body: {
          message: reply.message,
        },
      })
        .unwrap()
        .then((response) => {
          toast.success(response.message);
          reset();
        })
        .catch((error) => {
          toast.error(error.data.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mt-10">
      <h3 className="mb-0 text-base font-semibold text-black ">
        Leave a Reply
      </h3>

      {/* Coment input */}
      <form
        onSubmit={handleSubmit(addComent)}
        className="flex items-center w-full border border-gray-500 rounded-full text-content h-[48px] my-3 pe-[5px]"
      >
        <input
          type="text"
          className="w-full h-full text-sm bg-transparent border-none focus:outline-none ps-4"
          placeholder="Reply..."
          {...register("message")}
        />
        <button
          type="submit"
          className="w-[40px] h-[40px] rounded-full bg-primary text-white flex items-center justify-center"
        >
          <LuSend />
        </button>
      </form>

      {/* Coments listing */}
      <div>
        <h3 className="mb-8 text-base font-semibold text-black ">
          <span className="me-2">{data?.length}</span> Comments
        </h3>

        {data?.map((element, index) => {
          return (
            <div
              key={index}
              className="flex items-start gap-3 mb-6 select-none "
            >
              <img
                src={element?.userId?.profilePicture}
                className="w-[40px] h-[40px] rounded-full object-cover "
              />
              <div>
                <div className="flex items-center gap-3">
                  <h5 className="mb-0 text-base font-medium text-gray-700 capitalize">
                    {element?.userId?.name}
                  </h5>
                  <p className="text-xs text-content">
                    {convertTime(element?.createdAt)}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="flex-1 px-4 py-3 mt-2 text-xs font-medium rounded-lg bg-light-white text-content">
                      {element?.message}
                    </p>
                    <div className="dropdown">
                      <div tabIndex={0} role="button">
                        <BsThreeDotsVertical />
                      </div>
                      <ul
                        tabIndex={0}
                        className="dropdown-content menu bg-light-white text-content rounded-lg z-[1] w-52 p-2"
                      >
                        <li
                          onClick={async () => {
                            try {
                              await deleteComent({ id: element?._id })
                                .unwrap()
                                .then((response) => {
                                  toast.success(response.message);

                                  const elem =
                                    document.activeElement as HTMLElement;
                                  if (elem) {
                                    elem.blur();
                                  }
                                })
                                .catch((error) => {
                                  toast.error(error.data.message);
                                });
                            } catch (error) {
                              console.log(error);
                            }
                          }}
                        >
                          <a>Delete Coment</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <button className="text-xs font-medium text-content">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reply modal */}
      <ReplyComentModal id={id!} />
    </div>
  );
};

export default ProjectComentSection;
