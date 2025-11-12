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

interface PTAXResponse {
  value: Array<{
    cotacaoVenda: number
    dataHoraCotacao: string
  }>
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
 * Formata data para API do Banco Central (MM-DD-YYYY)
 */
function formatDateForAPI(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const year = date.getFullYear()
  return `${month}-${day}-${year}`
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
 */
function calculateMonthlyVariation(
  dailyData: YahooFinanceHistoricalData[]
): BCBResponse[] {
  if (dailyData.length < 2) return []

  // Ordena dados por data (timestamp)
  const sortedData = [...dailyData].sort((a, b) => a.timestamp - b.timestamp)

  // Agrupa por mês e pega sempre o último dia disponível no dataset de cada mês
  const monthlyPrices = new Map<string, YahooFinanceHistoricalData>()
  
  sortedData.forEach(item => {
    const date = new Date(item.timestamp)
    const monthKey = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
    monthlyPrices.set(monthKey, item)
  })

  // Converte para array ordenado cronologicamente
  const sortedMonthly = Array.from(monthlyPrices.entries())
    .sort((a, b) => a[1].timestamp - b[1].timestamp)
    .map(entry => entry[1])

  // Calcula variação mensal
  const variations: BCBResponse[] = []
  
  for (let i = 1; i < sortedMonthly.length; i++) {
    const currentMonth = sortedMonthly[i]
    const previousMonth = sortedMonthly[i - 1]
    
    if (previousMonth.close > 0 && currentMonth.close > 0) {
      const variation = ((currentMonth.close - previousMonth.close) / previousMonth.close) * 100
      
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
 * Busca dados históricos de PTAX da API do Banco Central
 */
async function fetchPTAXData(startYear: number = 1995): Promise<BCBResponse[]> {
  try {
    console.log(`📥 Buscando dados de PTAX (Dólar) desde ${startYear}...`)
    
    const endDate = new Date()
    const startDate = new Date(startYear, 0, 1)
    
    const apiUrl = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaPeriodo(moeda=@moeda,dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@moeda='USD'&@dataInicial='${formatDateForAPI(startDate)}'&@dataFinalCotacao='${formatDateForAPI(endDate)}'&$top=10000&$filter=tipoBoletim%20eq%20'Fechamento'&$format=json&$select=cotacaoVenda,dataHoraCotacao`
    
    console.log(`   URL: ${apiUrl}`)
    
    const response = await fetch(apiUrl)
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar dados PTAX: ${response.status}`)
    }

    const data: PTAXResponse = await response.json()
    
    if (!data.value || data.value.length === 0) {
      throw new Error('Nenhum dado PTAX retornado pela API')
    }

    console.log(`   ✅ ${data.value.length} registros encontrados`)

    // Agrupar cotações por competência (MM/YYYY) e pegar o último dia útil do mês
    const competenciaMap = new Map<string, { cotacao: number; data: Date }>()

    data.value.forEach((item) => {
      const dataHora = new Date(item.dataHoraCotacao)
      const month = String(dataHora.getMonth() + 1).padStart(2, '0')
      const year = dataHora.getFullYear()
      const competencia = `${month}/${year}`
      
      const cotacao = Number(item.cotacaoVenda) || 0
      
      // Guardar apenas se não existe ou se a data é mais recente (último dia do mês)
      if (!competenciaMap.has(competencia) || dataHora > competenciaMap.get(competencia)!.data) {
        competenciaMap.set(competencia, {
          cotacao,
          data: dataHora
        })
      }
    })

    // Converter para formato BCBResponse (data no formato 01/MM/YYYY)
    const ptaxArray: BCBResponse[] = Array.from(competenciaMap.entries())
      .map(([competencia, { cotacao }]) => {
        const [month, year] = competencia.split('/').map(Number)
        return {
          data: `01/${String(month).padStart(2, '0')}/${year}`,
          valor: cotacao.toFixed(4)
        }
      })
      .sort((a, b) => {
        const dateA = new Date(a.data.split('/').reverse().join('-'))
        const dateB = new Date(b.data.split('/').reverse().join('-'))
        return dateA.getTime() - dateB.getTime()
      })

    console.log(`   ✅ ${ptaxArray.length} competências processadas`)
    console.log(`   Período: ${ptaxArray[0]?.data} até ${ptaxArray[ptaxArray.length - 1]?.data}`)

    return ptaxArray
  } catch (error) {
    console.error(`❌ Erro ao buscar PTAX:`, error)
    throw error
  }
}

/**
 * Converte dados diários para mensais (último dia útil de cada mês)
 * Retorna os valores raw (preços/índices) sem calcular variação
 */
function getMonthlyRawValues(
  dailyData: YahooFinanceHistoricalData[]
): BCBResponse[] {
  if (dailyData.length === 0) return []

  // Ordena dados por data (timestamp)
  const sortedData = [...dailyData].sort((a, b) => a.timestamp - b.timestamp)

  // Agrupa por mês e pega sempre o último dia disponível no dataset de cada mês
  const monthlyPrices = new Map<string, YahooFinanceHistoricalData>()
  
  sortedData.forEach(item => {
    const date = new Date(item.timestamp)
    const monthKey = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
    monthlyPrices.set(monthKey, item)
  })

  // Converte para array ordenado cronologicamente
  const sortedMonthly = Array.from(monthlyPrices.entries())
    .sort((a, b) => a[1].timestamp - b[1].timestamp)
    .map(entry => entry[1])

  // Retorna valores raw formatados
  return sortedMonthly.map(item => {
    const currentDate = new Date(item.timestamp)
    const formattedDate = formatBrazilianDate(new Date(Date.UTC(
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth(),
      1,
      0, 0, 0, 0
    )))
    
    return {
      data: formattedDate,
      valor: item.close.toFixed(2)
    }
  })
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
    
    const startDate = new Date(startYear, 0, 1)
    const endDate = new Date()
    
    const period1 = Math.floor(startDate.getTime() / 1000)
    const period2 = Math.floor(endDate.getTime() / 1000)

    const dailyData = await fetchYahooFinanceData(symbol, period1, period2)
    
    if (dailyData.length === 0) {
      throw new Error(`No data found for ${symbol}`)
    }

    console.log(`   ✅ ${dailyData.length} registros diários encontrados`)
    console.log(`   Período: ${formatBrazilianDate(startDate)} até ${formatBrazilianDate(endDate)}`)

    const monthlyVariations = calculateMonthlyVariation(dailyData)
    const monthlyRawValues = getMonthlyRawValues(dailyData)

    if (monthlyVariations.length === 0) {
      throw new Error('Unable to calculate monthly variations')
    }

    // Salvar arquivo de variações
    const variationFilePath = path.join(process.cwd(), 'src', 'data', `${fileName}-historical.json`)
    await writeFile(variationFilePath, JSON.stringify(monthlyVariations, null, 2))
    
    // Salvar arquivo raw
    const rawFilePath = path.join(process.cwd(), 'src', 'data', `${fileName}-raw-historical.json`)
    await writeFile(rawFilePath, JSON.stringify(monthlyRawValues, null, 2))
    
    console.log(`✅ Dados de ${indicatorName} salvos:`)
    console.log(`   Variações: ${variationFilePath}`)
    console.log(`   Valores raw: ${rawFilePath}`)
    console.log(`   Total de variações mensais: ${monthlyVariations.length}`)
    console.log(`   Total de valores raw: ${monthlyRawValues.length}`)
    console.log(`   Período: ${monthlyVariations[0]?.data} até ${monthlyVariations[monthlyVariations.length - 1]?.data}\n`)
  } catch (error) {
    console.error(`❌ Erro ao salvar ${indicatorName}:`, error)
    throw error
  }
}

/**
 * Calcula variação mensal para PTAX
 */
function calculatePTAXMonthlyVariation(ptaxData: BCBResponse[]): BCBResponse[] {
  if (ptaxData.length < 2) return []
  
  const variations: BCBResponse[] = []
  
  for (let i = 1; i < ptaxData.length; i++) {
    const current = parseFloat(ptaxData[i].valor)
    const previous = parseFloat(ptaxData[i - 1].valor)
    
    if (previous > 0) {
      const variation = ((current - previous) / previous) * 100
      variations.push({
        data: ptaxData[i].data,
        valor: variation.toFixed(2)
      })
    }
  }
  
  return variations
}

/**
 * Salva dados de PTAX em arquivo JSON
 */
async function savePTAXIndicator(startYear: number = 1995): Promise<void> {
  try {
    const ptaxRawData = await fetchPTAXData(startYear)
    
    // Calcular variações mensais
    const ptaxVariations = calculatePTAXMonthlyVariation(ptaxRawData)
    
    // Salvar arquivo raw
    const rawFilePath = path.join(process.cwd(), 'src', 'data', 'ptax-raw-historical.json')
    await writeFile(rawFilePath, JSON.stringify(ptaxRawData, null, 2))
    
    // Salvar arquivo de variações
    const variationFilePath = path.join(process.cwd(), 'src', 'data', 'ptax-historical.json')
    await writeFile(variationFilePath, JSON.stringify(ptaxVariations, null, 2))
    
    console.log(`✅ Dados de PTAX salvos:`)
    console.log(`   Valores raw: ${rawFilePath}`)
    console.log(`   Variações: ${variationFilePath}`)
    console.log(`   Total de competências raw: ${ptaxRawData.length}`)
    console.log(`   Total de variações mensais: ${ptaxVariations.length}`)
    console.log(`   Período: ${ptaxRawData[0]?.data} até ${ptaxRawData[ptaxRawData.length - 1]?.data}\n`)
  } catch (error) {
    console.error(`❌ Erro ao salvar PTAX:`, error)
    throw error
  }
}

async function main() {
  console.log('📥 Buscando dados do Yahoo Finance e PTAX...\n')
  
  // PTAX (Dólar) - API do Banco Central
  await savePTAXIndicator(1995)
  
  // Ouro: GC=F (Gold Futures)
  await saveYahooFinanceIndicator('GC=F', 'Ouro (Gold)', 'gold', 1970)
  
  // Bitcoin: BTC-USD
  await saveYahooFinanceIndicator('BTC-USD', 'Bitcoin', 'btc', 2010)
  
  // IBOV: ^BVSP (Ibovespa)
  await saveYahooFinanceIndicator('^BVSP', 'IBOVESPA', 'ibov', 1968)
  
  console.log('✅ Todos os indicadores foram salvos com sucesso!')
}

main().catch(console.error)
