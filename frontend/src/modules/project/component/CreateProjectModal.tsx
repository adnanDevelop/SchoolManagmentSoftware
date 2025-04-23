import { useState } from "react";
import Select from "react-select";
import toast from "react-hot-toast";
import { MultiValue } from "react-select";
import Modal from "@/components/ui/Modal";
import { useForm } from "react-hook-form";

import { IcreateProjectProps } from "../type";
import { useGetAllUsersQuery } from "@/redux/services/authApi";
import { useCreateProjectMutation } from "@/redux/services/projectApi";

import { useDispatch } from "react-redux";
import clientApi, { useListClientQuery } from "@/redux/services/clientApi";

interface UserOption {
  value: string;
  label: string;
}

const CreateProjectModal = ({ id }: { id: string }) => {
  const dispatch = useDispatch();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IcreateProjectProps>();

  const { data: users } = useGetAllUsersQuery({});
  const { data: clientData } = useListClientQuery({});
  const [createProject] = useCreateProjectMutation();

  const submitData = async (data: IcreateProjectProps) => {
    try {
      await createProject({
        ...data,
        teams: selectedUsers,
      })
        .unwrap()
        .then((response) => {
          toast.success(response.message);
          dispatch(clientApi.util.invalidateTags(["client"]));
          const element = document.getElementById(id) as HTMLDialogElement;
          if (element) {
            element.close();
          }
          setSelectedUsers([]);
          reset();
        })
        .catch((error) => {
          toast.error(error.data.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const userOptions: UserOption[] = users?.data && [
    // { value: "", label: "All" },
    ...users.data.map((element: { _id: string; name: string }) => ({
      value: element._id,
      label: element.name,
    })),
  ];

  const handleSelectedUsers = (selectedOptions: MultiValue<UserOption>) => {
    setSelectedUsers(
      selectedOptions ? selectedOptions.map((option) => option.value) : []
    );
  };

  const selectedValues = userOptions?.filter((option) => {
    return selectedUsers.includes(option.value);
  });

  return (
    <Modal id={id}>
      <div className="modal-box max-w-[600px] bg-white">
        <h3 className=" text-black font-bold text-center text-[25px] text-heading-color ">
          Create <span className="text-primary">Project</span>
        </h3>

        <form
          className="grid w-full sm:grid-cols-2 grid-cols-1 gap-2.5 mt-4"
          onSubmit={handleSubmit(submitData)}
        >
          {/* title input */}
          <div className="mb-2">
            <label className="text-xs font-medium text-gray-700 xl:text-sm">
              Title:
            </label>
            <input
              type="text"
              className="w-full h-[40px] placeholder:text-slate px-3 border text-content text-xs focus:outline-none rounded-md bg-transparent"
              placeholder="Title"
              {...register("title", {
                required: "Title is required",
              })}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-500">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Team Options */}
          <div className="mb-2">
            <label className="text-xs font-medium text-gray-700 xl:text-sm">
              Team:
            </label>
            <Select
              options={userOptions}
              value={selectedValues}
              onChange={handleSelectedUsers}
              placeholder="Select User"
              required={true}
              isMulti
              className={`text-xs border-transparent border-2 h-[40px] bg-light-white !rounded-md`}
            />
          </div>

          {/* Client Option */}
          <div className="mb-2">
            <label className="text-xs font-medium text-gray-700 xl:text-sm">
              Client:
            </label>

            <select
              className={`text-xs border-transparent border h-[40px] bg-transparent !border-gray-200 !rounded-md block w-full`}
              {...register("client", {
                required: "Client is required",
              })}
            >
              <option value="" disabled>
                Select Client
              </option>
              {clientData?.data?.map(
                (element: { _id: string; name: string }, index: number) => {
                  return (
                    <option value={element?._id} key={index}>
                      {element?.name}
                    </option>
                  );
                }
              )}
            </select>
            {errors.client && (
              <p className="mt-1 text-xs text-red-500 ps-2">
                {errors.client.message}
              </p>
            )}
          </div>

          {/* Start date input */}
          <div className="mb-2">
            <label className="text-xs font-medium text-gray-700 xl:text-sm">
              Start Date:
            </label>
            <input
              type="date"
              className="w-full h-[40px] placeholder:text-slate text-slate px-3 border border-gray-200 text-content text-xs focus:outline-none rounded-md bg-transparent select-none"
              placeholder="Start Date"
              {...register("startDate", {
                required: "Start date is required",
              })}
            />
            {errors.startDate && (
              <p className="mt-1 text-xs text-red-500">
                {errors.startDate.message}
              </p>
            )}
          </div>

          {/* End date input */}
          <div className="mb-2">
            <label className="text-xs font-medium text-gray-700 xl:text-sm">
              End Date:
            </label>
            <input
              type="date"
              className="w-full h-[40px] placeholder:text-slate text-slate px-3 border border-gray-200 text-content text-xs focus:outline-none rounded-md bg-transparent select-none"
              placeholder="End Date"
              {...register("endDate", {
                required: "End date is required",
              })}
            />
            {errors.endDate && (
              <p className="mt-1 text-xs text-red-500">
                {errors.endDate.message}
              </p>
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
            {/* <ReactQuill
              theme="snow"
              value={contentValue}
              onChange={setContentValue}
              className="h-[200px] text-white "
              modules={{
                toolbar: [
                  [{ font: [] }],
                  [{ size: [] }],
                  ["bold", "italic", "underline"],
                  [{ color: [] }, { background: [] }],
                  [{ align: [] }],
                  // ["link", "image"],
                  ["link"],
                  ["clean"],
                ],
              }}
            /> */}
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
              //   disabled={loading.isLoading}
            >
              {/* {loading.isLoading ? (
                <span className="loading loading-dots loading-md"></span>
              ) : (
                "Create"
              )} */}
              Create
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreateProjectModal;
