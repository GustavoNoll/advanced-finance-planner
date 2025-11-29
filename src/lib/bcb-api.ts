import ipcaData from '../data/ipca-historical.json';
import cdiData from '../data/cdi-historical.json';
import usCpiData from '../data/us-cpi-historical.json';
import euroCpiData from '../data/euro-cpi-historical.json';
import sp500Data from '../data/sp500-historical.json';
import tBondData from '../data/t-bond-historical.json';
import ibovData from '../data/ibov-historical.json';
import goldData from '../data/gold-historical.json';
import btcData from '../data/btc-historical.json';
import irfmRawData from '../data/irfm-raw-historical.json';
import ptaxRawData from '../data/ptax-raw-historical.json';
import ihfaRawData from '../data/ihfa-raw-historical.json';
import imabRawData from '../data/imab-raw-historical.json';
import agggData from '../data/aggg-historical.json';
import msciAcwiData from '../data/msci-acwi-historical.json';

interface RateData {
  data: string;
  valor: string;
}

/**
 * Tipo de indicador para conversão de moeda
 */
export type IndicatorCurrency = 'BRL' | 'USD' | 'INDEX'

/**
 * Configuração de moeda e conversão para cada indicador
 */
export interface IndicatorConfig {
  rawCurrency: IndicatorCurrency // Moeda do valor raw
  variationCurrency: IndicatorCurrency // Moeda da variação (pode ser INDEX se não precisa ajuste FX)
  needsFXAdjustment: boolean // Se precisa ajuste de FX nas porcentagens
}

/**
 * Configuração centralizada de moedas para todos os indicadores
 */
export const INDICATOR_CURRENCY_CONFIG: Record<string, IndicatorConfig> = {
  // Indicadores brasileiros em BRL
  ptax: {
    rawCurrency: 'BRL',
    variationCurrency: 'INDEX', // PTAX é variação cambial, não precisa ajuste
    needsFXAdjustment: false
  },
  cdi: {
    rawCurrency: 'INDEX',
    variationCurrency: 'INDEX',
    needsFXAdjustment: false
  },
  ipca: {
    rawCurrency: 'INDEX',
    variationCurrency: 'INDEX',
    needsFXAdjustment: false
  },
  ibov: {
    rawCurrency: 'INDEX',
    variationCurrency: 'INDEX',
    needsFXAdjustment: false
  },
  ihfa: {
    rawCurrency: 'INDEX',
    variationCurrency: 'INDEX',
    needsFXAdjustment: false
  },
  irfm: {
    rawCurrency: 'INDEX',
    variationCurrency: 'INDEX',
    needsFXAdjustment: false
  },
  imab: {
    rawCurrency: 'INDEX',
    variationCurrency: 'INDEX',
    needsFXAdjustment: false
  },
  
  // Indicadores em USD
  sp500: {
    rawCurrency: 'USD',
    variationCurrency: 'USD',
    needsFXAdjustment: true
  },
  gold: {
    rawCurrency: 'USD',
    variationCurrency: 'USD',
    needsFXAdjustment: true
  },
  btc: {
    rawCurrency: 'USD',
    variationCurrency: 'USD',
    needsFXAdjustment: true
  },
  tBond: {
    rawCurrency: 'INDEX',
    variationCurrency: 'INDEX',
    needsFXAdjustment: false
  },
  
  // Índices de inflação (não precisam conversão)
  usCpi: {
    rawCurrency: 'INDEX',
    variationCurrency: 'INDEX',
    needsFXAdjustment: false
  },
  euroCpi: {
    rawCurrency: 'INDEX',
    variationCurrency: 'INDEX',
    needsFXAdjustment: false
  },
  // Novos indicadores
  aggg: {
    rawCurrency: 'USD',
    variationCurrency: 'USD',
    needsFXAdjustment: true
  },
  msciacwi: {
    rawCurrency: 'USD',
    variationCurrency: 'USD',
    needsFXAdjustment: true
  }
}

/**
 * Obtém a configuração de moeda de um indicador
 */
export function getIndicatorCurrencyConfig(indicatorName: string): IndicatorConfig | null {
  return INDICATOR_CURRENCY_CONFIG[indicatorName.toLowerCase()] || null
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

/**
 * Filtra dados por intervalo de datas e calcula variações mensais a partir de valores raw
 * Útil para índices que vêm como valores absolutos e precisam ter variações calculadas
 * Inclui o mês anterior ao intervalo para poder calcular a primeira variação
 */
function filterDataByDateRangeWithVariation(
  data: RateData[],
  startDate: string,
  endDate: string
) {
  const start = parseBrazilianDate(startDate);
  const end = parseBrazilianDate(endDate);

  // Calcular o mês anterior ao início para poder calcular a primeira variação
  const previousMonth = new Date(start);
  previousMonth.setMonth(previousMonth.getMonth() - 1);

  // Filtrar dados incluindo o mês anterior e ordenar
  const allData = data
    .map(item => ({
      date: parseBrazilianDate(item.data),
      value: parseFloat(item.valor)
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  // Encontrar o índice do primeiro mês que precisamos (mês anterior ao início)
  let startIndex = 0
  for (let i = 0; i < allData.length; i++) {
    if (allData[i].date >= previousMonth) {
      startIndex = Math.max(0, i - 1) // Incluir o mês anterior se existir
      break
    }
  }

  // Filtrar dados do mês anterior até o fim do intervalo
  const filteredData = allData
    .slice(startIndex)
    .filter(item => item.date <= end);

  if (filteredData.length < 2) {
    return [];
  }

  // Calcular variações mensais apenas para os meses dentro do intervalo solicitado
  const variations: Array<{ date: Date; monthlyRate: number }> = [];
  
  for (let i = 1; i < filteredData.length; i++) {
    const current = filteredData[i];
    const previous = filteredData[i - 1];
    
    // Só incluir variações para meses dentro do intervalo solicitado
    if (current.date >= start && current.date <= end && previous.value > 0) {
      const variation = ((current.value - previous.value) / previous.value) * 100;
      variations.push({
        date: current.date,
        monthlyRate: variation
      });
    }
  }

  return variations;
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
 * Fetches IRF-M (Brazilian fixed-rate bond index) monthly rates within a date range
 * Calculates monthly variations from raw index values
 */
export const fetchIRFMRates = (startDate: string, endDate: string) => {
  try {
    return filterDataByDateRangeWithVariation(irfmRawData as RateData[], startDate, endDate);
  } catch (error) {
    console.error('Error fetching IRF-M rates:', error);
    return [];
  }
};

/**
 * Fetches IMAB (Brazilian bond index) monthly rates within a date range
 * Calculates monthly variations from raw index values
 */
export const fetchIMABRates = (startDate: string, endDate: string) => {
  try {
    return filterDataByDateRangeWithVariation(imabRawData as RateData[], startDate, endDate);
  } catch (error) {
    console.error('Error fetching IMAB rates:', error);
    return [];
  }
};

/**
 * Fetches IHFA (Brazilian hedge fund index) raw values within a date range
 * Returns the index values (not variations)
 */
export const fetchIHFARates = (startDate: string, endDate: string) => {
  try {
    return filterDataByDateRange(ihfaRawData as RateData[], startDate, endDate);
  } catch (error) {
    console.error('Error fetching IHFA rates:', error);
    return [];
  }
};

/**
 * Fetches IFIX (Brazilian real estate index) monthly rates within a date range
 * Note: IFIX data may not be available, returns empty array if not found
 */
export const fetchIFIXRates = (startDate: string, endDate: string) => {
  try {
    // IFIX data file doesn't exist yet, return empty array
    // This can be implemented when IFIX data becomes available
    return [];
  } catch (error) {
    console.error('Error fetching IFIX rates:', error);
    return [];
  }
};

/**
 * Fetches AGGG (iShares Global Aggregate Bond ETF) price data within a date range
 * Uses AGGG.L symbol from Yahoo Finance
 */
export const fetchAGGGPrices = (startDate: string, endDate: string) => {
  try {
    if (!agggData || (Array.isArray(agggData) && agggData.length === 0)) {
      console.warn('AGGG data not available yet. Run fetch-yahoo-finance.ts to generate the data file.');
      return [];
    }
    return filterDataByDateRange(agggData as RateData[], startDate, endDate);
  } catch (error) {
    console.error('Error fetching AGGG prices:', error);
    return [];
  }
};

/**
 * Fetches MSCI ACWI (Vanguard Total World Stock ETF) price data within a date range
 * Uses VT symbol from Yahoo Finance, but represents MSCI ACWI index
 */
export const fetchMSCIPrices = (startDate: string, endDate: string) => {
  try {
    if (!msciAcwiData || (Array.isArray(msciAcwiData) && msciAcwiData.length === 0)) {
      console.warn('MSCI ACWI data not available yet. Run fetch-yahoo-finance.ts to generate the data file.');
      return [];
    }
    return filterDataByDateRange(msciAcwiData as RateData[], startDate, endDate);
  } catch (error) {
    console.error('Error fetching MSCI ACWI prices:', error);
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