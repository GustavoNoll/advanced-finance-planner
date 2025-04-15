import { writeFile } from 'fs/promises';
import path from 'path';

interface BCBResponse {
  data: string;
  valor: string;
}

interface EcbResponse {
  header: {
    id: string;
    test: boolean;
    prepared: string;
    sender: {
      id: string;
    };
  };
  dataSets: Array<{
    action: string;
    validFrom: string;
    series: {
      [key: string]: {
        attributes: Array<number | null>;
        observations: {
          [key: string]: [number, number, number, null, null | number];
        };
      };
    };
  }>;
  structure: {
    dimensions: {
      observation: Array<{
        values: Array<{
          id: string;
          name: string;
          start: string;
          end: string;
        }>;
      }>;
    };
  };
}

type EuroIndicator = 'euro-cpi' | 'euro-rate';

const indicatorUrls: Record<EuroIndicator, { url: string; name: string }> = {
  'euro-cpi': {
    // HICP - Harmonized Index of Consumer Prices, all items
    url: 'https://data-api.ecb.europa.eu/service/data/ICP/M.U2.N.000000.4.INX?format=jsondata',
    name: 'Inflação Euro (HICP)',
  },
  'euro-rate': {
    // ECB Main Refinancing Operations Rate
    url: 'https://data-api.ecb.europa.eu/service/data/FM/M.U2.EUR.R.R00000.IR3.M?format=jsondata',
    name: 'Juros Euro (Refinancing Rate)',
  },
};

/**
 * Fetches and transforms ECB data to custom format
 */
async function fetchEcbData(indicator: EuroIndicator): Promise<BCBResponse[]> {
  const { url } = indicatorUrls[indicator];
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`ECB API error: ${response.status} ${response.statusText}`);
  }

  const text = await response.text();
  
  if (text.includes('No results found')) {
    console.warn(`⚠️ No data found for ${indicatorUrls[indicator].name}`);
    return [];
  }

  try {
    const json = JSON.parse(text) as EcbResponse;
    const series = json?.dataSets?.[0]?.series;
    const structure = json?.structure?.dimensions?.observation?.[0]?.values;

    if (!series || !structure) {
      throw new Error('Formato inesperado do ECB.');
    }

    const data = series['0:0:0:0:0:0']?.observations ?? {};
    return Object.entries(data).map(([index, [valor]]) => {
      const date = structure[parseInt(index, 10)]?.id; // yyyy-mm
      const [year, month] = date.split('-');
      return {
        data: `01/${month}/${year}`,
        valor: parseFloat(String(valor)).toFixed(2),
      };
    });
  } catch (error) {
    console.error(`❌ Error processing ECB data for ${indicatorUrls[indicator].name}:`, error);
    throw error;
  }
}

/**
 * Saves Euro indicators to JSON
 */
async function saveEuroIndicator(indicator: EuroIndicator): Promise<void> {
  const data = await fetchEcbData(indicator);
  const filePath = path.join(process.cwd(), 'src', 'data', `${indicator}-historical.json`);
  await writeFile(filePath, JSON.stringify(data, null, 2));
  console.log(`✅ Dados de ${indicatorUrls[indicator].name} salvos em ${filePath}`);
}

async function main() {
  await saveEuroIndicator('euro-cpi');
  await saveEuroIndicator('euro-rate');
}

main().catch(console.error);