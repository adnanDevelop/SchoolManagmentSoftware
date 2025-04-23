import toast from "react-hot-toast";
import Modal from "@/components/ui/Modal";
import { useForm } from "react-hook-form";

import { IcreateUserProps } from "../type";
import { useRegisterUserMutation } from "@/redux/services/authApi";

const CreateUserModal = ({ id }: { id: string }) => {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IcreateUserProps>();

  const [createUser, { isLoading }] = useRegisterUserMutation();

  const submitData = async (data: IcreateUserProps) => {
    try {
      await createUser({ body: data })
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
          Create <span className="text-primary">User</span>
        </h3>

        <form
          className="grid w-full sm:grid-cols-2 grid-cols-1 gap-2.5 mt-4"
          onSubmit={handleSubmit(submitData)}
        >
          {/* title input */}
          <div className="mb-2">
            <label className="text-xs font-medium text-gray-700 xl:text-sm">
              Name:
            </label>
            <input
              type="text"
              className="w-full h-[40px] placeholder:text-slate px-3 border text-content text-xs focus:outline-none rounded-md bg-transparent"
              placeholder="Name"
              {...register("name", {
                required: "Name is required",
              })}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* email input */}
          <div className="mb-2">
            <label className="text-xs font-medium text-gray-700 xl:text-sm">
              Email:
            </label>
            <input
              type="email"
              className="w-full h-[40px] placeholder:text-slate px-3 border text-content text-xs focus:outline-none rounded-md bg-transparent"
              placeholder="email"
              {...register("email", {
                required: "Email is required",
              })}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* password input */}
          <div className="mb-2">
            <label className="text-xs font-medium text-gray-700 xl:text-sm">
              Password:
            </label>
            <input
              type="password"
              className="w-full h-[40px] placeholder:text-slate px-3 border text-content text-xs focus:outline-none rounded-md bg-transparent"
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
              })}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Role options */}
          <div className="mb-2">
            <label className="text-xs font-medium text-gray-700 xl:text-sm">
              Role:
            </label>
            <select
              className="w-full h-[40px] placeholder:text-slate px-3 border text-content text-xs focus:outline-none rounded-md bg-transparent"
              {...register("role", {
                required: "Role is required",
              })}
            >
              <option value="" disabled>
                Select Role
              </option>
              <option value="admin">Admin</option>
              <option value="projectManager">Project Manager</option>
              <option value="member">Member</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-xs text-red-500 ps-2">
                {errors.role.message}
              </p>
            )}
          </div>

          {/* Submit button */}
          <div className="flex items-center justify-center w-full modal-action col-span-full">
            <button
              className="px-[30px] h-[40px] rounded-lg bg-gray-200 text-content font-medium transitions hover:scale-105 text-sm"
              onClick={() => {
                const element = document.getElementById(
                  "createUserModal"
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
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-dots loading-md"></span>
              ) : (
                "Create"
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreateUserModal;
