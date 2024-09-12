import { ArrowCircleDown2, Calendar } from "iconsax-react"

export const UserReport1 = () => {
    return (
      <div className="w-full h-[89vh] bg-slate-200 rounded-s-2xl px-5 py-4 flex flex-col gap-4">
        <div className="w-full flex justify-between">
          <h2 className="font-semibold">Showing previous data from </h2>
          <div className="flex gap-5 text-sm">
            <button className="px-3 py-1 flex gap-2 border border-black rounded-md font-normal items-center">
              <span>Date - Date</span>
              <div>
               <Calendar size="16" />
              </div>
            </button>
            <button className="px-3 py-1 flex gap-1 items-center border border-black rounded-md font-normal">
              <div>
                <ArrowCircleDown2 size="16" />
              </div>
              <span>
                Download Reports
              </span>
            </button>
          </div>
        </div>
        <div className="w-full h-full flex flex-col gap-4">
          <div className="w-full h-[24%] flex gap-4 justify-around">
            <div className="w-full h-full bg-white rounded-md"></div>
            <div className="w-full h-full bg-white rounded-md"></div>
            <div className="w-full h-full bg-white rounded-md"></div>
            <div className="w-full h-full bg-white rounded-md"></div>
          </div>
          <div className="w-full h-full rounded-md flex justify-between">
            <div className="h-full w-[55%] bg-white rounded-md"></div>
            <div className="h-full w-[42%] rounded-md flex flex-col justify-between">
              <div className="h-[48%] w-full bg-white rounded-md "></div>
              <div className="h-[48%] w-full bg-white rounded-md "></div>
            </div>
          </div>
        </div>
      </div>
    )
  }