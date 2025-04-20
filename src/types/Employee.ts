export interface Employee {
    id: string;
    employeeNumber: number;
    fullName: string;
    salary: number;
    dni: string;
    jobTitle: string;
    hiringDate: string;
    department: string;
    status: EmployeeStatus;
  }


  export type EmployeeStatus = 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED' | 'INACTIVE';