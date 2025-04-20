export interface JobOffer {
  id: string;
  jobTitle: string;
  photoUrl: string;
  minSalary: number;
  maxSalary: number;
}

export interface JobOfferDetail extends JobOffer {
  remote: number;
  description: string;
  requirement: string;
}