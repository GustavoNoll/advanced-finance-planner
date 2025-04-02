import { writeFile } from 'fs/promises';
import path from 'path';

interface BCBResponse {
  valor: string;
  data: string;
}
/**
 * Fetches IPCA data from BCB API
 * @returns Promise<BCBResponse>
 */
export async function fetchIPCA(): Promise<BCBResponse[]> {
  const response = await fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados?formato=json');
  const data = await response.json();
  return data;
}

/**
 * Fetches CDI data from BCB API
 * @returns Promise<BCBResponse>
 */
export async function fetchCDI(): Promise<BCBResponse[]> {
  const response = await fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.4391/dados?formato=json');
  const data = await response.json();
  return data;
}

/**
 * Saves economic indicators to JSON files
 * @param data - The data to save
 * @param indicator - The indicator name (ipca or cdi)
 */
export async function saveIndicator(data: BCBResponse[], indicator: 'ipca' | 'cdi'): Promise<void> {
  const filePath = path.join(process.cwd(), 'src', 'data', `${indicator}-historical.json`);
  await writeFile(filePath, JSON.stringify(data, null, 2));
} 