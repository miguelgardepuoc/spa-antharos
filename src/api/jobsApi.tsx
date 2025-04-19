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

export const createJobOffer = async (jobData: any): Promise<any> => {
  try {
    const response = await fetch('http://localhost:8080/bff/job-offers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(jobData)
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return;
  } catch (error) {
    console.error('Error creating job offer:', error);
    throw error;
  }
};

export const modifyJobOffer = async (jobData: any): Promise<any> => {
  try {
    const response = await fetch('http://localhost:8080/bff/job-offers', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(jobData)
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return;
  } catch (error) {
    console.error('Error creating job offer:', error);
    throw error;
  }
};

export const deleteJobOffer = async (jobOfferId: string): Promise<void> => {  
  const response = await fetch(`http://localhost:8080/bff/job-offers/${jobOfferId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    }
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error removing job offer');
  }
};