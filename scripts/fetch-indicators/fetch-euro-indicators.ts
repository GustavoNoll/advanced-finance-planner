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
 * Fetches raw ECB data (before calculating variations)
 */
async function fetchEcbRawData(indicator: EuroIndicator): Promise<BCBResponse[]> {
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
        valor: parseFloat(String(valor)).toFixed(4),
      };
    });
  } catch (error) {
    console.error(`❌ Error processing ECB data for ${indicatorUrls[indicator].name}:`, error);
    throw error;
  }
}

/**
 * Fetches and transforms ECB data to custom format
 */
async function fetchEcbData(indicator: EuroIndicator): Promise<BCBResponse[]> {
  const rawData = await fetchEcbRawData(indicator);

  // For CPI, calculate period-over-period change
  if (indicator === 'euro-cpi') {
    return rawData.map((current, index) => {
      if (index === 0) {
        return {
          data: current.data,
          valor: '0.00', // First period has no change
        };
      }

      const previous = rawData[index - 1];
      const currentVal = parseFloat(current.valor);
      const previousVal = parseFloat(previous.valor);
      const change = ((currentVal / previousVal) - 1) * 100;
      return {
        data: current.data,
        valor: change.toFixed(4),
      };
    });
  }

  // For other indicators, just format the value
  return rawData;
}

/**
 * Saves Euro indicators to JSON
 */
async function saveEuroIndicator(indicator: EuroIndicator): Promise<void> {
  const variationData = await fetchEcbData(indicator);
  const variationFilePath = path.join(process.cwd(), 'packages', 'shared', 'src', 'data', `${indicator}-historical.json`);
  await writeFile(variationFilePath, JSON.stringify(variationData, null, 2));
  
  // Para CPI, salvar também raw
  if (indicator === 'euro-cpi') {
    const rawData = await fetchEcbRawData(indicator);
    const rawFilePath = path.join(process.cwd(), 'packages', 'shared', 'src', 'data', `${indicator}-raw-historical.json`);
    await writeFile(rawFilePath, JSON.stringify(rawData, null, 2));
    
    console.log(`✅ Dados de ${indicatorUrls[indicator].name} salvos:`);
    console.log(`   Variações: ${variationFilePath}`);
    console.log(`   Valores raw: ${rawFilePath}`);
    if (variationData.length > 0) {
      console.log(`   Total de variações: ${variationData.length}`);
      console.log(`   Total de valores raw: ${rawData.length}`);
      console.log(`   Período: ${variationData[0]?.data} até ${variationData[variationData.length - 1]?.data}`);
    }
  } else {
    console.log(`✅ Dados de ${indicatorUrls[indicator].name} salvos em ${variationFilePath}`);
    if (variationData.length > 0) {
      console.log(`   Total de registros: ${variationData.length}`);
      console.log(`   Período: ${variationData[0]?.data} até ${variationData[variationData.length - 1]?.data}`);
    }
  }
}

async function main() {
  await saveEuroIndicator('euro-cpi');
}

main().catch(console.error);