import { useEffect, useState } from "react";
import Select from "react-select";
import toast from "react-hot-toast";
import { MultiValue } from "react-select";
import Modal from "@/components/ui/Modal";
import { useForm } from "react-hook-form";

import { IUpdateTask, ITask } from "@/modules/task/type";
import { useGetAllUsersQuery } from "@/redux/services/authApi";
import { useUpdateTaskMutation } from "@/redux/services/taskApi";
import { useListProjectQuery } from "@/redux/services/projectApi";

interface UserOption {
  value: string;
  label: string;
}

const TaskUpdateModal = ({ data }: { data: ITask }) => {
  const [status, setStatusId] = useState<string>("");
  const [priority, setPriorityId] = useState<string>("");
  const [projectId, setProjectId] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const {
    reset,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUpdateTask>();

  const { data: users } = useGetAllUsersQuery({});
  const [updateTask] = useUpdateTaskMutation();
  const { data: projectData } = useListProjectQuery({});

  const submitData = async (submitData: IUpdateTask) => {
    try {
      await updateTask({
        id: data?._id,
        body: {
          ...submitData,
          assignees: selectedUsers,
          status,
          priority,
          projectId,
        },
      })
        .unwrap()
        .then((response) => {
          toast.success(response.message);
          const element = document.getElementById(
            "projectUpdateModal"
          ) as HTMLDialogElement;
          if (element) {
            element.close();
          }
          setSelectedUsers([]);
          setStatusId("");
          setPriorityId("");
          setProjectId("");
          reset();
        })
        .catch((error) => {
          toast.error(error.data.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const assigneeOptions: UserOption[] = users?.data && [
    ...users.data.map((element: { _id: string; name: string }) => ({
      value: element._id,
      label: element.name,
    })),
  ];

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "in-progress", label: "In Progress" },
    { value: "compconsted", label: "Completed" },
  ];

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  const projectOptions = projectData?.data && [
    ...projectData.data.map((element: { _id: string; title: string }) => ({
      value: element._id,
      label: element.title,
    })),
  ];

  const handleSelectedUsers = (selectedOptions: MultiValue<UserOption>) => {
    setSelectedUsers(
      selectedOptions ? selectedOptions.map((option) => option.value) : []
    );
  };

  const selectedValues = assigneeOptions?.filter((option) => {
    return selectedUsers.includes(option.value);
  });

  const selectedStatus = statusOptions?.filter((option) => {
    return status?.includes(option.value);
  });

  const selectedPriority = priorityOptions?.filter((option) => {
    return option?.value?.includes(data?.priority?.value);
  });

  const selectedProject = projectOptions?.filter((option: UserOption) => {
    return projectId?.includes(option.value);
  });

  useEffect(() => {
    if (data) {
      setValue("title", data?.title);
      setValue("description", data?.description);
      setValue("status", data.status);
      setValue("priority", data.priority);
      // setValue("status", data.status?.value);
      // setValue("priority", data.priority?.value);
      setValue("dueDate", data?.dueDate);

      const preSelectedAssignees = data.assignees?.map(
        (element: { _id: string }) => element._id
      );
      setSelectedUsers(preSelectedAssignees || []);
      setValue("assignees", preSelectedAssignees);

      setStatusId(data?.status?.value);

      setProjectId(data?.projectId?._id);
    }
  }, [setValue, data]);

  return (
    <Modal id={"projectUpdateModal"}>
      <div className="modal-box max-w-[600px] bg-white">
        <h3 className=" text-black font-bold text-center text-[25px] text-heading-color ">
          Update <span className="text-primary">Task</span>
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
              defaultValue={data?.title}
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

          {/* Assignee Options */}
          <div className="mb-2">
            <label className="text-xs font-medium text-gray-700 xl:text-sm">
              Assignee:
            </label>
            <Select
              options={assigneeOptions}
              value={selectedValues}
              onChange={handleSelectedUsers}
              placeholder="Select User"
              required={true}
              isMulti
              className={`text-xs border-transparent border-2 h-[40px] bg-light-white !rounded-md`}
            />
          </div>

          {/* Status Option */}
          <div className="mb-2">
            <label className="text-xs font-medium text-gray-700 xl:text-sm">
              Status:
            </label>
            <Select
              options={statusOptions}
              value={selectedStatus}
              onChange={(event) => {
                if (event) {
                  setStatusId(event.value);
                }
              }}
              placeholder="Select User"
              required={true}
              // isMulti
              className={`text-xs border-transparent border-2 h-[40px] bg-light-white !rounded-md`}
            />
          </div>

          {/* Priority Option */}
          <div className="mb-2">
            <label className="text-xs font-medium text-gray-700 xl:text-sm">
              Priority:
            </label>
            <Select
              options={priorityOptions}
              value={selectedPriority}
              onChange={(event) => {
                if (event) {
                  setPriorityId(event.value);
                }
              }}
              placeholder="Select User"
              required={true}
              isMulti={false}
              className={`text-xs border-transparent border-2 h-[40px] bg-light-white !rounded-md`}
            />
          </div>

          {/* Project Option */}
          <div className="mb-2">
            <label className="text-xs font-medium text-gray-700 xl:text-sm">
              Project:
            </label>
            <Select
              options={projectOptions}
              value={selectedProject}
              onChange={(event) => {
                if (event) {
                  setProjectId(event.value);
                }
              }}
              placeholder="Select User"
              required={true}
              // isMulti
              className={`text-xs border-transparent border-2 h-[40px] bg-light-white !rounded-md`}
            />
          </div>

          {/* Start date input */}
          <div className="mb-2">
            <label className="text-xs font-medium text-gray-700 xl:text-sm">
              Due Date:
            </label>
            <input
              type="date"
              className="w-full h-[40px] placeholder:text-slate text-slate px-3 border text-content text-xs focus:outline-none rounded-md bg-transparent select-none"
              placeholder="Due Date"
              {...register("dueDate", {
                required: "Due date is required",
              })}
            />
            {errors.dueDate && (
              <p className="mt-1 text-xs text-red-500">
                {errors.dueDate.message}
              </p>
            )}
          </div>

          {/* Description  */}
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
                  "projectUpdateModal"
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
              Save
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default TaskUpdateModal;
