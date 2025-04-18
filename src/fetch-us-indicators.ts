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

const FRED_API_KEY = process.env.FRED_API_KEY;
if (!FRED_API_KEY) {
  throw new Error('FRED_API_KEY environment variable is not set');
}

type USIndicator = 'us-cpi' | 'us-rate';

const indicatorMap: Record<USIndicator, { id: string; name: string }> = {
  'us-cpi': {
    id: 'CPIAUCNS', // Consumer Price Index for All Urban Consumers
    name: 'Inflação EUA (CPI)',
  },
  'us-rate': {
    id: 'FEDFUNDS', // Effective Federal Funds Rate
    name: 'Juros EUA (Federal Funds Rate)',
  },
};

/**
 * Fetches and transforms FRED data to custom format
 */
async function fetchFredData(indicator: USIndicator): Promise<BCBResponse[]> {
  const { id } = indicatorMap[indicator];
  const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${id}&api_key=${FRED_API_KEY}&file_type=json`;

  const response = await fetch(url);
  const json: FredResponse = await response.json();

  const observations = json.observations.map((entry) => {
    const [year, month, day] = entry.date.split('-');
    return {
      data: `${day}/${month}/${year}`,
      valor: parseFloat(entry.value),
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
      const change = ((current.valor / previous.valor) - 1) * 100;
      return {
        data: current.data,
        valor: change.toFixed(2),
      };
    });
  }

  // For other indicators, keep original format
  return observations.map(entry => ({
    data: entry.data,
    valor: entry.valor.toFixed(2),
  }));
}

/**
 * Saves US economic indicators to JSON
 */
async function saveUSIndicator(indicator: USIndicator): Promise<void> {
  const data = await fetchFredData(indicator);
  const filePath = path.join(process.cwd(), 'src', 'data', `${indicator}-historical.json`);
  await writeFile(filePath, JSON.stringify(data, null, 2));
  console.log(`✅ Dados de ${indicatorMap[indicator].name} salvos em ${filePath}`);
}

async function main() {
  await saveUSIndicator('us-cpi');
}

main().catch(console.error); 