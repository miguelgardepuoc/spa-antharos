import React from 'react';
import '../Charts.css';
import './PieChart.css';

interface PieChartItem {
  name: string;
  percentage: number;
  color: string;
}

interface PieSlice {
  path: string;
  color: string;
}

interface PieChartProps {
  data: PieChartItem[];
  title: string;
}

export const PieChart: React.FC<PieChartProps> = ({ data, title }) => {
  const sortedData = [...data].sort((a, b) => b.percentage - a.percentage);

  const calculateSlices = (): PieSlice[] => {
    const slices: PieSlice[] = [];
    let cumulativePercentage = 0;

    data.forEach((item) => {
      const startAngle = (cumulativePercentage / 100) * 2 * Math.PI;
      cumulativePercentage += item.percentage;
      const endAngle = (cumulativePercentage / 100) * 2 * Math.PI;

      const radius = 100;
      const centerX = 100;
      const centerY = 100;

      const largeArcFlag = item.percentage > 50 ? 1 : 0;

      const startX = centerX + radius * Math.cos(startAngle - Math.PI / 2);
      const startY = centerY + radius * Math.sin(startAngle - Math.PI / 2);
      const endX = centerX + radius * Math.cos(endAngle - Math.PI / 2);
      const endY = centerY + radius * Math.sin(endAngle - Math.PI / 2);

      const path = `
        M ${centerX},${centerY}
        L ${startX},${startY}
        A ${radius},${radius} 0 ${largeArcFlag} 1 ${endX},${endY}
        Z
      `;

      slices.push({ path, color: item.color });
    });

    return slices;
  };

  const slices = calculateSlices();

  return (
    <div className="chart-container">
      <h3 className="chart-title">{title}</h3>
      <div className="pie-chart-container">
        <div className="pie-chart">
          <svg width="200" height="200" viewBox="0 0 200 200">
            {slices.map((slice, index) => (
              <path key={index} d={slice.path} fill={slice.color} />
            ))}
          </svg>
        </div>
        <div className="pie-legend">
          {sortedData.map((item, index) => (
            <div key={index} className="legend-item">
              <div className="legend-color" style={{ backgroundColor: item.color }}></div>
              <div className="legend-name">{item.name}</div>
              <div className="legend-percentage">{item.percentage}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
