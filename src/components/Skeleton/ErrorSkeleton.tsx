import {Skeleton} from "@/components/ui/skeleton";

export default function ErrorSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center w-5/6 max-w-sm gap-4 p-8 bg-white rounded-lg shadow-lg">
        <Skeleton className="self-start rounded-full size-20" />

        <Skeleton className="w-24 h-10" />
        <Skeleton className="w-32 h-8" />
        <Skeleton className="w-48 h-14" />
        <Skeleton className="w-24 h-10" />
      </div>
    </div>
  );
}
