/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useParams } from "react-router-dom";
import { IListData } from "../project/type";
import { useAppSelector } from "@/redux/store";
import { useGetClientByIdQuery } from "@/redux/services/clientApi";
import ProjectDetailLoader from "@/modules/projectDetail/component/ProjectDetailSkeleton";

import ClientTaskCard from "./components/ClientTaskCard";
import MessageModal from "../client/component/MessageModal";

import { FaEnvelope } from "react-icons/fa";
import { FaLocationPin, FaMessage } from "react-icons/fa6";
import ClientProjectCard from "./components/ClientProjectCard";

const ProjectDetail = () => {
  const { id } = useParams();
  document.title = "WOFFICE - Project Details";
  const { user } = useAppSelector((state) => state.auth);
  const { data: clientData, isLoading } = useGetClientByIdQuery({ id });

  return (
    <main>
      {isLoading ? (
        <ProjectDetailLoader />
      ) : (
        <section>
          <div className="pb-3 border-b ">
            <h3 className="mb-0 text-lg font-semibold text-gray-700">
              Client Profile
            </h3>
          </div>

          {/* Client Profile */}
          <div className="grid grid-cols-12 gap-5">
            {/* Client Details and Project section */}
            <div className="col-span-8 mt-5 ">
              <div className="flex items-center py-5 bg-white rounded-md shadow-sm px-7 ">
                <div className="border-r pe-8 basis-[20%]">
                  <img
                    src={clientData?.data?.profilePicture}
                    className="w-[120px] border-2 border-primary rounded-full p-1 border-dashed"
                  />
                  {/* Buttons */}
                  {user?.role !== "member" && (
                    <div className="flex items-center justify-center gap-2 mt-3">
                      <button
                        type="submit"
                        className="w-[35px] h-[35px] rounded-full shadow-lg bg-green-500 text-white flex items-center justify-center text-sm transitions hover:scale-[1.05]"
                        onClick={() => {
                          const element = document.getElementById(
                            id || ""
                          ) as HTMLDialogElement;
                          if (element) {
                            element.showModal();
                          }
                        }}
                      >
                        <FaMessage />
                      </button>
                    </div>
                  )}
                </div>

                <div className="ps-8 basis-[85%]">
                  <h4 className="mb-1 text-xl font-semibold capitalize text-dark-gray">
                    {clientData?.data?.name}
                  </h4>
                  <p className="text-xs text-justify text-content">
                    {clientData?.data?.description}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <p className="flex items-center text-xs text-content">
                      <FaLocationPin className="me-1.5" />
                      {clientData?.data?.country}
                    </p>
                    <p className="flex items-center text-xs text-content">
                      <FaEnvelope className="me-1.5" />
                      {clientData?.data?.email}
                    </p>
                    <p></p>
                  </div>
                </div>
              </div>

              {/* Client Projects */}
              <div className="mt-8 ">
                <h3 className="pb-3 text-lg font-semibold text-gray-700">
                  Client Projects
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  {clientData?.data?.projects?.map(
                    (element: IListData, index: number) => {
                      return <ClientProjectCard data={element} key={index} />;
                    }
                  )}
                </div>
              </div>
            </div>

            {/* Task Section */}
            <div className="col-span-4 py-5 mt-5 bg-white rounded-md shadow-sm px-7">
              <h3 className="pb-4 text-lg font-semibold text-gray-700">
                Client Tasks
              </h3>
              {/* @ts-expect-error */}
              {clientData?.data?.tasks?.map((element, index: number) => {
                return <ClientTaskCard data={element} key={index} />;
              })}
            </div>
          </div>
        </section>
      )}
      {/* <ClientDeleteModal id={id!} /> */}
      <MessageModal data={clientData?.data} />
    </main>
  );
};

export default ProjectDetail;
