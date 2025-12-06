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
 * Parses Brazilian date string (dd/mm/yyyy) to Date object
 */
function parseBrazilianDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Gets the first trading day of each month from daily data
 */
function getFirstDayOfEachMonth(data: BCBResponse[]): BCBResponse[] {
  const monthlyData = new Map<string, BCBResponse>();
  
  data.forEach(item => {
    const date = parseBrazilianDate(item.data);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    // Se não existe registro para este mês, ou se esta data é anterior ao registro existente
    const existing = monthlyData.get(monthKey);
    if (!existing || date < parseBrazilianDate(existing.data)) {
      monthlyData.set(monthKey, item);
    }
  });
  
  // Converte para array e ordena por data
  return Array.from(monthlyData.values()).sort((a, b) => {
    const dateA = parseBrazilianDate(a.data);
    const dateB = parseBrazilianDate(b.data);
    return dateA.getTime() - dateB.getTime();
  });
}

/**
 * Saves economic indicators to JSON files
 * For index-based indicators, calculates monthly variation before saving
 */
async function saveIndicator(
  indicator: 'ipca' | 'cdi' | 'ibov', 
  url: string, 
  options?: { calculateVariation?: boolean }
): Promise<void> {
  const data = await fetchData(url);
  let dataToSave = data;
  
  // Se for um índice e precisa calcular variação, processa os dados
  if (options?.calculateVariation) {
    // Filtra para pegar apenas o primeiro dia de cada mês (caso seja diário)
    const monthlyData = getFirstDayOfEachMonth(data);
    
    // Salvar arquivo raw antes de calcular variação
    const rawFilePath = path.join(process.cwd(), 'src', 'data', `${indicator}-raw-historical.json`);
    await writeFile(rawFilePath, JSON.stringify(monthlyData, null, 2));
    
    // Calcula a variação mensal
    dataToSave = calculateMonthlyVariation(monthlyData);
    console.log(`✅ Dados de ${indicator} (variação mensal em %) calculados e salvos`);
    console.log(`   Valores raw salvos em ${rawFilePath}`);
  }
  
  const filePath = path.join(process.cwd(), 'src', 'data', `${indicator}-historical.json`);
  await writeFile(filePath, JSON.stringify(dataToSave, null, 2));
  console.log(`✅ Dados de ${indicator} salvos em ${filePath}`);
  if (options?.calculateVariation && dataToSave.length > 0) {
    console.log(`   Total de variações mensais: ${dataToSave.length}`);
    console.log(`   Período: ${dataToSave[0]?.data} até ${dataToSave[dataToSave.length - 1]?.data}`);
  }
}

/**
 * Formats date to Brazilian format (dd/mm/yyyy)
 */
function formatBrazilianDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Calculates monthly variation from index values
 * Converts absolute index values to monthly percentage rates
 */
function calculateMonthlyVariation(monthlyData: BCBResponse[]): BCBResponse[] {
  if (monthlyData.length < 2) return [];
  
  const variations: BCBResponse[] = [];
  
  // O primeiro mês não tem variação, então começamos do segundo
  for (let i = 1; i < monthlyData.length; i++) {
    const current = parseFloat(monthlyData[i].valor);
    const previous = parseFloat(monthlyData[i - 1].valor);
    
    if (previous > 0) {
      const variation = ((current - previous) / previous) * 100;
      variations.push({
        data: monthlyData[i].data,
        valor: variation.toFixed(4)
      });
    }
  }
  
  return variations;
}

/**
 * Saves daily indicators, fetching data in 10-year chunks going backwards
 * Filters to keep only the first day of each month
 */
async function saveDailyIndicator(indicator: 'irfm', baseUrl: string): Promise<void> {
  const allData: BCBResponse[] = [];
  const today = new Date();
  let currentStartDate = new Date(today);
  let hasMoreData = true;
  let chunkNumber = 1;

  // Define uma data inicial mínima (ex: 2000-01-01, quando o IRF-M começou a ser publicado)
  const minDate = new Date(2000, 0, 1);

  console.log(`📥 Buscando dados de ${indicator} em janelas de 10 anos...`);

  while (hasMoreData && currentStartDate >= minDate) {
    // Calcula a data final (10 anos antes da data inicial atual, mas não antes de minDate)
    const chunkEndDate = new Date(currentStartDate);
    chunkEndDate.setFullYear(chunkEndDate.getFullYear() - 10);
    if (chunkEndDate < minDate) {
      chunkEndDate.setTime(minDate.getTime());
    }

    const startDateStr = formatBrazilianDate(chunkEndDate);
    const endDateStr = formatBrazilianDate(currentStartDate);

    const url = `${baseUrl}&dataInicial=${startDateStr}&dataFinal=${endDateStr}`;
    
    console.log(`   Chunk ${chunkNumber}: ${startDateStr} até ${endDateStr}`);

    try {
      const chunkData = await fetchData(url);
      
      if (chunkData && chunkData.length > 0) {
        allData.push(...chunkData);
        console.log(`   ✅ ${chunkData.length} registros encontrados`);
        
        // Move para o próximo período (10 anos antes)
        currentStartDate = new Date(chunkEndDate);
        currentStartDate.setDate(currentStartDate.getDate() - 1); // Um dia antes para não duplicar
        chunkNumber++;
        
        // Pequeno delay para não sobrecarregar a API
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        hasMoreData = false;
      }
    } catch (error) {
      console.error(`   ❌ Erro ao buscar chunk ${chunkNumber}:`, error);
      hasMoreData = false;
    }

    // Se a próxima data inicial seria antes da data mínima, para
    if (currentStartDate < minDate) {
      hasMoreData = false;
    }
  }

  // Remove duplicatas baseado na data
  const uniqueData = new Map<string, BCBResponse>();
  allData.forEach(item => {
    if (!uniqueData.has(item.data)) {
      uniqueData.set(item.data, item);
    }
  });

  // Filtra para pegar apenas o primeiro dia de cada mês
  const monthlyData = getFirstDayOfEachMonth(Array.from(uniqueData.values()));
  
  // Calcula a variação mensal (converte índices absolutos para taxas percentuais)
  const monthlyVariations = calculateMonthlyVariation(monthlyData);

  const filePath = path.join(process.cwd(), 'src', 'data', `${indicator}-historical.json`);
  await writeFile(filePath, JSON.stringify(monthlyVariations, null, 2));
  
  console.log(`✅ Dados de ${indicator} (variação mensal em %) salvos em ${filePath}`);
  console.log(`   Total de dias únicos: ${uniqueData.size}, Total de meses (índices): ${monthlyData.length}`);
  console.log(`   Total de variações mensais: ${monthlyVariations.length}`);
  if (monthlyVariations.length > 0) {
    console.log(`   Período: ${monthlyVariations[0]?.data} até ${monthlyVariations[monthlyVariations.length - 1]?.data}`);
  }
}

async function main() {
  // IPCA e CDI já vêm como taxas percentuais mensais
  await saveIndicator('ipca', 'https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados?formato=json');
  await new Promise(resolve => setTimeout(resolve, 1000));
  await saveIndicator('cdi', 'https://api.bcb.gov.br/dados/serie/bcdata.sgs.4391/dados?formato=json');
  await new Promise(resolve => setTimeout(resolve, 1000));
  // IBOV precisa calcular variação e salvar raw
  await saveIndicator('ibov', 'https://api.bcb.gov.br/dados/serie/bcdata.sgs.7832/dados?formato=json', { calculateVariation: true });
}

main().catch(console.error); 