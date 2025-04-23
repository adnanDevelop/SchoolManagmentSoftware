import toast from "react-hot-toast";
import Modal from "@/components/ui/Modal";
import { useForm } from "react-hook-form";

import { ICreateClient } from "../type";
import { useCreateClientMutation } from "@/redux/services/clientApi";

const CreateClientModal = ({ id }: { id: string }) => {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICreateClient>();

  const [createClient, { isLoading }] = useCreateClientMutation();

  const submitData = async (data: ICreateClient) => {
    try {
      await createClient({
        body: data,
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
          Create <span className="text-primary">Client</span>
        </h3>

        <form
          className="grid w-full sm:grid-cols-2 grid-cols-1 gap-2.5 mt-4"
          onSubmit={handleSubmit(submitData)}
        >
          {/* Name input */}
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

          {/* Email input */}
          <div className="mb-2">
            <label className="text-xs font-medium text-gray-700 xl:text-sm">
              Email:
            </label>
            <input
              type="email"
              className="w-full h-[40px] placeholder:text-slate px-3 border text-content text-xs focus:outline-none rounded-md bg-transparent"
              placeholder="Email"
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

          {/* Password input */}
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

          {/* Country input */}
          <div className="mb-2">
            <label className="text-xs font-medium text-gray-700 xl:text-sm">
              Country:
            </label>
            <input
              type="text"
              className="w-full h-[40px] placeholder:text-slate px-3 border text-content text-xs focus:outline-none rounded-md bg-transparent"
              placeholder="Country"
              {...register("country", {
                required: "Country is required",
              })}
            />
            {errors.country && (
              <p className="mt-1 text-xs text-red-500">
                {errors.country.message}
              </p>
            )}
          </div>

          {/* Client Option */}
          <div className="mb-2">
            <label className="text-xs font-medium text-gray-700 xl:text-sm">
              Client:
            </label>
            <select
              className={`text-xs border-transparent border h-[40px] bg-transparent !border-gray-200 !rounded-md block w-full`}
              {...register("status", {
                required: "Status is required",
              })}
            >
              <option value="" disabled>
                Select Client
              </option>
              <option value="acitve">Active</option>
              <option value="in-active">In-Active </option>
              {/*
              <option value="projectManager">Project Manager</option>
              <option value="member">Member</option> */}
            </select>
            {errors.status && (
              <p className="mt-1 text-xs text-red-500 ps-2">
                {errors.status.message}
              </p>
            )}
          </div>

          {/* Deal input */}
          <div className="mb-2">
            <label className="text-xs font-medium text-gray-700 xl:text-sm">
              Deal:
            </label>
            <input
              type="number"
              className="w-full h-[40px] placeholder:text-slate px-3 border text-content text-xs focus:outline-none rounded-md bg-transparent"
              placeholder="Deal"
              {...register("deal", {
                required: "Deal is required",
                min: {
                  value: 0,
                  message: "Deal must be greater than 0",
                },
                max: {
                  value: 100000,
                  message: "Deal must be less than or equal to 100000",
                },
              })}
            />
            {errors.deal && (
              <p className="mt-1 text-xs text-red-500">{errors.deal.message}</p>
            )}
          </div>

          {/* Content section */}
          <div className="col-span-full">
            <label className="text-xs font-medium text-gray-700 xl:text-sm">
              Description:
            </label>
            <textarea
              className="w-full h-[120px] rounded-md bg-transparent border text-content text-xs p-3 focus:outline-none resize-none"
              placeholder="Description..."
              {...register("description", {
                required: "Description is required",
              })}
            ></textarea>
            {errors.description && (
              <p className="mt-1 text-xs text-red-500">
                {errors.description.message}
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

export default CreateClientModal;
