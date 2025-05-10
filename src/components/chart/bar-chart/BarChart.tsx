import React from 'react';
import '../Charts.css';
import './BarChart.css';

interface BarChartProps {
  data: any[];
  title: string;
  valueKey: 'count' | 'cost';
  formatValue?: (value: number) => string;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  valueKey,
  formatValue = (val) => val.toString(),
}) => {
  const maxValue = Math.max(...data.map((item) => item[valueKey])) * 1.1;

  return (
    <div className="chart-container">
      <h3 className="chart-title">{title}</h3>
      <div className="bar-chart">
        {data.map((item, index) => {
          const barHeight = (item[valueKey] / maxValue) * 100;

          return (
            <div key={index} className="bar-column">
              <div className="bar-label-container">
                <div className="bar-label" style={{ bottom: `calc(${barHeight}% + 5px)` }}>
                  {formatValue(item[valueKey])}
                </div>
              </div>
              <div className="bar-wrapper">
                <div
                  className="bar"
                  style={{
                    height: `${barHeight}%`,
                    backgroundColor: '#4285F4',
                  }}
                ></div>
              </div>
              <div className="bar-month">{item.month}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
