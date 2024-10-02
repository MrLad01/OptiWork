
import { useAuth } from "../../context/AuthContext";
import {  formatDate, formatTime, getGreeting } from "../../helper"
import { useEffect, useState } from "react";

export const Addashboard = () => {
  const { user } = useAuth();
  const [currentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="w-full h-[90.2vh] bg-slate-200 rounded-s-2xl px-5 py-4 flex flex-col gap-2">
        <div className=" flex justify-between w-full text-gray-600">
          <div className="font-semibold text-[0.7rem]">
            {formatTime(currentTime)}
          </div>
          <div className="font-bold text-[0.8rem]">
            {formatDate(currentDate)}
          </div>
      </div>
      <div className=" w-full h-[83vh] flex justify-between" >
        <div className="w-[58%] h-full flex flex-col justify-between">
          <div className="w-full h-[8%] flex items-center justify-center border-y-4 border-white rounded-xl p-2">
            <h1 className="text-base font-semibold">{getGreeting(currentTime)}, {user?.first_name} {user?.last_name}</h1>
          </div>
          <div className="w-full h-[22%] flex justify-between">
            <div className="h-full w-[32%] bg-white rounded-md p-3 flex flex-col justify-between ">
              <h3 className="text-xs font-semibold">Number of Pending Tasks</h3>
              <div className="flex justify-end h-full items-center pr-4">
                <div className="flex items-end gap-3">
                  <span className="text-5xl font-medium opacity-80">04</span>
                  <span className="text-2xl font-extralight opacity-15" >/ 10</span>
                </div>
              </div>
            </div>
            <div className="h-full w-[32%] bg-white rounded-md p-3 flex flex-col justify-between ">
              <h3 className="text-xs font-semibold">Number of Tasks in progress</h3>
              <div className="flex justify-end h-full items-center pr-4">
                <div className="flex items-end gap-3">
                  <span className="text-5xl font-medium opacity-80">03</span>
                  <span className="text-2xl font-extralight opacity-15" >/ 10</span>
                </div>
              </div>
            </div>
            <div className="h-full w-[32%] bg-white rounded-md p-3 flex flex-col justify-between ">
             <h3 className="text-xs font-semibold">Number of Tasks completed</h3>
              <div className="flex justify-end h-full items-center pr-4">
                <div className="flex items-end gap-3">
                  <span className="text-5xl font-medium opacity-80">03</span>
                  <span className="text-2xl font-extralight opacity-15" >/ 10</span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-[31%] bg-white rounded-md p-3 flex flex-col gap-2 justify-between">
            <h2 className="text-sm font-medium">Update on the Tasks so far</h2>
            <div className="w-full h-full border-x border-slate-200 overflow-y-scroll rounded-xl p-3"></div>
          </div>
          <div className="w-full h-[31%] bg-white rounded-md p-3 flex flex-col gap-2 justify-between">
            <h2 className="text-sm font-medium">Users Summary</h2>
            <div className="w-full h-full border-x border-slate-200 overflow-y-scroll rounded-xl p-3"></div>
          </div>
        </div>
        <div className="w-[40%] h-full flex flex-col justify-between">
          <div className="w-full h-[49%] bg-white rounded-md p-3 flex flex-col gap-2 justify-between">
            <h2 className="text-[0.905rem] font-medium">Summary on Project target of the week</h2>
            <div className="w-full h-full flex flex-col items-center justify-between pt-2">
              PieChart
              <span className="text-pretty text-center text-xs w-[60%]">Target: Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid soluta placeat suscipit.</span>
            </div>
          </div>
          <div className="w-full h-[49%] bg-white rounded-md p-3 flex flex-col gap-2 justify-between">
          <h2 className="text-[0.905rem] font-medium">Summary of the resources for the week </h2>
            <div className="w-full h-full flex items-center justify-center p-2 border-x border-slate-200 rounded-xl">
              Table
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
