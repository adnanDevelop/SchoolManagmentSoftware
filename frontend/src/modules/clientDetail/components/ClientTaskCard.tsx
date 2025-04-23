import { Link } from "react-router-dom";
import { BiCalendarEvent } from "react-icons/bi";
import { ITask } from "../type";
import { convertTime } from "@/utils/date";

const ClientTaskCard = ({ data }: { data: ITask }) => {
  const getThreeCollaborator = data?.assignees?.slice(0, 2);
  const remainingCount = data?.assignees?.length - getThreeCollaborator?.length;

  return (
    <div className="px-5 py-4 mb-3 bg-white shadow rounded-xl">
      <Link to={`/task/${data?._id}`}>
        <div className="flex items-center justify-between mb-4">
          <p
            className="h-[20px] flex items-center justify-center capitalize font-semibold px-3 text-[10px] rounded-full"
            style={{
              color: data?.priority?.textColor,
              backgroundColor: data?.priority?.bgColor,
            }}
          >
            {data?.priority?.value}
          </p>
          <p
            className="h-[20px] flex items-center justify-center capitalize font-semibold px-3 text-[10px] rounded-full"
            style={{
              color: data?.status?.textColor,
              backgroundColor: data?.status?.bgColor,
            }}
          >
            {data?.status?.value}
          </p>
        </div>
        <h3 className="mb-1 text-base font-semibold text-black capitalize font-poppin">
          {data?.title}
        </h3>
        <p className="pb-4 text-xs text-content">
          {data?.description?.length > 80
            ? `${data?.description?.slice(0, 80)}...`
            : data?.description}
        </p>
        <div className="flex items-center justify-between py-4 border-t">
          <p className="flex items-center gap-2 text-xs">
            <BiCalendarEvent />
            {convertTime(data?.dueDate)}
          </p>
          <div>
            <div className="-space-x-[10px] avatar-group rtl:space-x-reverse">
              {getThreeCollaborator?.map((element, index) => {
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
              })}
              {remainingCount > 0 && (
                <div className="border-none avatar placeholder">
                  <div className="w-[30px] h-[30px] rounded-full bg-primary text-white text-xs">
                    <span>+{remainingCount}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ClientTaskCard;
