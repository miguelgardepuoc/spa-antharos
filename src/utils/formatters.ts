export const formatSalaryValue = (value: number): string => {
    if (value >= 1000) {
      return `${Math.floor(value / 1000)}K`;
    }
    return value.toString();
  };
  
  export const formatSalaryRange = (min: number, max: number): string => {
    return `${formatSalaryValue(min)} - ${formatSalaryValue(max)} €`;
  };
  
  export const validateEmail = (email: string): boolean => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };
  
  export const getCandidateStatusText = (status: string): string => {
    switch (status) {
      case 'APPLIED':
        return 'Inscrito';
      case 'INTERVIEWING':
        return 'Entrevistando';
      case 'HIRED':
        return 'Contratado';
      case 'REJECTED':
        return 'Rechazado';
      default:
        return status;
    }
  };