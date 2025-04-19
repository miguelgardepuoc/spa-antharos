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