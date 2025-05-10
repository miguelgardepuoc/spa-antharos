import apiClient from './apiClient';
import { Candidate } from '../types/candidate';

export const fetchCandidatesByJobOffer = async (jobOfferId: string): Promise<Candidate[]> => {
  try {
    const response = await apiClient.get(`/candidates`, {
      params: { jobOfferId },
    });

    if (!response.data) {
      return [];
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching candidates:', error);
    throw error;
  }
};

export const downloadCv = async (cvFilename: string): Promise<void> => {
  try {
    const response = await apiClient.get(`/candidates/sas-url`, {
      params: { filename: cvFilename },
    });

    if (response.data?.url) {
      window.open(response.data.url, '_blank', 'noopener,noreferrer');
    } else {
      console.error('No URL returned from SAS endpoint');
    }
  } catch (error) {
    console.error('Error fetching SAS URL:', error);
  }
};

export const rejectCandidate = async (candidateId: string): Promise<void> => {
  try {
    await apiClient.patch(`/candidates/${candidateId}/reject`);
  } catch (error) {
    console.error('Error rejecting candidate:', error);
    throw error;
  }
};

export const interviewCandidate = async (candidateId: string): Promise<void> => {
  try {
    await apiClient.patch(`/candidates/${candidateId}/interview`);
  } catch (error) {
    console.error('Error setting candidate to interview:', error);
    throw error;
  }
};

export const addCandidate = async (candidate: any): Promise<void> => {
  try {
    const formData = new FormData();

    formData.append('id', candidate.id);
    formData.append('personalEmail', candidate.personalEmail);
    formData.append('jobOfferId', candidate.jobOfferId);
    formData.append('cv', candidate.cv);

    await apiClient.post('/candidates', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) {
    console.error('Error creating candidate:', error);
    throw error;
  }
};
