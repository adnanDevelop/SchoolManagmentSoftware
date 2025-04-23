import { FaTrash } from "react-icons/fa";
import { IUser } from "../type";
import { useAppSelector } from "@/redux/store";

const UserCard = ({
  data,
  deleteUserFunction,
}: {
  data: IUser;
  deleteUserFunction: (id: string) => void;
}) => {
  const { user } = useAppSelector((state) => state.auth);

  const updateRole = (role: string) => {
    switch (role) {
      case "admin":
        return "Admin";
      case "member":
        return "Member";
      case "projectManager":
        return "Project Manager";
    }
  };

  const colors = {
    member: {
      bgColor: "#0d6dfd79",
      textColor: "#0d6dfdfd",
    },
    projectManager: {
      bgColor: "#ffc1075f",
      textColor: "#ffc107",
    },
    admin: {
      bgColor: "#dc354673",
      textColor: "#dc3545",
    },
  };

  return (
    <div className="flex flex-col items-center justify-center px-5 py-4 bg-white shadow-sm rounded-xl md:col-span-6 col-span-full lg:col-span-4 ">
      <img src={data?.profilePicture} className="w-[70px]" alt="" />
      <h3 className="mt-2 mb-1 text-xl font-semibold text-black capitalize font-poppin">
        {data?.name}
      </h3>
      <p
        className="h-[20px] flex items-center justify-center capitalize font-semibold px-3 text-[10px] rounded-full"
        style={{
          color: data?.role && colors[data?.role]?.textColor,
          backgroundColor: data?.role && colors[data?.role]?.bgColor,
        }}
      >
        {updateRole(data?.role)}
      </p>

      {/* Buttons */}
      {user?.role !== "member" && (
        <div className="flex items-center justify-center gap-2 mt-3">
          <button
            onClick={() => {
              const element = document.getElementById(
                "userDeleteModal"
              ) as HTMLDialogElement;
              if (element) {
                element.showModal();
              }
              deleteUserFunction(data?._id);
            }}
            className="w-[35px] h-[35px] rounded-full shadow-custom-light bg-red-500 text-white flex items-center justify-center text-sm transitions hover:scale-[1.05]"
          >
            <FaTrash />
          </button>
        </div>
      )}
    </div>
  );
};

export default UserCard;
