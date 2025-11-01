import { writeFile } from 'fs/promises'
import path from 'path'

interface BCBResponse {
  data: string
  valor: string
}

interface YahooFinanceHistoricalData {
  timestamp: number
  close: number
}

interface YahooFinanceResponse {
  chart: {
    result: Array<{
      timestamp: number[]
      indicators: {
        quote: Array<{
          close: (number | null)[]
        }>
      }
    }>
  }
}

/**
 * Formata data para formato brasileiro (dd/mm/yyyy)
 * Usa métodos UTC para garantir consistência independente do fuso horário local
 */
function formatBrazilianDate(date: Date): string {
  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const year = date.getUTCFullYear()
  return `${day}/${month}/${year}`
}

/**
 * Busca dados históricos do Yahoo Finance
 */
async function fetchYahooFinanceData(
  symbol: string,
  period1: number,
  period2: number
): Promise<YahooFinanceHistoricalData[]> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&period1=${period1}&period2=${period2}`
  
  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error(`Yahoo Finance API error (${response.status}): ${response.statusText}`)
  }

  const json: YahooFinanceResponse = await response.json()

  if (!json.chart?.result?.[0]) {
    throw new Error(`No data found for symbol ${symbol}`)
  }

  const result = json.chart.result[0]
  const timestamps = result.timestamp || []
  const closes = result.indicators?.quote?.[0]?.close || []

  const data: YahooFinanceHistoricalData[] = []
  
  for (let i = 0; i < timestamps.length; i++) {
    const timestamp = timestamps[i]
    const close = closes[i]
    
    if (close !== null && close !== undefined && !isNaN(close)) {
      data.push({
        timestamp: timestamp * 1000, // Convert to milliseconds
        close
      })
    }
  }
  return data
}

/**
 * Converte dados diários para mensais (último dia útil de cada mês)
 * E calcula variação mensal em percentual entre meses consecutivos
 * 
 * Nota: O Yahoo Finance às vezes retorna buracos nos finais de semana,
 * mesmo para ativos que negociam 24h/dia (como BTC-USD). A lógica abaixo
 * garante que sempre pegamos o último dia disponível no dataset para cada mês,
 * mesmo que não seja tecnicamente o último dia do mês no calendário.
 */
function calculateMonthlyVariation(
  dailyData: YahooFinanceHistoricalData[]
): BCBResponse[] {
  if (dailyData.length < 2) return []

  // Ordena dados por data (timestamp)
  const sortedData = [...dailyData].sort((a, b) => a.timestamp - b.timestamp)

  // Agrupa por mês e pega sempre o último dia disponível no dataset de cada mês
  // Isso lida automaticamente com buracos nos finais de semana do Yahoo Finance
  const monthlyPrices = new Map<string, YahooFinanceHistoricalData>()
  
  sortedData.forEach(item => {
    // Usa métodos UTC para evitar problemas com fuso horário local
    // O Yahoo Finance retorna timestamps em UTC, então devemos trabalhar em UTC
    const date = new Date(item.timestamp)
    // Chave no formato YYYY-MM para agrupar por mês (usando componentes UTC)
    const monthKey = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
    
    // Sempre sobrescreve para manter o último dia disponível no dataset (fechamento do mês)
    // Como iteramos dados ordenados cronologicamente, o último registro encontrado
    // para cada mês será mantido — o que corresponde ao último preço disponível no mês,
    // mesmo que haja buracos nos finais de semana.
    monthlyPrices.set(monthKey, item)
  })

  // Converte para array ordenado cronologicamente
  const sortedMonthly = Array.from(monthlyPrices.entries())
    .sort((a, b) => a[1].timestamp - b[1].timestamp)
    .map(entry => entry[1])

  // Calcula variação mensal: compara o último dia útil de cada mês com o último dia útil do mês anterior
  const variations: BCBResponse[] = []
  
  for (let i = 1; i < sortedMonthly.length; i++) {
    const currentMonth = sortedMonthly[i]
    const previousMonth = sortedMonthly[i - 1]
    
    // Valida que ambos têm preços válidos
    if (previousMonth.close > 0 && currentMonth.close > 0) {
      // Calcula variação percentual: (valor_atual - valor_anterior) / valor_anterior * 100
      const variation = ((currentMonth.close - previousMonth.close) / previousMonth.close) * 100
      
      // Usa sempre dia 01/MM/YYYY para manter consistência com outros indicadores
      // A variação já foi calculada usando os últimos dias úteis reais
      // Usa métodos UTC para evitar problemas com fuso horário
      const currentDate = new Date(currentMonth.timestamp)
      const formattedDate = formatBrazilianDate(new Date(Date.UTC(
        currentDate.getUTCFullYear(),
        currentDate.getUTCMonth(),
        1,
        0, 0, 0, 0
      )))
      
      variations.push({
        data: formattedDate,
        valor: variation.toFixed(2)
      })
    }
  }

  return variations
}

/**
 * Busca e salva dados históricos de um ativo do Yahoo Finance
 */
async function saveYahooFinanceIndicator(
  symbol: string,
  indicatorName: string,
  fileName: string,
  startYear: number = 2000
): Promise<void> {
  try {
    console.log(`📥 Buscando dados de ${indicatorName} (${symbol})...`)
    
    // Calcula timestamps para início e fim
    const startDate = new Date(startYear, 0, 1)
    const endDate = new Date()
    
    const period1 = Math.floor(startDate.getTime() / 1000) // Unix timestamp em segundos
    const period2 = Math.floor(endDate.getTime() / 1000)

    // Busca dados diários
    const dailyData = await fetchYahooFinanceData(symbol, period1, period2)
    
    if (dailyData.length === 0) {
      throw new Error(`No data found for ${symbol}`)
    }

    console.log(`   ✅ ${dailyData.length} registros diários encontrados`)
    console.log(`   Período: ${formatBrazilianDate(startDate)} até ${formatBrazilianDate(endDate)}`)

    // Converte para variação mensal
    const monthlyVariations = calculateMonthlyVariation(dailyData)

    if (monthlyVariations.length === 0) {
      throw new Error('Unable to calculate monthly variations')
    }

    // Salva arquivo JSON
    const filePath = path.join(process.cwd(), 'src', 'data', `${fileName}-historical.json`)
    await writeFile(filePath, JSON.stringify(monthlyVariations, null, 2))
    
    console.log(`✅ Dados de ${indicatorName} salvos em ${filePath}`)
    console.log(`   Total de variações mensais: ${monthlyVariations.length}`)
    console.log(`   Período: ${monthlyVariations[0]?.data} até ${monthlyVariations[monthlyVariations.length - 1]?.data}\n`)
  } catch (error) {
    console.error(`❌ Erro ao salvar ${indicatorName}:`, error)
    throw error
  }
}

async function main() {
  console.log('📥 Buscando dados do Yahoo Finance...\n')
  
  // Ouro: GC=F (Gold Futures) é mais confiável que XAUUSD
  // Bitcoin: BTC-USD
  await saveYahooFinanceIndicator('GC=F', 'Ouro (Gold)', 'gold', 1970)
  await saveYahooFinanceIndicator('BTC-USD', 'Bitcoin', 'btc', 2010)
  
  // Índices brasileiros
  // IBOV: ^BVSP (Ibovespa)
  await saveYahooFinanceIndicator('^BVSP', 'IBOVESPA', 'ibov', 1968)
  
  console.log('✅ Todos os indicadores foram salvos com sucesso!')
}

main().catch(console.error)
