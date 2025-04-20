import { AnalyticsData } from '../types/analytics';

export const fetchAnalyticsData = async (): Promise<AnalyticsData> => {
  // For development, return mock data
  return Promise.resolve(mockAnalyticsData);
  
  // For production, use the actual API
  // try {
  //   const response = await fetch('/api/analytics');
  //   if (!response.ok) {
  //     throw new Error('Failed to fetch analytics data');
  //   }
  //   return await response.json();
  // } catch (error) {
  //   console.error('Error fetching analytics data:', error);
  //   throw error;
  // }
}

export const mockAnalyticsData: AnalyticsData = {
  employeeEvolution: [
    { month: 'Abril', count: 2268, cost: 7800000 },
    { month: 'Junio', count: 3008, cost: 10200000 },
    { month: 'Julio', count: 3099, cost: 10200000 },
    { month: 'Agosto', count: 3099, cost: 10200000 },
    { month: 'Septiembre', count: 3763, cost: 12900000 }
  ],
  departmentDistribution: [
    { name: 'RRHH', percentage: 12, color: '#4285F4' },
    { name: 'Marketing', percentage: 8, color: '#EA4335' },
    { name: 'Finanzas', percentage: 8, color: '#FBBC05' },
    { name: 'Ventas', percentage: 8, color: '#34A853' },
    { name: 'Tecnología', percentage: 64, color: '#8E24AA' }
  ],
  techRolesDistribution: [
    { role: 'Analyst', percentage: 12, color: '#4285F4' },
    { role: 'Product Owner', percentage: 8, color: '#EA4335' },
    { role: 'Tech Lead', percentage: 8, color: '#FBBC05' },
    { role: 'Frontend Developer', percentage: 8, color: '#34A853' },
    { role: 'Backend Developer', percentage: 64, color: '#8E24AA' }
  ]
};