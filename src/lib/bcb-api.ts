import ipcaData from '../data/ipca-historical.json';
import cdiData from '../data/cdi-historical.json';
import usCpiData from '../data/us-cpi-historical.json';
import euroCpiData from '../data/euro-cpi-historical.json';
import sp500Data from '../data/sp500-historical.json';
import tBondData from '../data/t-bond-historical.json';
import ibovData from '../data/ibov-historical.json';
import goldData from '../data/gold-historical.json';
import btcData from '../data/btc-historical.json';
import irfmData from '../data/irfm-historical.json';
import ifixData from '../data/ifix-historical.json';

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

/**
 * Fetches S&P 500 price data within a date range
 */
export const fetchSP500Prices = (startDate: string, endDate: string) => {
  try {
    return filterDataByDateRange(sp500Data, startDate, endDate);
  } catch (error) {
    console.error('Error fetching S&P 500 prices:', error);
    return [];
  }
};

/**
 * Fetches 10-Year Treasury Bond yield data within a date range
 */
export const fetchTBondPrices = (startDate: string, endDate: string) => {
  try {
    return filterDataByDateRange(tBondData, startDate, endDate);
  } catch (error) {
    console.error('Error fetching T-Bond prices:', error);
    return [];
  }
};

/**
 * Fetches IBOVESPA monthly variation rates within a date range
 * Data is already stored as monthly percentage variations
 */
export const fetchIBOVRates = (startDate: string, endDate: string) => {
  try {
    return filterDataByDateRange(ibovData, startDate, endDate);
  } catch (error) {
    console.error('Error fetching IBOV rates:', error);
    return [];
  }
};

/**
 * Fetches Gold price data within a date range
 */
export const fetchGoldPrices = (startDate: string, endDate: string) => {
  try {
    return filterDataByDateRange(goldData, startDate, endDate);
  } catch (error) {
    console.error('Error fetching Gold prices:', error);
    return [];
  }
};

/**
 * Fetches Bitcoin price data within a date range
 */
export const fetchBTCPrices = (startDate: string, endDate: string) => {
  try {
    return filterDataByDateRange(btcData, startDate, endDate);
  } catch (error) {
    console.error('Error fetching BTC prices:', error);
    return [];
  }
};

/**
 * Fetches IRF-M (Índice de Referência Fiscal Mensal) rates within a date range
 * IRF-M data is already filtered to include only the first day of each month
 */
export const fetchIRFMRates = (startDate: string, endDate: string) => {
  try {
    // Os dados já vêm filtrados com apenas o primeiro dia de cada mês
    return filterDataByDateRange(irfmData, startDate, endDate);
  } catch (error) {
    console.error('Error fetching IRF-M rates:', error);
    return [];
  }
};

/**
 * Fetches IFIX (Índice de Fundos Imobiliários) monthly variation rates within a date range
 * Data is already stored as monthly percentage variations
 */
export const fetchIFIXRates = (startDate: string, endDate: string) => {
  try {
    return filterDataByDateRange(ifixData, startDate, endDate);
  } catch (error) {
    console.error('Error fetching IFIX rates:', error);
    return [];
  }
};