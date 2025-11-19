import ipcaData from '../data/ipca-historical.json';
import cdiData from '../data/cdi-historical.json';
import usCpiData from '../data/us-cpi-historical.json';
import euroCpiData from '../data/euro-cpi-historical.json';
import sp500Data from '../data/sp500-historical.json';
import tBondData from '../data/t-bond-historical.json';
import ibovData from '../data/ibov-historical.json';
import goldData from '../data/gold-historical.json';
import btcData from '../data/btc-historical.json';
import ptaxRawData from '../data/ptax-raw-historical.json';

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
 * Processa dados históricos de PTAX e retorna função para buscar cotação por competência
 * @returns Função que recebe competência (MM/YYYY) e retorna cotação ou null
 */
export const getPTAXByCompetencia = (): ((competencia: string) => number | null) => {
  try {
    // Agrupar cotações por competência (MM/YYYY) e pegar o último dia útil do mês
    const competenciaMap = new Map<string, { cotacao: number; date: Date }>()

    ;(ptaxRawData as RateData[]).forEach((item) => {
      const itemDate = parseBrazilianDate(item.data)
      const month = String(itemDate.getMonth() + 1).padStart(2, '0')
      const year = itemDate.getFullYear()
      const competencia = `${month}/${year}`
      
      const cotacao = parseFloat(item.valor) || 0

      // Guardar apenas se não existe ou se a data é mais recente (último dia do mês)
      const existing = competenciaMap.get(competencia)
      if (!existing || itemDate > existing.date) {
        competenciaMap.set(competencia, { cotacao, date: itemDate })
      }
    })

    // Criar map final apenas com cotações
    const cotacaoMap = new Map<string, number>()
    competenciaMap.forEach(({ cotacao }, competencia) => {
      cotacaoMap.set(competencia, cotacao)
    })

    // Retornar função que busca cotação por competência
    return (competencia: string): number | null => {
      // Try exact match first
      const found = cotacaoMap.get(competencia)
      if (found !== undefined) {
        return found
      }

      // If not found, try to find nearest previous competencia
      const [mes, ano] = competencia.split('/').map(Number)
      const requestedDate = new Date(ano, mes - 1, 1)
      
      const sortedCompetencias = Array.from(cotacaoMap.entries())
        .map(([comp, cotacao]) => {
          const [mesItem, anoItem] = comp.split('/').map(Number)
          return {
            competencia: comp,
            cotacao,
            date: new Date(anoItem, mesItem - 1, 1)
          }
        })
        .sort((a, b) => b.date.getTime() - a.date.getTime())

      const nearest = sortedCompetencias.find(item => item.date <= requestedDate)

      if (nearest) {
        console.log(`⚠️ PTAX not found for ${competencia}, using nearest previous: ${nearest.competencia} = ${nearest.cotacao}`)
        return nearest.cotacao
      }

      console.error(`❌ No PTAX data available for ${competencia} or any previous date`)
      return null
    }
  } catch (error) {
    console.error('Error processing PTAX data:', error)
    return () => null
  }
}