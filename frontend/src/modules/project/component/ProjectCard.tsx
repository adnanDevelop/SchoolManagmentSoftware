import { Link } from "react-router-dom";
import { BiCalendarEvent } from "react-icons/bi";
import { IListData } from "../type";
import { convertTime } from "@/utils/date";
import { LuMessageCircle } from "react-icons/lu";

const ProjectCard = ({ data }: { data: IListData }) => {
  const getThreeCollaborator = data?.teams?.slice(0, 2);
  const remainingCount = data?.teams?.length - getThreeCollaborator?.length;

  return (
    <div className="px-5 py-4 bg-white shadow-sm rounded-xl md:col-span-6 col-span-full lg:col-span-4 ">
      <Link to={`/project/${data?._id}`}>
        <h3 className="mb-1 text-base font-semibold text-black capitalize font-poppin">
          {data?.title}
        </h3>
        <p className="pb-4 text-xs text-content">
          {data?.description?.length > 80
            ? `${data?.description?.slice(0, 80)}...`
            : data?.description}
        </p>
        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <p className="flex items-center gap-2 text-xs">
              <BiCalendarEvent className="text-lg" />
              <span className="font-medium text-gray-500">Starts On:</span>{" "}
              {convertTime(data?.startDate)}
            </p>

            <p className="flex items-center gap-2 mt-1.5 text-xs">
              <LuMessageCircle className="text-lg" />
              {data?.coments?.length}
            </p>
          </div>
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

export default ProjectCard;
