import apiClient from './apiClient';
import { AnalyticsData, DashboardApiResponse, EmployeeEvolutionData } from '../types/analytics';

const COLOR_PALETTE = [
  '#4285F4',
  '#EA4335',
  '#FBBC05',
  '#34A853',
  '#8E24AA',
  '#F06292',
  '#FF9800',
  '#009688',
  '#3F51B5',
  '#607D8B',
  '#795548',
  '#9E9E9E',
];

const assignColors = <T extends Record<string, any>>(items: T[]): (T & { color: string })[] => {
  return items.map((item, index) => ({
    ...item,
    color: COLOR_PALETTE[index % COLOR_PALETTE.length],
  }));
};

const mergeEmployeeAndSalaryData = (
  employeeCounts: DashboardApiResponse['employeeCounts'],
  salaryCosts: DashboardApiResponse['salaryCosts']
): EmployeeEvolutionData[] => {
  const salaryMap = new Map(salaryCosts.map((item) => [item.month, item.totalSalary]));

  const sortedCounts = [...employeeCounts].sort(
    (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
  );

  return sortedCounts.map((item) => {
    const date = new Date(item.month);
    const monthName = date.toLocaleString('default', { month: 'long' });

    return {
      month: monthName,
      count: item.totalEmployees,
      cost: salaryMap.get(item.month) ?? 0,
    };
  });
};

const transformApiResponse = (apiData: DashboardApiResponse): AnalyticsData => {
  const employeeEvolution = mergeEmployeeAndSalaryData(apiData.employeeCounts, apiData.salaryCosts);

  const departmentDistribution = assignColors(
    apiData.departmentEmployees.map((dept) => ({
      name: dept.department,
      percentage: dept.percentage,
    }))
  );

  const departmentCostDistribution = assignColors(
    apiData.departmentSalaries.map((dept) => ({
      name: dept.department,
      percentage: dept.percentage,
    }))
  );

  const techRolesDistribution = assignColors(
    apiData.jobTitleEmployees.map((job) => ({
      name: job.jobTitle,
      percentage: job.percentage,
    }))
  );

  return {
    employeeEvolution,
    departmentDistribution,
    departmentCostDistribution,
    techRolesDistribution,
  };
};

export const fetchAnalyticsData = async (): Promise<AnalyticsData> => {
  const response = await apiClient.get('/reports/dashboard');
  if (!response.data) {
    throw new Error('No data received from API');
  }

  return transformApiResponse(response.data);
};
