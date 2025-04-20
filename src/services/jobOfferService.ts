import apiClient from './apiClient';
import { JobOffer, JobOfferDetail } from '../types/JobOffer';

export const fetchJobOffers = async (): Promise<JobOffer[]> => {
  try {
    const response = await apiClient.get('/job-offers');
    return response.data;
  } catch (error) {
    console.error('Error fetching job offers:', error);
    throw error;
  }
};

export const fetchJobOfferDetail = async (jobOfferId: string): Promise<JobOfferDetail> => {
  try {
    const response = await apiClient.get(`/job-offers/${jobOfferId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching job offer details:', error);
    throw error;
  }
};

export const createJobOffer = async (jobData: any): Promise<void> => {
  try {
    await apiClient.post('/job-offers', jobData);
  } catch (error) {
    console.error('Error creating job offer:', error);
    throw error;
  }
};

export const modifyJobOffer = async (jobData: any): Promise<void> => {
  try {
    await apiClient.put('/job-offers', jobData);
  } catch (error) {
    console.error('Error updating job offer:', error);
    throw error;
  }
};

export const deleteJobOffer = async (jobOfferId: string): Promise<void> => {
  try {
    await apiClient.delete(`/job-offers/${jobOfferId}`);
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Error removing job offer');
  }
};