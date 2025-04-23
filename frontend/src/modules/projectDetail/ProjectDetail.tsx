import { convertTime } from "@/utils/date";
import { useParams } from "react-router-dom";
import { useAppSelector } from "@/redux/store";
import { FaClock, FaEdit, FaTrash } from "react-icons/fa";
import ProjectDeleteModal from "./component/ProjectDeleteModal";
import ProjectUpdateModal from "./component/ProjectUpdateModal";
import ProjectDetailLoader from "./component/ProjectDetailSkeleton";
import ProjectComentSection from "./component/ProjectComentSection";
import { useGetProjectByIdQuery } from "@/redux/services/projectApi";

const ProjectDetail = () => {
  document.title = "WOFFICE - Project Details";
  const { id } = useParams();
  const { user } = useAppSelector((state) => state.auth);

  const { data: projectData, isLoading } = useGetProjectByIdQuery({
    id,
  });

  return (
    <main>
      {isLoading ? (
        <ProjectDetailLoader />
      ) : (
        <section className="py-5 bg-white shadow-sm px-7 rounded-xl">
          <div className="flex items-center justify-between pb-6 border-b">
            <div className="flex items-center gap-14">
              <div className="flex items-center gap-3">
                <FaClock className="text-xl" />
                <div>
                  <h3 className="mb-0 text-lg font-medium text-gray-700">
                    Project Create
                  </h3>
                  <p className="mb-0 text-xs leading-none text-content">
                    Starts on: {convertTime(projectData?.data?.createdAt)}
                  </p>
                </div>
              </div>

              {/* Due Date */}
              <div className="flex items-center gap-3">
                <FaClock className="text-xl" />
                <div>
                  <h3 className="mb-0 text-lg font-medium text-gray-700 ">
                    Project Due Date
                  </h3>
                  <p className="mb-0 text-xs leading-none text-content">
                    Starts on: {convertTime(projectData?.data?.startDate)}{" "}
                    {" - "} {convertTime(projectData?.data?.endDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            {user?.role !== "member" && user?.role !== "client" && (
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
                      "projectDeleteModal"
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
              {projectData?.data?.title}
            </h2>
            <p className="text-sm text-justify text-content">
              {projectData?.data?.description}
            </p>
          </div>

          {/* Comments */}
          <ProjectComentSection data={projectData?.data?.coments} />
        </section>
      )}
      {/* Modals */}
      <ProjectDeleteModal id={id!} />
      <ProjectUpdateModal data={projectData?.data} />
    </main>
  );
};

export default ProjectDetail;
