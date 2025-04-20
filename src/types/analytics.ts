export interface EmployeeData {
    month: string;
    count: number;
    cost: number;
  }
  
  export interface DepartmentData {
    name: string;
    percentage: number;
    color: string;
  }
  
  export interface TechRoleData {
    role: string;
    percentage: number;
    color: string;
  }
  
  export interface AnalyticsData {
    employeeEvolution: EmployeeData[];
    departmentDistribution: DepartmentData[];
    techRolesDistribution: TechRoleData[];
  }