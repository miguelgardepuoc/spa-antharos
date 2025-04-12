import { JobOffer, JobOfferDetail } from '../types/JobOffer';

export const fetchJobOffers = async (): Promise<JobOffer[]> => {
  try {
    const response = await fetch('http://localhost:8080/bff/job-offers');
    if (!response.ok) {
      throw new Error('Failed to fetch job offers');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching job offers:', error);
    throw error;
  }
};

export const fetchJobOfferDetail = async (jobOfferId: string): Promise<JobOfferDetail> => {
  try {
    const response = await fetch(`http://localhost:8080/bff/job-offers/${jobOfferId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch job offer details');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching job offer details:', error);
    throw error;
  }
};