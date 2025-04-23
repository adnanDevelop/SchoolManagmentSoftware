import { useState } from "react";
import { ITask } from "./type";
import { useAppSelector } from "@/redux/store";
import ListCard from "./component/ListCard";
import CardSkeleton from "../../components/global/CardSkeleton";

import { FaSearch } from "react-icons/fa";
import { useListTaskQuery } from "@/redux/services/taskApi";
import CreateTaskModal from "./component/CreateTaskModal";

const Task = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [queryParams, setQueryParams] = useState({
    search: "",
    page: 1,
    limit: 9,
  });

  document.title = "WOFFICE - Tasks";

  // Calling Apis
  const { data: taskData, isLoading } = useListTaskQuery({
    params: queryParams,
  });

  // Handle pagination function
  const handlePageChange = (direction: "next" | "previous") => {
    const newPage =
      direction === "next" ? queryParams.page + 1 : queryParams.page - 1;

    setQueryParams((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  return (
    <main className="lg:pb-[60px] pb-[40px]">
      {/* Header section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-700 ">Tasks</h2>
        <div className="flex items-center justify-between p-4 mt-5 bg-white shadow-sm rounded-2xl">
          {/* Searchbar */}
          <div className="hidden sm:block">
            <div className="lg:w-[350px] w-[280px] flex items-center bg-light-white p-1.5 rounded-full ">
              <button
                type="button"
                className="flex-0 text-content w-[30px] h-[30px] text-sm rounded-full flex items-center justify-center hover:text-primary transitions"
              >
                <FaSearch />
              </button>
              <input
                placeholder="Search..."
                className="w-full h-full text-xs bg-transparent border-none outline-none text-content ps-2 focus:outline-none focus:shadow-none font-poppin placeholder:text-xs"
                onChange={(e) =>
                  setQueryParams({ ...queryParams, search: e.target.value })
                }
              />
            </div>
          </div>

          {/* Create button */}
          <div className="flex items-center gap-4">
            <div>
              {user?.role !== "member" && (
                <button
                  onClick={() => {
                    const element = document.getElementById(
                      "createTask"
                    ) as HTMLDialogElement;
                    if (element) {
                      element.showModal();
                    }
                  }}
                  className="px-6 h-[40px] rounded-full bg-primary text-white text-[14px] flex items-center justify-center transitions shadow-sm"
                >
                  {" "}
                  + Create
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Task listing */}
      <section className="grid grid-cols-12 gap-6 mt-6">
        {isLoading ? (
          Array(9)
            .fill(null)
            .map((_, index) => <CardSkeleton key={index} />)
        ) : taskData?.data?.length > 0 ? (
          taskData?.data?.map((project: ITask, index: number) => (
            <ListCard data={project} key={index} />
          ))
        ) : (
          <p className="text-[40px] col-span-12 text-center font-medium text-gray-700">
            No Task Found
          </p>
        )}
      </section>

      {taskData?.data?.length > 0 && !isLoading && (
        <section className="flex items-center justify-center mt-[40px]">
          <div className="flex items-center gap-3 border-none rounded-lg select-none justify-items-center">
            <button
              className={`bg-light-white w-[35px] h-[35px] rounded-full text-[20px] flex items-center justify-center ${
                queryParams.page <= 1
                  ? "bg-white text-black cursor-not-allowed"
                  : "bg-primary text-white"
              }`}
              onClick={() => handlePageChange("previous")}
              disabled={queryParams.page <= 1}
            >
              «
            </button>
            <span className="bg-light-white w-[35px] h-[35px] flex items-center justify-center">
              {queryParams.page}
            </span>
            <button
              className={`bg-light-white w-[35px] h-[35px]  rounded-full text-[20px] flex items-center justify-center ${
                queryParams.page >= taskData?.pagination.totalPages
                  ? "bg-white text-black cursor-not-allowed"
                  : "bg-primary text-white"
              }`}
              onClick={() => handlePageChange("next")}
              disabled={queryParams.page >= taskData?.pagination.totalPages}
            >
              »
            </button>
          </div>
        </section>
      )}

      {/* Modals */}
      <CreateTaskModal id="createTask" />
    </main>
  );
};

export default Task;
