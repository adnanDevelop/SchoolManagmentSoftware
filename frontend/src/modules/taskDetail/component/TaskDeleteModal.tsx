import toast from "react-hot-toast";
import Modal from "@/components/ui/Modal";

import { useDispatch } from "react-redux";
import clientApi from "@/redux/services/clientApi";
import { useDeleteTaskMutation } from "@/redux/services/taskApi";
// Icons
import { GoAlertFill } from "react-icons/go";
import { useNavigate } from "react-router-dom";

const TaskDeleteModal = ({ id }: { id: string }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [deleteTask] = useDeleteTaskMutation();
  const deleteBlogFunction = async (projectId: string) => {
    try {
      await deleteTask({ id: projectId })
        .unwrap()
        .then((e) => {
          toast.success(e.message);
          dispatch(clientApi.util.invalidateTags(["client"]));
          const element = document.getElementById(
            "taskDeleteModal"
          ) as HTMLDialogElement;
          if (element) {
            element.close();
          }
          navigate("/task");
        })
        .catch((e) => {
          toast.error(e.data.message);
          console.log(e, "Error while deleting company");
        });
    } catch (error) {
      console.log("Error while deleting account", error);
    }
  };

  return (
    <Modal id="taskDeleteModal">
      <div className="modal-box w-[400px] text-center bg-white">
        <div className="w-[70px] h-[70px] mx-auto rounded-full grid place-items-center bg-red-100">
          <GoAlertFill className="text-[30px] text-red-500" />
        </div>
        <h3 className=" font-bold text-center text-[25px] text-black mt-4">
          Delete Task
        </h3>
        <p className="mt-3 leading-5 text-content">
          You&apos;re going to delete this task. Are you sure?
        </p>
        <div className="flex items-center justify-center w-full modal-action">
          <button
            className="px-[30px] h-[40px] rounded-lg bg-gray-200 text-black font-medium font-jakarta transitions hover:scale-105 text-sm"
            onClick={() => {
              const modal = document.getElementById(
                "taskDeleteModal"
              ) as HTMLDialogElement | null;
              if (modal) modal.close();
            }}
          >
            No, Keep it.
          </button>
          <button
            type="submit"
            className="px-[30px] h-[40px] rounded-lg bg-red-500 text-white font-jakarta font-medium transitions hover:scale-105 text-sm"
            onClick={() => deleteBlogFunction(id)}
          >
            Yes, Delete it!
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TaskDeleteModal;
