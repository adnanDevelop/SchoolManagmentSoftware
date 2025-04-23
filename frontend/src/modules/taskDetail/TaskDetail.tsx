import { convertTime } from "@/utils/date";
import { FaClock, FaEdit, FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import TaskUpdateModal from "./component/TaskUpdateModal";
import TaskDeleteModal from "./component/TaskDeleteModal";
import { useAppSelector } from "@/redux/store";
import { useGetTaskByIdQuery } from "@/redux/services/taskApi";
import TaskDetailSkeleton from "../task/component/TaskDetailSkeleton";

const TaskDetail = () => {
  document.title = "WOFFICE - Task Details";

  const { id } = useParams();
  const { user } = useAppSelector((state) => state.auth);

  const { data: taskData, isLoading } = useGetTaskByIdQuery({ id });
  const getThreeCollaborator = taskData?.data?.assignees?.slice(0, 5);
  const remainingCount =
    taskData?.data?.assignees?.length - getThreeCollaborator?.length;

  return (
    <main>
      {isLoading ? (
        <TaskDetailSkeleton />
      ) : (
        <section className="py-5 bg-white shadow-sm px-7 rounded-xl">
          <div className="flex items-center justify-between pb-6 border-b">
            <div>
              <div className="flex items-center gap-14">
                <div className="flex items-center gap-3">
                  <FaClock className="text-xl" />
                  <div>
                    <h3 className="mb-0 text-lg font-medium text-gray-700">
                      Task Create
                    </h3>
                    <p className="mb-0 text-xs leading-none text-content">
                      Created on : {convertTime(taskData?.data?.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Due Date */}
                <div className="flex items-center gap-3">
                  <FaClock className="text-xl" />
                  <div>
                    <h3 className="mb-0 text-lg font-medium text-gray-700 ">
                      Task Due Date
                    </h3>
                    <p className="mb-0 text-xs leading-none text-content">
                      Ends on: {convertTime(taskData?.data?.dueDate)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <p
                  className="h-[20px] flex items-center justify-center capitalize font-semibold px-3 text-[10px] rounded-full"
                  style={{
                    color: taskData?.data?.priority?.textColor,
                    backgroundColor: taskData?.data?.priority?.bgColor,
                  }}
                >
                  {taskData?.data?.priority?.value}
                </p>
                <p
                  className="h-[20px] flex items-center justify-center capitalize font-semibold px-3 text-[10px] rounded-full"
                  style={{
                    color: taskData?.data?.status?.textColor,
                    backgroundColor: taskData?.data?.status?.bgColor,
                  }}
                >
                  {taskData?.data?.status?.value}
                </p>
              </div>

              {/* Assignees */}
              <div>
                <p className="flex items-center mt-5 text-xs font-semibold text-gray-700">
                  <span className="me-3">Assignees:</span>
                  <div className="-space-x-[5px] avatar-group rtl:space-x-reverse">
                    {getThreeCollaborator?.map(
                      (element: { profilePicture: string }, index: number) => {
                        return (
                          <div
                            className="border-none shadow-sm avatar placeholder"
                            key={index}
                          >
                            <div className="w-[30px] h-[30px] rounded-full">
                              <img
                                src={element?.profilePicture}
                                alt="Avatar Tailwind CSS Component"
                              />
                            </div>
                          </div>
                        );
                      }
                    )}
                    {remainingCount > 0 && (
                      <div className="border-none avatar placeholder">
                        <div className="w-[30px] h-[30px] rounded-full bg-primary text-white text-xs">
                          <span>+{remainingCount}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </p>
              </div>
            </div>

            {/* Buttons */}
            {user?.role !== "member" && (
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    const element = document.getElementById(
                      "projectUpdateModal"
                    ) as HTMLDialogElement;
                    if (element) {
                      element.showModal();
                    }
                  }}
                  className="w-[40px] h-[40px] rounded-full shadow-custom-light bg-green-500 text-white flex items-center justify-center text-lg transitions hover:scale-[1.05]"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => {
                    const element = document.getElementById(
                      "taskDeleteModal"
                    ) as HTMLDialogElement;
                    if (element) {
                      element.showModal();
                    }
                  }}
                  className="w-[40px] h-[40px] rounded-full shadow-custom-light bg-red-500 text-white flex items-center justify-center text-lg transitions hover:scale-[1.05]"
                >
                  <FaTrash />
                </button>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="pt-6">
            <h2 className="mb-3 text-3xl font-semibold text-gray-700">
              {taskData?.data?.title}
            </h2>
            <p className="text-sm text-justify text-content">
              {taskData?.data?.description}
            </p>
          </div>
        </section>
      )}

      {/* Modals */}
      <TaskDeleteModal id={id!} />
      <TaskUpdateModal data={taskData?.data} />
    </main>
  );
};

export default TaskDetail;
