import { writeFile } from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

interface BCBResponse {
  data: string;
  valor: string;
}

interface FredObservation {
  date: string;
  value: string;
}

interface FredResponse {
  observations: FredObservation[];
}

interface FredErrorResponse {
  error_code?: string;
  error_message?: string;
}

const FRED_API_KEY = process.env.FRED_API_KEY;
if (!FRED_API_KEY) {
  throw new Error('FRED_API_KEY environment variable is not set');
}

type USIndicator = 'us-cpi' | 'us-rate' | 'sp500' | 't-bond';

const indicatorMap: Record<USIndicator, { 
  id: string; 
  name: string;
  frequency?: string; // Frequency parameter for FRED API (m = monthly, d = daily)
  aggregationMethod?: string; // Aggregation method (avg, sum, eop = end of period)
}> = {
  'us-cpi': {
    id: 'CPIAUCNS', // Consumer Price Index for All Urban Consumers
    name: 'Inflação EUA (CPI)',
    frequency: 'm', // Monthly data
  },
  'us-rate': {
    id: 'FEDFUNDS', // Effective Federal Funds Rate
    name: 'Juros EUA (Federal Funds Rate)',
    frequency: 'm', // Monthly data
  },
  'sp500': {
    id: 'SP500', // S&P 500 Index
    name: 'S&P 500',
    frequency: 'm', // Request monthly data
    aggregationMethod: 'eop', // End of period (last value of the month)
  },
  't-bond': {
    id: 'DGS10', // 10-Year Treasury Constant Maturity Rate
    name: 'T-Bond (10-Year Treasury)',
    frequency: 'm', // Request monthly data
    aggregationMethod: 'avg', // Average for the month
  },
};


/**
 * Fetches and transforms FRED data to custom format
 */
async function fetchFredData(indicator: USIndicator): Promise<BCBResponse[]> {
  const { id, frequency, aggregationMethod } = indicatorMap[indicator];
  
  // Build URL with frequency and aggregation parameters if specified
  let url = `https://api.stlouisfed.org/fred/series/observations?series_id=${id}&api_key=${FRED_API_KEY}&file_type=json`;
  
  if (frequency) {
    url += `&frequency=${frequency}`;
  }
  
  if (aggregationMethod) {
    url += `&aggregation_method=${aggregationMethod}`;
  }

  const response = await fetch(url);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`FRED API error (${response.status}): ${errorText}`);
  }

  const json: FredResponse | FredErrorResponse = await response.json();

  // Check if the response has an error
  if ('error_code' in json || 'error_message' in json) {
    const errorResponse = json as FredErrorResponse;
    throw new Error(`FRED API error: ${errorResponse.error_message || 'Unknown error'} (Code: ${errorResponse.error_code || 'N/A'})`);
  }

  // Validate that observations array exists
  if (!('observations' in json) || !Array.isArray(json.observations)) {
    console.error(`Unexpected FRED API response structure for ${indicator} (${id}):`, JSON.stringify(json, null, 2));
    throw new Error(`Invalid response structure: observations array not found. Response: ${JSON.stringify(json)}`);
  }

  const observations: BCBResponse[] = json.observations
    .filter(entry => entry.value !== '.' && entry.value !== '') // Filter out missing values
    .map((entry) => {
      const [year, month, day] = entry.date.split('-');
      return {
        data: `${day}/${month}/${year}`,
        valor: parseFloat(entry.value).toFixed(2),
      };
    });

  // For CPI, calculate period-over-period change
  if (indicator === 'us-cpi') {
    return observations.map((current, index) => {
      if (index === 0) {
        return {
          data: current.data,
          valor: '0.00', // First period has no change
        };
      }

      const previous = observations[index - 1];
      const currentVal = parseFloat(current.valor);
      const previousVal = parseFloat(previous.valor);
      const change = ((currentVal / previousVal) - 1) * 100;
      return {
        data: current.data,
        valor: change.toFixed(2),
      };
    });
  }

  // For S&P 500, calculate monthly variation
  // Data is already monthly from FRED API, so we just need to calculate variation
  if (indicator === 'sp500') {
    return observations.map((current, index) => {
      if (index === 0) {
        return {
          data: current.data,
          valor: '0.00', // First period has no change
        };
      }

      const previous = observations[index - 1];
      const currentVal = parseFloat(current.valor);
      const previousVal = parseFloat(previous.valor);
      const change = ((currentVal / previousVal) - 1) * 100;
      return {
        data: current.data,
        valor: change.toFixed(2),
      };
    });
  }

  // For T-Bond and other indicators, keep original format (already monthly)
  return observations;
}

/**
 * Saves US economic indicators to JSON
 */
async function saveUSIndicator(indicator: USIndicator): Promise<void> {
  try {
    const data = await fetchFredData(indicator);
    const filePath = path.join(process.cwd(), 'src', 'data', `${indicator}-historical.json`);
    await writeFile(filePath, JSON.stringify(data, null, 2));
    console.log(`✅ Dados de ${indicatorMap[indicator].name} salvos em ${filePath}`);
    if (data.length > 0) {
      console.log(`   Total de registros: ${data.length}`);
      console.log(`   Período: ${data[0]?.data} até ${data[data.length - 1]?.data}`);
    }
  } catch (error) {
    console.error(`❌ Erro ao salvar ${indicatorMap[indicator].name}:`, error);
    throw error;
  }
}

async function main() {
  console.log('📥 Buscando indicadores dos EUA via FRED API...\n');
  
  // Indicadores que usam FRED API
  await saveUSIndicator('us-cpi');
  await saveUSIndicator('sp500');
  await saveUSIndicator('t-bond');
  
  console.log('\n✅ Todos os indicadores foram salvos com sucesso!');
}

main().catch(console.error); 