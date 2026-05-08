export default function DashboardLoading() {
  return (
    <div className="p-7 max-w-[1280px] animate-pulse">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="h-7 w-48 bg-[#E2E8F0] rounded-lg mb-2" />
          <div className="h-4 w-32 bg-[#F1F5F9] rounded-lg" />
        </div>
        <div className="h-10 w-36 bg-[#E2E8F0] rounded-xl" />
      </div>
      <div className="grid grid-cols-2 gap-5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#E2E8F0] p-5 h-44" />
        ))}
      </div>
    </div>
  )
}
