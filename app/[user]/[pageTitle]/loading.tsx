export default function Loading() {
  return (
    <>
      <div className="row-start-1 row-span-2 h-full col-start-3 flex flex-col overflow-hidden p-12">
        <div className="flex justify-between items-center mb-10">
          <div className="space-y-3">
            <div className="h-4 w-16 bg-[var(--bg-secondary)] rounded animate-pulse" />
            <div className="h-8 w-48 bg-[var(--bg-secondary)] rounded animate-pulse" />
          </div>
          <div className="space-y-3 text-right">
            <div className="h-4 w-24 bg-[var(--bg-secondary)] rounded animate-pulse ml-auto" />
            <div className="h-8 w-32 bg-[var(--bg-secondary)] rounded animate-pulse ml-auto" />
          </div>
        </div>

        <div className="flex justify-between items-center mb-5 px-5">
           <div className="h-6 w-24 bg-[var(--bg-secondary)] rounded animate-pulse" />
        </div>

        <div className="flex flex-col gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 w-full bg-[var(--bg-secondary)] rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </>
  );
}
