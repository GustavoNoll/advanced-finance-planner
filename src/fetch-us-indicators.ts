import { writeFile } from 'fs/promises';
import path from 'path';

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

const FRED_API_KEY = '846a66a2118140d3613feb646fb36fd2';

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

  return json.observations.map((entry) => {
    const [year, month, day] = entry.date.split('-');
    return {
      data: `${day}/${month}/${year}`,
      valor: parseFloat(entry.value).toFixed(2),
    };
  });
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
  await saveUSIndicator('us-rate');
}

main().catch(console.error); 