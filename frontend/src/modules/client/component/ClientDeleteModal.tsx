import toast from "react-hot-toast";
import Modal from "@/components/ui/Modal";

// Icons
import { GoAlertFill } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { useDeleteClientMutation } from "@/redux/services/clientApi";

const ClientDeleteModal = ({ id }: { id: string }) => {
  const navigate = useNavigate();
  const [deleteTask] = useDeleteClientMutation();
  const deleteClientFunction = async (deleteId: string) => {
    try {
      await deleteTask({ id: deleteId })
        .unwrap()
        .then((e) => {
          toast.success(e.message);
          const element = document.getElementById(id) as HTMLDialogElement;
          if (element) {
            element.close();
          }
          navigate("/client");
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
    <Modal id={id}>
      <div className="modal-box w-[400px] text-center bg-white">
        <div className="w-[70px] h-[70px] mx-auto rounded-full grid place-items-center bg-red-100">
          <GoAlertFill className="text-[30px] text-red-500" />
        </div>
        <h3 className=" font-bold text-center text-[25px] text-black mt-4">
          Delete Client
        </h3>
        <p className="mt-3 leading-5 text-content">
          You&apos;re going to delete this client. Are you sure?
        </p>
        <div className="flex items-center justify-center w-full modal-action">
          <button
            className="px-[30px] h-[40px] rounded-lg bg-gray-200 text-black font-medium font-jakarta transitions hover:scale-105 text-sm"
            onClick={() => {
              const modal = document.getElementById(
                id
              ) as HTMLDialogElement | null;
              if (modal) modal.close();
            }}
          >
            No, Keep it.
          </button>
          <button
            type="submit"
            className="px-[30px] h-[40px] rounded-lg bg-red-500 text-white font-jakarta font-medium transitions hover:scale-105 text-sm"
            onClick={() => deleteClientFunction(id)}
          >
            Yes, Delete it!
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ClientDeleteModal;
