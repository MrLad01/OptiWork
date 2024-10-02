import CustomProgressCircle from "../../../components/CustomProgressCircle";



export const ProjectDetails = () => {


  return (
    <div className="w-full h-full flex justify-between items-center">
      <div className="h-full w-[60%] relative bg-white p-3 flex  rounded-md ">
          <div className=" w-full h-full flex flex-col gap-6 px-2 py-12 ">
            <div className="flex flex-col border shadow-md hover:scale-105 cursor-pointer w-[22rem] p-3 rounded-md">
              <span className="font-semibold" >Project Name: </span>
              <p className="max-w-[20.5rem] text-[0.9rem] font-extralight">Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus nostrum assumenda ab!</p>
            </div>
            <div className="flex flex-col border shadow-md hover:scale-105 cursor-pointer w-[22rem] p-3 rounded-md">
              <span className="font-semibold" >Project Start Time: </span>
              <p className="max-w-[20.5rem] text-[0.9rem] font-extralight">Wednesday, October 2, 2024 12:00AM</p>
            </div>
            <div className="flex flex-col border shadow-md hover:scale-105 cursor-pointer w-[22rem] p-3 rounded-md">
              <span className="font-semibold" >Project End Time: </span>
              <p className="max-w-[20.5rem] text-[0.9rem] font-extralight">Wednesday, October 9, 2024 12:00AM</p>
            </div>
            <div className="flex flex-col border shadow-md hover:scale-105 cursor-pointer p-3 rounded-md">
              <span className="font-semibold" >Project Target: </span>
              <p className="max-w-[40rem] text-[0.9rem] font-extralight">Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus nostrum assumenda ab!</p>
            </div>
          </div>
          <div className=" w-[44%] h-[44%] absolute right-2 top-20 flex items-center justify-center">
            <div className="">
              <CustomProgressCircle percent={30} />
            </div>
          </div>
      </div>
      <div className="h-full w-[38%] flex flex-col justify-between">
        <div className="w-full h-[48%] bg-white rounded-md"></div>
        <div className="w-full h-[48%] bg-white rounded-md"></div>
      </div>
    </div>
  )
}
