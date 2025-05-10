export interface Candidate {
  id: string;
  fullName: string | null;
  personalEmail: string;
  status: 'APPLIED' | 'INTERVIEWING' | 'HIRED' | 'REJECTED';
  cvFilename: string | null;
  jobOfferId: string;
}
