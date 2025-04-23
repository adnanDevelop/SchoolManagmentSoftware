import toast from "react-hot-toast";
import Modal from "@/components/ui/Modal";
import { useForm } from "react-hook-form";
import { useComentReplyMutation } from "@/redux/services/projectApi";

interface IReplyProps {
  message: string;
}

const ReplyComentModal = ({ id }: { id: string }) => {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IReplyProps>();

  const [createProject] = useComentReplyMutation();

  const submitData = async (data: IReplyProps) => {
    try {
      await createProject({
        id,
        body: {
          message: data?.message,
        },
      })
        .unwrap()
        .then((response) => {
          toast.success(response.message);
          const element = document.getElementById(id) as HTMLDialogElement;
          if (element) {
            element.close();
          }
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
    <Modal id={id}>
      <div className="modal-box max-w-[600px] bg-white">
        <h3 className=" text-black font-bold text-center text-[25px] text-heading-color ">
          Create <span className="text-primary">Project</span>
        </h3>

        <form className="w-full mt-4 " onSubmit={handleSubmit(submitData)}>
          {/* title input */}
          <div className="mb-2">
            <label className="text-xs font-medium text-gray-700 xl:text-sm">
              Title:
            </label>
            <input
              type="text"
              className="w-full h-[40px] placeholder:text-slate px-3 border text-content text-xs focus:outline-none rounded-md bg-transparent"
              placeholder="Reply..."
              {...register("message", {
                required: "Reply is required",
              })}
            />
            {errors.message && (
              <p className="mt-1 text-xs text-red-500">
                {errors.message.message}
              </p>
            )}
          </div>

          {/* Submit button */}
          <div className="flex items-center justify-center w-full modal-action col-span-full">
            <button
              className="px-[30px] h-[40px] rounded-lg bg-gray-200 text-content font-medium transitions hover:scale-105 text-sm"
              onClick={() => {
                const element = document.getElementById(
                  id
                ) as HTMLDialogElement;
                if (element) {
                  element.close();
                }
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-[30px] h-[40px] rounded-lg bg-primary text-white font-medium transitions hover:scale-105 text-sm"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ReplyComentModal;
