import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import UserStackedColumn from '../../components/UserStackedColumn';
import ResourceUtilizationChart from '../../components/ResourceUtilizationChart';
import TimeComparisonChart from '../../components/TimeComparison';



const UserReport: React.FC = () => {
  const { user, KPI } = useAuth();
  const [selectedYear, setSelectedYear] = useState<number>();

  const years = [2023, 2024, 2025]
  
  return (
    <div className="w-full h-[89vh] bg-slate-200 rounded-s-2xl px-5 py-4 flex flex-col gap-4">
      <div className="w-full flex justify-between">
        <h2 className="font-semibold">Showing previous data from {new Date().toLocaleDateString()}</h2>
      </div>
      <div className="w-full h-full flex flex-col gap-4">
        <div className="w-full h-[24%] flex gap-4 justify-around">
          <div className="w-full h-full bg-white rounded-md flex items-center justify-center">
            <div className=" flex flex-col gap-2">
              <h3 className="text-xs">Task Completion Rate</h3>
              <p className="text-3xl font-semibold text-center">{ KPI?.taskCompletionRate}%</p>
            </div>
          </div>
          <div className="w-full h-full bg-white rounded-md flex items-center justify-center">
            <div className=" flex flex-col gap-2">
              <h3 className="text-xs">Resource Utilization Rate</h3>
              <p className="text-3xl font-semibold text-center">{ KPI?.resourceUtilizationRate}%</p>
            </div>
          </div>
          <div className="w-full h-full bg-white rounded-md flex items-center justify-center">
            <div className=" flex flex-col gap-2">
              <h3 className="text-xs">Task Efficiency</h3>
              <p className="text-3xl font-semibold text-center"> {  KPI?.taskEfficiency }%</p>
            </div>
          </div>
          <div className="w-full h-full bg-white rounded-md flex items-center justify-center">
            <div className=" flex flex-col gap-2">
              <h3 className="text-xs">Task Overdue Rate</h3>
              <p className="text-3xl font-semibold text-center">{KPI?.taskOverdueRate}%</p>
            </div>
          </div>
        </div>
        <div className="w-full h-full rounded-md flex justify-between">
          <div className="h-full w-[55%] bg-white rounded-md p-4 text-xs">
            {/* <h1>User Task Analysis</h1> */}
            <select onChange={(e) => setSelectedYear(parseFloat(e.target.value))}>
              <option value=''>--</option>
              {years.map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
            </select>
              {user ? (
                <UserStackedColumn user={user} selectedYear={selectedYear} />
              ) : (
                <p>Loading...</p>
              )}
          </div>
          <div className="h-full w-[42%] rounded-md flex flex-col justify-between">
            <div className="h-[48%] w-full bg-white rounded-md p-4">
              {user && <ResourceUtilizationChart user={user} />}
            </div>
            <div className="h-[48%] w-full border bg-white rounded-md p-4">
              {user && <TimeComparisonChart user={user} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserReport;
