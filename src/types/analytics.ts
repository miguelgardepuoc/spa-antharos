export interface EmployeeCountData {
  month: string;
  totalEmployees: number;
}

export interface SalaryCostData {
  month: string;
  totalSalary: number;
}

export interface EmployeeEvolutionData {
  month: string;
  count: number;
  cost: number;
}

export interface DepartmentEmployeeData {
  department: string;
  percentage: number;
}

export interface DepartmentSalaryData {
  department: string;
  percentage: number;
}

export interface DepartmentData {
  name: string;
  percentage: number;
  color: string;
}

export interface JobTitleData {
  jobTitle: string;
  percentage: number;
}

export interface TechRoleData {
  name: string;
  percentage: number;
  color: string;
}

export interface DashboardApiResponse {
  employeeCounts: EmployeeCountData[];
  salaryCosts: SalaryCostData[];
  departmentEmployees: DepartmentEmployeeData[];
  departmentSalaries: DepartmentSalaryData[];
  jobTitleEmployees: JobTitleData[];
}

export interface AnalyticsData {
  employeeEvolution: EmployeeEvolutionData[];
  departmentDistribution: DepartmentData[];
  departmentCostDistribution: DepartmentData[];
  techRolesDistribution: TechRoleData[];
}