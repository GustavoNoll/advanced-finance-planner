interface BCBResponse {
  data: string;
  valor: number;
}

function parseBrazilianDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day);
}

export const fetchCDIRates = async (startDate: string, endDate: string) => {
  // BCB API code for CDI is 12456
  const url = `http://api.bcb.gov.br/dados/serie/bcdata.sgs.4391/dados?formato=json&dataInicial=${startDate}&dataFinal=${endDate}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch CDI rates');
    
    const data: BCBResponse[] = await response.json();
    
    // Convert daily rates to monthly rates
    // CDI is given as daily rate, we need to convert it to monthly
    return data.map(item => ({
      date: parseBrazilianDate(item.data),
      // Convert daily rate to monthly (approximately 21 business days)
      monthlyRate: item.valor
    }));
  } catch (error) {
    console.error('Error fetching CDI rates:', error);
    return [];
  }
};

export const fetchIPCARates = async (startDate: string, endDate: string) => {
  // BCB API code for IPCA is 433
  const url = `http://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados?formato=json&dataInicial=${startDate}&dataFinal=${endDate}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch IPCA rates');
    
    const data: BCBResponse[] = await response.json();
    
    return data.map(item => ({
      date: parseBrazilianDate(item.data),
      // IPCA is already monthly, no conversion needed
      monthlyRate: item.valor
    }));
  } catch (error) {
    console.error('Error fetching IPCA rates:', error);
    return [];
  }
};