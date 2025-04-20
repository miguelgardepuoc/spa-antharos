export interface Candidate {
    id: string;
    fullName: string | null;
    personalEmail: string;
    status: 'APPLIED' | 'INTERVIEWING' | 'HIRED' | 'REJECTED';
    cvFilename: string | null;
    jobOfferId: string;
  }

export interface HireCandidateData {
  dni: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  salary: string;
  departmentId: string;
  startDate: string;
}