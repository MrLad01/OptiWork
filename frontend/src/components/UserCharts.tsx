import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts'; // Import ApexOptions for typing

// Define the interface for props
interface UserChartsProps {
  series: number[]; // Expecting an array of numbers for the series prop
}

const UserCharts: React.FC<UserChartsProps> = ({ series }) => {
  const options: ApexOptions = {
    chart: {
      type: 'radialBar',
      offsetY: -20,
      height: 450, // Set the desired height here
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: '#e7e7e7',
          strokeWidth: '97%',
          margin: 5, // margin is in pixels
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            color: '#d3d3d3',
            opacity: 1,
            blur: 2,
          },
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            offsetY: -2,
            fontSize: '18px',
          },
        },
      },
    },
    grid: {
      padding: {
        top: -10,
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        shadeIntensity: 0.4,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 53, 91],
      },
    },
    labels: ['Average Results'],
  };

  return (
    <div>
      <div id="chart">
        <ReactApexChart options={options} series={series} type="radialBar" height={450} />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default UserCharts;
