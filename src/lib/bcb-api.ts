import ipcaData from '../data/ipca-historical.json';
import cdiData from '../data/cdi-historical.json';
import usCpiData from '../data/us-cpi-historical.json';
import euroCpiData from '../data/euro-cpi-historical.json';

interface RateData {
  data: string;
  valor: string;
}

function parseBrazilianDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day);
}

function filterDataByDateRange(
  data: RateData[],
  startDate: string,
  endDate: string
) {
  const start = parseBrazilianDate(startDate);
  const end = parseBrazilianDate(endDate);

  return data
    .filter(item => {
      const itemDate = parseBrazilianDate(item.data);
      return itemDate >= start && itemDate <= end;
    })
    .map(item => ({
      date: parseBrazilianDate(item.data),
      monthlyRate: parseFloat(item.valor)
    }));
}

export const fetchCDIRates = (startDate: string, endDate: string) => {
  try {
    return filterDataByDateRange(cdiData, startDate, endDate);
  } catch (error) {
    console.error('Error fetching CDI rates:', error);
    return [];
  }
};

export const fetchIPCARates = (startDate: string, endDate: string) => {
  try {
    return filterDataByDateRange(ipcaData, startDate, endDate);
  } catch (error) {
    console.error('Error fetching IPCA rates:', error);
    return [];
  }
};

export const fetchUSCPIRates = (startDate: string, endDate: string) => {
  try {
    return filterDataByDateRange(usCpiData, startDate, endDate);
  } catch (error) {
    console.error('Error fetching US CPI rates:', error);
    return [];
  }
};

export const fetchEuroCPIRates = (startDate: string, endDate: string) => {
  try {
    return filterDataByDateRange(euroCpiData, startDate, endDate);
  } catch (error) {
    console.error('Error fetching Euro CPI rates:', error);
    return [];
  }
};