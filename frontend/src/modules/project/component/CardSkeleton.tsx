const CardSkeleton = () => {
  return (
    <div className="w-full p-5 bg-white lg:col-span-4 md:col-span-6 col-span-full rounded-xl">
      <div className="flex space-x-4 animate-pulse">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="flex-1 py-1 space-y-4">
          <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="w-5/6 h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardSkeleton;
