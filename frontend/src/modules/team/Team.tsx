import { useState } from "react";
import toast from "react-hot-toast";
import { useAppSelector } from "@/redux/store";
import CardSkeleton from "../../components/global/CardSkeleton";

import { IUser } from "./type";
import UserCard from "./components/UserCard";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
} from "@/redux/services/authApi";

import { FaSearch } from "react-icons/fa";
import CreateUserModal from "./components/CreateUserModal";

const Team = () => {
  const [queryParams, setQueryParams] = useState({
    search: "",
    page: 1,
    limit: 9,
  });
  document.title = "WOFFICE - Users";
  const { user } = useAppSelector((state) => state.auth);

  const { data: listUsers, isLoading } = useGetAllUsersQuery({
    params: queryParams,
  });
  const [deleteUser] = useDeleteUserMutation();

  // Handle pagination function
  const handlePageChange = (direction: "next" | "previous") => {
    const newPage =
      direction === "next" ? queryParams.page + 1 : queryParams.page - 1;

    setQueryParams((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const deleteUserFunction = async (userId: string) => {
    try {
      await deleteUser({ id: userId })
        .unwrap()
        .then((e) => {
          toast.success(e.message);
          const element = document.getElementById(userId) as HTMLDialogElement;
          if (element) {
            element.close();
          }
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
    <main className="lg:pb-[60px] pb-[40px]">
      {/* Header section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-700 ">Users</h2>
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

          <div className="flex items-center gap-4">
            <div>
              {user?.role !== "member" && (
                <button
                  onClick={() => {
                    const element = document.getElementById(
                      "createUserModal"
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

      {/* Project listing */}
      <section className="grid grid-cols-12 gap-6 mt-6">
        {isLoading
          ? Array(9)
              .fill(null)
              .map((_, index) => <CardSkeleton key={index} />)
          : listUsers?.data?.map((project: IUser, index: number) => (
              <UserCard
                data={project}
                key={index}
                deleteUserFunction={deleteUserFunction}
              />
            ))}
      </section>

      {/* Pagination */}
      <section className="flex items-center justify-center mt-[40px]">
        <div className="flex items-center gap-3 border-none rounded-lg justify-items-center">
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
              queryParams.page >= listUsers?.pagination.totalPages
                ? "bg-white text-black cursor-not-allowed"
                : "bg-primary text-white"
            }`}
            onClick={() => handlePageChange("next")}
            disabled={queryParams.page >= listUsers?.pagination.totalPages}
          >
            »
          </button>
        </div>
      </section>

      <CreateUserModal id="createUserModal" />
    </main>
  );
};

export default Team;
