export function VideoCardSkeleton() {
  return (
    <div className="relative flex flex-col max-w-[770px] min-w-[350px] p-2 rounded-3xl bg-white overflow-hidden animate-pulse">
      <div className="w-full h-[400px] bg-gray-200 rounded-2xl" />

      <div className="p-3 flex-1 flex flex-col gap-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
}

export function VideoCardsSkeleton() {
  return (
    <div className="relative flex flex-col max-w-[450px] min-w-[350px] p-2 rounded-3xl bg-white overflow-hidden animate-pulse">
      <div className="w-full h-[200px] bg-gray-200 rounded-2xl" />

      <div className="p-3 flex-1 flex flex-col gap-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
}
