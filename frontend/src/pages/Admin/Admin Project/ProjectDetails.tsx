import { useEffect, useState } from "react";
import CustomProgressCircle from "../../../components/CustomProgressCircle";
import { Task, useAuth } from "../../../context/AuthContext";
import { formatDate } from "../../../helper";
import {  Task1, TaskTimeline } from "../../../components/TaskTimeline";
import axios from "axios";





export const ProjectDetails = () => {
  const { user, latestProject } = useAuth();
  const tasks = latestProject !== null ? latestProject.tasks : [];
  const [ tasks1, setTasks1 ] = useState<Task1[]>();

  const completedTasksCount = tasks.filter(task => task.status === 'Completed').length;
  const projectPercent = completedTasksCount / tasks.length;

  useEffect(() => {
      const FetchTasks = async() => {
          try {
            const response = await axios.post('/api/tasks/latestProjectTarget');
            setTasks1(response.data.latestProject.tasks);
          } catch (error) {
            console.error('failed to fetch:', error);
          }
      }
      FetchTasks();
  }, [])

  return (
    <div className="w-full h-full flex justify-between items-center">
      <div className="h-full w-[60%] relative bg-white p-3 flex  rounded-md ">
          <div className=" w-full h-full flex flex-col gap-6 px-2 py-12 ">
            <div className="flex flex-col border shadow-md hover:scale-105 cursor-pointer w-[22rem] p-3 rounded-md">
              <span className="font-semibold" >Project Name: </span>
              <p className="max-w-[20.5rem] text-[0.9rem] font-extralight">{ latestProject?.target_name }</p>
            </div>
            <div className="flex flex-col border shadow-md hover:scale-105 cursor-pointer w-[22rem] p-3 rounded-md">
              <span className="font-semibold" >Project Start Time: </span>
              <p className="max-w-[20.5rem] text-[0.9rem] font-extralight">{ latestProject?.start_date !== undefined && formatDate(latestProject?.start_date) }</p>
            </div>
            <div className="flex flex-col border shadow-md hover:scale-105 cursor-pointer w-[22rem] p-3 rounded-md">
              <span className="font-semibold" >Project End Time: </span>
              <p className="max-w-[20.5rem] text-[0.9rem] font-extralight">{ latestProject?.end_date !== undefined && formatDate(latestProject.end_date) }</p>
            </div>
            <div className="flex flex-col border shadow-md hover:scale-105 cursor-pointer p-3 rounded-md">
              <span className="font-semibold" >Project Target: </span>
              <p className="max-w-[40rem] text-[0.9rem] font-extralight">{ latestProject?.description }</p>
            </div>
          </div>
          <div className=" w-[44%] h-[44%] absolute right-2 top-20 flex items-center justify-center">
            <div className="">
              <CustomProgressCircle percent={projectPercent} width={180} height={180} />
            </div>
          </div>
      </div>
      <div className="h-full w-[38%] flex flex-col justify-between">
        <div className="w-full h-[48%] bg-white rounded-md overflow-y-scroll">
          <TaskTimeline tasks={tasks1 !== undefined ? tasks1 : []} />
        </div>
        <div className="w-full h-[48%] bg-white rounded-md"></div>
      </div>
    </div>
  )
}
