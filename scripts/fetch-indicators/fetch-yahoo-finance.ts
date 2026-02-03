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
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1mo&period1=${period1}&period2=${period2}`
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
 * Determina o mês correto de um timestamp, lidando com problemas de timezone
 * O Yahoo Finance retorna dados mensais onde cada timestamp representa um mês.
 * Como os timestamps podem estar no primeiro dia do mês em um timezone específico,
 * ao converter para UTC podem cair no mês anterior. Esta função tenta determinar
 * o mês correto baseado em múltiplas heurísticas.
 */
function getMonthFromTimestamp(timestamp: number): { year: number; month: number } {
  const date = new Date(timestamp)
  
  // Obtém informações UTC e local
  const utcYear = date.getUTCFullYear()
  const utcMonth = date.getUTCMonth() + 1
  const utcDay = date.getUTCDate()
  
  const localYear = date.getFullYear()
  const localMonth = date.getMonth() + 1
  const localDay = date.getDate()
  
  // Heurística 1: Se UTC e local estão no mesmo mês, usa esse mês
  if (utcYear === localYear && utcMonth === localMonth) {
    return { year: utcYear, month: utcMonth }
  }
  
  // Heurística 2: Se estamos no início do mês em UTC (dia 1-3), mas o mês local é diferente
  // e o dia local também está no início (1-5), provavelmente o timestamp representa
  // o primeiro dia do mês local, então usa o mês local
  if (utcDay <= 3 && localDay <= 5) {
    // Se o mês local é o mês seguinte ao UTC, provavelmente o timestamp representa
    // o primeiro dia do mês local (ex: 1º de outubro em timezone +3 vira 30 de setembro em UTC)
    if (localMonth === utcMonth + 1 || (utcMonth === 12 && localMonth === 1 && localYear === utcYear + 1)) {
      return { year: localYear, month: localMonth }
    }
    // Se o mês local é o mês anterior ao UTC, provavelmente o timestamp representa
    // o último dia do mês local (menos comum, mas possível)
    if (localMonth === utcMonth - 1 || (utcMonth === 1 && localMonth === 12 && localYear === utcYear - 1)) {
      return { year: localYear, month: localMonth }
    }
  }
  
  // Heurística 3: Se o dia UTC está no início (1-5), assume que representa aquele mês UTC
  // (mais comum para dados históricos)
  if (utcDay <= 5) {
    return { year: utcYear, month: utcMonth }
  }
  
  // Fallback: usa UTC como padrão
  return { year: utcYear, month: utcMonth }
}

/**
 * Obtém o mês anterior a um mês específico
 */
function getPreviousMonth(year: number, month: number): { year: number; month: number } {
  if (month === 1) {
    return { year: year - 1, month: 12 }
  }
  return { year, month: month - 1 }
}

/**
 * Calcula variação mensal em percentual entre meses consecutivos
 * Os dados já vêm mensais da API (interval=1mo)
 * Preenche meses faltantes com o último dado do mês anterior
 */
function normalizeMonthlyData(monthlyData: YahooFinanceHistoricalData[], debugSymbol?: string): YahooFinanceHistoricalData[] {
  const byMonth = new Map<string, YahooFinanceHistoricalData>()
  const debugInfo: Array<{ timestamp: number; date: string; monthKey: string; close: number; utcMonth: number; localMonth: number }> = []

  monthlyData.forEach(item => {
    const date = new Date(item.timestamp)
    const { year, month } = getMonthFromTimestamp(item.timestamp)
    const monthKey = `${year}-${String(month).padStart(2, '0')}`
    
    // Debug: coletar informações sobre outubro especificamente
    if (debugSymbol && (month === 10 || date.getUTCMonth() === 9 || date.getMonth() === 9)) {
      debugInfo.push({
        timestamp: item.timestamp,
        date: date.toISOString(),
        monthKey,
        close: item.close,
        utcMonth: date.getUTCMonth() + 1,
        localMonth: date.getMonth() + 1
      })
    }
    
    // Guarda o primeiro registro do mês (mais antigo - primeiro dia do mês)
    if (!byMonth.has(monthKey) || item.timestamp < byMonth.get(monthKey)!.timestamp) {
      byMonth.set(monthKey, item)
    }
  })

  // Log de debug para outubro se houver dados
  if (debugSymbol && debugInfo.length > 0) {
    console.log(`   🔍 Debug ${debugSymbol} - Registros relacionados a outubro encontrados:`, debugInfo.length)
    debugInfo.slice(0, 10).forEach(info => {
      console.log(`      ${info.date} -> ${info.monthKey} (UTC: ${info.utcMonth}, Local: ${info.localMonth}, close: ${info.close})`)
    })
  }

  // Identificar meses faltantes e preencher com último dado do mês anterior
  if (byMonth.size > 0) {
    const sortedMonths = Array.from(byMonth.keys()).sort()
    const firstMonthKey = sortedMonths[0]
    const lastMonthKey = sortedMonths[sortedMonths.length - 1]
    
    const [firstYear, firstMonth] = firstMonthKey.split('-').map(Number)
    const [lastYear, lastMonth] = lastMonthKey.split('-').map(Number)
    
    // Gerar lista de todos os meses esperados no período
    const expectedMonths: string[] = []
    let currentYear = firstYear
    let currentMonth = firstMonth
    const endYear = lastYear
    const endMonth = lastMonth
    
    while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) {
      const monthKey = `${currentYear}-${String(currentMonth).padStart(2, '0')}`
      expectedMonths.push(monthKey)
      
      if (currentMonth === 12) {
        currentYear++
        currentMonth = 1
      } else {
        currentMonth++
      }
    }
    
    // Preencher meses faltantes com último dado do mês anterior
    // Iterar em ordem cronológica para garantir que meses preenchidos possam ser usados para meses subsequentes
    expectedMonths.forEach(monthKey => {
      if (!byMonth.has(monthKey)) {
        // Mês faltante - usar último dado do mês anterior
        const [year, month] = monthKey.split('-').map(Number)
        const prevMonth = getPreviousMonth(year, month)
        const prevMonthKey = `${prevMonth.year}-${String(prevMonth.month).padStart(2, '0')}`
        
        // Verifica se o mês anterior existe (pode ser um mês original ou já preenchido)
        if (byMonth.has(prevMonthKey)) {
          const previousData = byMonth.get(prevMonthKey)!
          // Criar uma cópia do dado anterior com timestamp ajustado para o primeiro dia do mês faltante
          const missingMonthDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0))
          const filledData: YahooFinanceHistoricalData = {
            timestamp: missingMonthDate.getTime(),
            close: previousData.close
          }
          byMonth.set(monthKey, filledData)
          
          if (debugSymbol) {
            console.log(`   📅 Preenchendo mês faltante ${monthKey} com dado de ${prevMonthKey} (close: ${previousData.close})`)
          }
        } else if (debugSymbol) {
          // Primeiro mês está faltando - não há mês anterior para usar
          console.log(`   ⚠️  Mês ${monthKey} está faltando e não há mês anterior disponível`)
        }
      }
    })
  }

  return Array.from(byMonth.values()).sort((a, b) => a.timestamp - b.timestamp)
}

function calculateMonthlyVariation(
  monthlyData: YahooFinanceHistoricalData[],
  debugSymbol?: string
): BCBResponse[] {
  const normalized = normalizeMonthlyData(monthlyData, debugSymbol)
  if (normalized.length < 2) return []

  const variations: BCBResponse[] = []
  
  // Debug: mostrar alguns meses normalizados para verificar ordenação
  if (debugSymbol && normalized.length > 0) {
    console.log(`   🔍 Primeiros 5 meses normalizados (para cálculo de variação):`)
    normalized.slice(0, 5).forEach((item, idx) => {
      const date = new Date(item.timestamp)
      const { year, month } = getMonthFromTimestamp(item.timestamp)
      console.log(`      [${idx}] ${year}-${String(month).padStart(2, '0')}: timestamp=${item.timestamp}, date=${date.toISOString()}, close=${item.close}`)
    })
    if (normalized.length > 5) {
      console.log(`   🔍 Últimos 5 meses normalizados:`)
      normalized.slice(-5).forEach((item, idx) => {
        const date = new Date(item.timestamp)
        const { year, month } = getMonthFromTimestamp(item.timestamp)
        console.log(`      [${normalized.length - 5 + idx}] ${year}-${String(month).padStart(2, '0')}: timestamp=${item.timestamp}, date=${date.toISOString()}, close=${item.close}`)
      })
    }
  }
  
  for (let i = 1; i < normalized.length; i++) {
    const currentMonth = normalized[i]
    const previousMonth = normalized[i - 1]
    
    if (previousMonth.close > 0 && currentMonth.close > 0) {
      const variation = ((currentMonth.close - previousMonth.close) / previousMonth.close) * 100
      
      // Usar getMonthFromTimestamp para garantir que estamos usando o mês correto
      const { year, month } = getMonthFromTimestamp(currentMonth.timestamp)
      const formattedDate = formatBrazilianDate(new Date(Date.UTC(
        year,
        month - 1, // month é 1-12, mas Date.UTC espera 0-11
        1,
        0, 0, 0, 0
      )))
      
      variations.push({
        data: formattedDate,
        valor: variation.toFixed(4)
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
 * Retorna os valores raw (preços/índices) mensais sem calcular variação
 * Os dados já vêm mensais da API (interval=1mo)
 */
function getMonthlyRawValues(
  monthlyData: YahooFinanceHistoricalData[],
  debugSymbol?: string
): BCBResponse[] {
  if (monthlyData.length === 0) return []

  const normalized = normalizeMonthlyData(monthlyData, debugSymbol)

  return normalized.map(item => {
    // Usar getMonthFromTimestamp para garantir que estamos usando o mês correto
    const { year, month } = getMonthFromTimestamp(item.timestamp)
    const formattedDate = formatBrazilianDate(new Date(Date.UTC(
      year,
      month - 1, // month é 1-12, mas Date.UTC espera 0-11
      1,
      0, 0, 0, 0
    )))
    
    return {
      data: formattedDate,
      valor: item.close.toFixed(4)
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

    const monthlyData = await fetchYahooFinanceData(symbol, period1, period2)
    
    if (monthlyData.length === 0) {
      throw new Error(`No data found for ${symbol}`)
    }

    console.log(`   ✅ ${monthlyData.length} registros mensais encontrados`)
    console.log(`   Período: ${formatBrazilianDate(startDate)} até ${formatBrazilianDate(endDate)}`)

    // Debug: mostrar alguns timestamps brutos para entender o formato
    if (monthlyData.length > 0) {
      console.log(`   🔍 Primeiros 3 registros brutos:`)
      monthlyData.slice(0, 3).forEach((item, idx) => {
        const date = new Date(item.timestamp)
        console.log(`      [${idx}] timestamp: ${item.timestamp}, date: ${date.toISOString()}, UTC month: ${date.getUTCMonth() + 1}, close: ${item.close}`)
      })
      console.log(`   🔍 Últimos 5 registros brutos:`)
      monthlyData.slice(-5).forEach((item, idx) => {
        const date = new Date(item.timestamp)
        console.log(`      [${monthlyData.length - 5 + idx}] timestamp: ${item.timestamp}, date: ${date.toISOString()}, UTC month: ${date.getUTCMonth() + 1}, close: ${item.close}`)
      })
    }

    const monthlyVariations = calculateMonthlyVariation(monthlyData, symbol)
    const monthlyRawValues = getMonthlyRawValues(monthlyData, symbol)

    if (monthlyVariations.length === 0) {
      throw new Error('Unable to calculate monthly variations')
    }

    // Verificar meses faltantes
    const normalized = normalizeMonthlyData(monthlyData, symbol)
    const monthsFound = new Set<string>()
    normalized.forEach(item => {
      const { year, month } = getMonthFromTimestamp(item.timestamp)
      const monthKey = `${year}-${String(month).padStart(2, '0')}`
      monthsFound.add(monthKey)
    })

    // Identificar meses faltantes no período esperado
    const expectedMonths: string[] = []
    const firstMonth = getMonthFromTimestamp(normalized[0].timestamp)
    const lastMonth = getMonthFromTimestamp(normalized[normalized.length - 1].timestamp)
    const current = new Date(firstMonth.year, firstMonth.month - 1, 1)
    const end = new Date(lastMonth.year, lastMonth.month - 1, 1)
    
    while (current <= end) {
      const monthKey = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`
      expectedMonths.push(monthKey)
      current.setMonth(current.getMonth() + 1)
    }

    const missingMonths = expectedMonths.filter(m => !monthsFound.has(m))
    if (missingMonths.length > 0) {
      console.log(`   ⚠️  Meses faltantes: ${missingMonths.join(', ')}`)
    }

    // Salvar arquivo de variações
    const variationFilePath = path.join(process.cwd(), 'packages', 'shared', 'src', 'data', `${fileName}-historical.json`)
    await writeFile(variationFilePath, JSON.stringify(monthlyVariations, null, 2))
    
    // Salvar arquivo raw
    const rawFilePath = path.join(process.cwd(), 'packages', 'shared', 'src', 'data', `${fileName}-raw-historical.json`)
    await writeFile(rawFilePath, JSON.stringify(monthlyRawValues, null, 2))
    
    console.log(`✅ Dados de ${indicatorName} salvos:`)
    console.log(`   Variações: ${variationFilePath}`)
    console.log(`   Valores raw: ${rawFilePath}`)
    console.log(`   Total de variações mensais: ${monthlyVariations.length}`)
    console.log(`   Total de valores raw: ${monthlyRawValues.length}`)
    console.log(`   Período: ${monthlyVariations[0]?.data} até ${monthlyVariations[monthlyVariations.length - 1]?.data}`)
    if (missingMonths.length > 0) {
      console.log(`   ⚠️  Atenção: ${missingMonths.length} mês(es) faltando no período\n`)
    } else {
      console.log(`   ✅ Todos os meses do período foram capturados\n`)
    }
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
        valor: variation.toFixed(4)
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
    const rawFilePath = path.join(process.cwd(), 'packages', 'shared', 'src', 'data', 'ptax-raw-historical.json')
    await writeFile(rawFilePath, JSON.stringify(ptaxRawData, null, 2))
    
    // Salvar arquivo de variações
    const variationFilePath = path.join(process.cwd(), 'packages', 'shared', 'src', 'data', 'ptax-historical.json')
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
  
  // IFIX: XFIX11.SA (Índice de Fundos Imobiliários) - valores em BRL
  await saveYahooFinanceIndicator('XFIX11.SA', 'IFIX', 'ifix', 2010)
  
  // AGGG: AGGG.L (iShares Global Aggregate Bond ETF)
  await saveYahooFinanceIndicator('AGGG.L', 'AGGG (Global Aggregate Bonds)', 'aggg', 2000)
  
  // MSCI ACWI: VT (Vanguard Total World Stock ETF)
  await saveYahooFinanceIndicator('VT', 'MSCI ACWI (Vanguard Total World)', 'msci-acwi', 2008)
  
  console.log('✅ Todos os indicadores foram salvos com sucesso!')
}

main().catch(console.error)
