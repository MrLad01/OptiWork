import React from 'react';
import { Progress } from 'rsuite';

const CustomProgressCircle: React.FC<{ percent: number, width: number, height: number }> = ({ percent, width, height }) => {
  return (
    <div className="flex items-center justify-center bg-slate-50 shadow-md p-3 rounded-full">
      <Progress.Circle
        percent={percent}
        strokeColor="#ffc107" // Customize the color here
        className="rounded-full"
        style={{ width: width, height: height }} // Adjust the size as needed
        showInfo={false}
      />
      <div className="absolute text-center">
        <span className="text-2xl font-bold text-gray-800">{percent}%</span>
      </div>
    </div>
  );
};

export default CustomProgressCircle;
