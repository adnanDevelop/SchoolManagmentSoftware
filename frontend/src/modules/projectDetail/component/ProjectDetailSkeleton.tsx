const ProjectDetailLoader = () => {
  return (
    <div className="w-full p-5 mb-3 bg-white lg:col-span-4 md:col-span-6 col-span-full rounded-xl">
      <div className="flex items-center justify-between gap-10 pb-4 border-b">
        {/* Project Create and Due date skeleton */}
        <div className="flex items-center gap-28">
          <div className="flex items-center space-x-4 animate-pulse">
            <div className="w-[20px] h-[20px] bg-gray-200 rounded-full"></div>
            <div className="flex flex-col py-1 space-y-2.5">
              <div className="w-[100px] h-3 bg-gray-200 rounded"></div>
              <div className="w-[100px] h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="flex items-center space-x-4 animate-pulse">
            <div className="w-[20px] h-[20px] bg-gray-200 rounded-full"></div>
            <div className="flex flex-col py-1 space-y-2.5">
              <div className="w-[100px] h-3 bg-gray-200 rounded"></div>
              <div className="w-[100px] h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        {/* Button skeleton */}
        <div className="flex items-center gap-4 animate-pulse">
          <div className="w-[40px] h-[40px] bg-gray-200 rounded-full"></div>
          <div className="w-[40px] h-[40px] bg-gray-200 rounded-full"></div>
        </div>
      </div>
      <div className="pt-4 animate-pulse">
        <div className="w-[200px] h-4 bg-gray-200 rounded mb-2.5"></div>
        <div className="w-full h-3 bg-gray-200 rounded mb-1.5"></div>
        <div className="w-full h-3 bg-gray-200 rounded mb-1.5"></div>
        <div className="w-full h-3 bg-gray-200 rounded mb-1.5"></div>
        <div className="w-full h-3 bg-gray-200 rounded mb-1.5"></div>
        <div className="w-[200px] h-3 bg-gray-200 rounded mb-1.5"></div>
      </div>
    </div>
  );
};

export default ProjectDetailLoader;
