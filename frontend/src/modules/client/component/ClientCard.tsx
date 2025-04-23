import { Link } from "react-router-dom";
import { IClientDataProps } from "../type";

const ClientCard = ({ data }: { data: IClientDataProps }) => {
  return (
    <>
      <div className="px-5 py-4 bg-white shadow-sm rounded-xl md:col-span-6 col-span-full lg:col-span-4 ">
        <div className="flex flex-col items-center justify-center mb-4">
          <button
            className={`w-[90px] rounded-full !border-none avatar before:!outline-none before:!border-none ${
              data?.active && "online"
            } `}
          >
            <div className="w-[90px] border-2 border-primary rounded-full p-1 border-dashed ">
              <img src={data?.profilePicture} />
            </div>
          </button>
          <h3 className="mt-2 text-base font-semibold text-black capitalize font-poppin">
            {data?.name}
          </h3>
          <p className="pb-3 text-xs text-content">{data?.email}</p>
          <div className="flex items-center gap-2">
            <Link
              to={`/client/${data?._id}`}
              type="submit"
              className="px-3 py-2 text-xs text-gray-400 capitalize border border-gray-200 rounded-md transitions hover:bg-primary hover:text-white"
            >
              View Profile
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center border-r-2 pe-8 border-r-light-white">
            <p className="font-medium text-content">Projects</p>
            <p className="text-content">
              {data?.projects?.length > 1 && data?.projects?.length < 10
                ? "0" + data?.projects?.length
                : data?.projects?.length}
            </p>
          </div>
          <div className="flex flex-col items-center ps-8">
            <p className="font-medium text-content">Deal</p>
            <p className="text-content">{data?.deal}$</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientCard;
