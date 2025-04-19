import { Candidate } from '../types/Candidate';

  export const fetchCandidatesByJobOffer = async (jobOfferId: string): Promise<Candidate[]> => {
    try {
      const response = await fetch(`http://localhost:8080/bff/candidates?jobOfferId=${jobOfferId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch candidates');
      }
    
      const text = await response.text();

        if (!text) {
        return [];
        }

        return JSON.parse(text) as Candidate[];
    } catch (error) {
      console.error('Error fetching candidates:', error);
      throw error;
    }
  };

  export const downloadCv = async (cvFilename: string): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:8080/bff/candidates/sas-url?filename=${encodeURIComponent(cvFilename)}`);
      if (!response.ok) throw new Error("Failed to fetch SAS URL");
  
      const data: { url?: string } = await response.json();
  
      if (data.url) {
        window.open(data.url, "_blank", "noopener,noreferrer");
      } else {
        console.error("No URL returned from SAS endpoint");
      }
    } catch (error) {
      console.error("Error fetching SAS URL:", error);
    }
  };

  export const rejectCandidate = async (candidateId: string) => {
    const response = await fetch(`http://localhost:8080/bff/candidates/${candidateId}/reject`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error rejecting candidate: ${response.statusText}`);
    }
    
    return;
  };
  
  export const interviewCandidate = async (candidateId: string) => {
    const response = await fetch(`http://localhost:8080/bff/candidates/${candidateId}/interview`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error setting candidate to interview: ${response.statusText}`);
    }
    
    return;
  };

  export const addCandidate = async (candidate: any): Promise<any> => {
    try {
      const formData = new FormData();
  
      formData.append('id', candidate.id);
      formData.append('personalEmail', candidate.personalEmail);
      formData.append('jobOfferId', candidate.jobOfferId);
      formData.append('cv', candidate.cv);
  
      const response = await fetch('http://localhost:8080/bff/candidates', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: formData
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      return;
    } catch (error) {
      console.error('Error creating candidate:', error);
      throw error;
    }
  };