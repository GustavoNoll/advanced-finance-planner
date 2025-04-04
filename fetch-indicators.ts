import { writeFile } from 'fs/promises';
import path from 'path';

interface BCBResponse {
  valor: string;
  data: string;
}

/**
 * Fetches data from BCB API
 */
async function fetchData(url: string): Promise<BCBResponse[]> {
  const response = await fetch(url);
  return response.json();
}

/**
 * Saves economic indicators to JSON files
 */
async function saveIndicator(indicator: 'ipca' | 'cdi', url: string): Promise<void> {
  const data = await fetchData(url);
  const filePath = path.join(process.cwd(), 'src', 'data', `${indicator}-historical.json`);
  await writeFile(filePath, JSON.stringify(data, null, 2));
  console.log(`✅ Dados de ${indicator} salvos em ${filePath}`);
}

async function main() {
  await saveIndicator('ipca', 'https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados?formato=json');
  await saveIndicator('cdi', 'https://api.bcb.gov.br/dados/serie/bcdata.sgs.4391/dados?formato=json');
}

main().catch(console.error); 