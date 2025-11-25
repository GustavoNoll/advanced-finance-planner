import { writeFile } from 'fs/promises'
import path from 'path'
import * as XLSX from 'xlsx'

interface BCBResponse {
  data: string
  valor: string
}

/**
 * Formata data para formato brasileiro (dd/mm/yyyy)
 * Usa métodos locais para manter a data original
 */
function formatBrazilianDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

/**
 * Baixa um arquivo XLS de uma URL e converte para JSON organizado por mês
 * @param url URL do arquivo XLS para download
 * @param indicatorName Nome do indicador (para logs)
 * @param fileName Nome do arquivo de saída (sem extensão)
 * @param options Opções de configuração:
 *   - dateColumn: índice ou nome da coluna de data (padrão: primeira coluna)
 *   - valueColumn: índice ou nome da coluna de valor (padrão: segunda coluna)
 *   - sheetName: nome da planilha a ser lida (padrão: primeira planilha)
 *   - skipRows: número de linhas a pular no início (padrão: 0)
 */
export async function fetchByDownload(
  url: string,
  indicatorName: string,
  fileName: string,
  options: {
    dateColumn?: number | string
    valueColumn?: number | string
    sheetName?: string
    skipRows?: number
  } = {}
): Promise<void> {
  try {
    console.log(`📥 Baixando e processando ${indicatorName} de ${url}...`)
    
    // Download do arquivo
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Erro ao baixar arquivo: ${response.status} ${response.statusText}`)
    }
    
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    console.log(`   ✅ Arquivo baixado (${(buffer.length / 1024).toFixed(2)} KB)`)
    
    // Ler arquivo Excel
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    
    // Selecionar planilha
    const sheetName = options.sheetName || workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    
    if (!worksheet) {
      throw new Error(`Planilha "${sheetName}" não encontrada`)
    }
    
    console.log(`   ✅ Planilha "${sheetName}" encontrada`)
    
    // Converter para JSON com raw: false para obter valores formatados como string
    const jsonDataRaw = XLSX.utils.sheet_to_json(worksheet, { 
      header: options.skipRows ? options.skipRows : 1,
      defval: null,
      raw: false
    }) as Record<string, unknown>[]
    
    // Também obter valores numéricos para comparação
    const jsonDataNumeric = XLSX.utils.sheet_to_json(worksheet, { 
      header: options.skipRows ? options.skipRows : 1,
      defval: null,
      raw: true
    }) as Record<string, unknown>[]
    
    if (jsonDataRaw.length === 0) {
      throw new Error('Nenhum dado encontrado na planilha')
    }
    
    console.log(`   ✅ ${jsonDataRaw.length} linhas processadas`)
    
    // Identificar colunas de data e valor
    const firstRow = jsonDataRaw[0]
    const headers = Object.keys(firstRow).map(h => String(h))
    
    let dateColumnIndex: number
    let valueColumnIndex: number
    
    if (typeof options.dateColumn === 'string') {
      const searchTerm = options.dateColumn.toLowerCase()
      dateColumnIndex = headers.findIndex(h => String(h).toLowerCase().includes(searchTerm))
      if (dateColumnIndex === -1) {
        throw new Error(`Coluna de data "${options.dateColumn}" não encontrada`)
      }
    } else {
      dateColumnIndex = typeof options.dateColumn === 'number' ? options.dateColumn : 0
    }
    
    if (typeof options.valueColumn === 'string') {
      const searchTerm = options.valueColumn.toLowerCase()
      valueColumnIndex = headers.findIndex(h => String(h).toLowerCase().includes(searchTerm))
      if (valueColumnIndex === -1) {
        throw new Error(`Coluna de valor "${options.valueColumn}" não encontrada`)
      }
    } else {
      valueColumnIndex = typeof options.valueColumn === 'number' ? options.valueColumn : 1
    }
    
    const dateColumn = headers[dateColumnIndex]
    const valueColumn = headers[valueColumnIndex]
    
    console.log(`   📊 Coluna de data: "${dateColumn}" (índice ${dateColumnIndex})`)
    console.log(`   📊 Coluna de valor: "${valueColumn}" (índice ${valueColumnIndex})`)
    
    // Processar dados e organizar por mês
    const monthlyData = new Map<string, { data: string; valor: string }>()
    
    jsonDataRaw.forEach((row: Record<string, unknown>, index: number) => {
      const dateStr = row[dateColumn]
      // Usar valor formatado (string) que preserva vírgula
      const valueStr = row[valueColumn]
      const numericValue = jsonDataNumeric[index]?.[valueColumn]
      
      if (!dateStr || !valueStr) return
      
      // Tentar parsear a data em diferentes formatos
      let date: Date | null = null
      
      // Formato brasileiro DD/MM/YYYY
      if (typeof dateStr === 'string' && dateStr.includes('/')) {
        const parts = dateStr.split('/')
        if (parts.length === 3) {
          date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]))
        }
      }
      
      // Formato ISO ou Excel serial number
      if (!date || isNaN(date.getTime())) {
        if (typeof dateStr === 'string' || typeof dateStr === 'number') {
          date = new Date(dateStr)
        }
      }
      
      // Se ainda não funcionou, tentar como número serial do Excel
      if ((!date || isNaN(date.getTime())) && typeof dateStr === 'number') {
        try {
          date = XLSX.SSF.parse_date_code(dateStr)
        } catch {
          // Ignorar erro de parsing
        }
      }
      
      if (!date || isNaN(date.getTime())) {
        console.warn(`   ⚠️  Data inválida ignorada: ${dateStr}`)
        return
      }
      
      // Criar chave do mês (YYYY-MM)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      // Converter valor para número
      // Priorizar valor formatado (string) que preserva vírgula como separador decimal
      let value: number
      
      if (typeof valueStr === 'string') {
        // Valor formatado como string (preserva formato brasileiro: "1.042,86")
        let valueStrNormalized = valueStr.trim()
        
        // Verificar se tem vírgula (formato brasileiro)
        if (valueStrNormalized.includes(',')) {
          // Formato brasileiro: remover pontos de milhar e substituir vírgula por ponto
          // Exemplo: "1.042,86" -> "1042.86"
          valueStrNormalized = valueStrNormalized.replace(/\./g, '').replace(',', '.')
        }
        
        value = parseFloat(valueStrNormalized)
        if (isNaN(value)) {
          console.warn(`   ⚠️  Valor inválido ignorado: ${valueStr}`)
          return
        }
      } else if (typeof valueStr === 'number') {
        // Se já é número, usar diretamente
        value = valueStr
      } else if (typeof numericValue === 'number') {
        // Fallback: usar valor numérico se disponível
        // Verificar se parece estar errado (muito grande, sem decimais)
        // Se o número é muito grande e não tem decimais, pode estar faltando a vírgula decimal
        if (numericValue > 1000 && numericValue % 100 === 0 && numericValue % 1000 !== 0) {
          // Possível erro: número como 104286 quando deveria ser 1042.86
          // Tentar dividir por 100 se parecer ser um erro comum
          const testValue = numericValue / 100
          if (testValue > 100 && testValue < 10000) {
            value = testValue
            console.warn(`   ⚠️  Valor corrigido: ${numericValue} -> ${value} (possível erro de parsing)`)
          } else {
            value = numericValue
          }
        } else {
          value = numericValue
        }
      } else {
        console.warn(`   ⚠️  Valor inválido ignorado: ${valueStr}`)
        return
      }
      
      // Manter apenas o último dia disponível de cada mês para pegar o valor correto
      // Mas sempre salvar como dia 1 do mês no JSON
      const existing = monthlyData.get(monthKey)
      if (!existing) {
        // Primeira ocorrência deste mês
        monthlyData.set(monthKey, {
          data: formatBrazilianDate(new Date(date.getFullYear(), date.getMonth(), 1)), // Sempre dia 1
          valor: value.toFixed(4)
        })
      } else {
        // Comparar com a data existente e manter a mais recente (para pegar o valor correto)
        const existingDate = new Date(existing.data.split('/').reverse().join('-'))
        if (date > existingDate) {
          monthlyData.set(monthKey, {
            data: formatBrazilianDate(new Date(date.getFullYear(), date.getMonth(), 1)), // Sempre dia 1
            valor: value.toFixed(4)
          })
        }
      }
    })
    
    // Converter para array e ordenar
    const result: BCBResponse[] = Array.from(monthlyData.values())
      .sort((a, b) => {
        const dateA = new Date(a.data.split('/').reverse().join('-'))
        const dateB = new Date(b.data.split('/').reverse().join('-'))
        return dateA.getTime() - dateB.getTime()
      })
    
    if (result.length === 0) {
      throw new Error('Nenhum dado válido encontrado após processamento')
    }
    
    // Calcular variações mensais
    const variations: BCBResponse[] = []
    for (let i = 1; i < result.length; i++) {
      const current = parseFloat(result[i].valor)
      const previous = parseFloat(result[i - 1].valor)
      
      if (previous > 0) {
        const variation = ((current - previous) / previous) * 100
        variations.push({
          data: result[i].data,
          valor: variation.toFixed(2)
        })
      }
    }
    
    // Salvar arquivo raw
    const rawFilePath = path.join(process.cwd(), 'src', 'data', `${fileName}-raw-historical.json`)
    await writeFile(rawFilePath, JSON.stringify(result, null, 2))
    
    // Salvar arquivo de variações
    const variationFilePath = path.join(process.cwd(), 'src', 'data', `${fileName}-historical.json`)
    await writeFile(variationFilePath, JSON.stringify(variations, null, 2))
    
    console.log(`✅ Dados de ${indicatorName} salvos:`)
    console.log(`   Valores raw: ${rawFilePath}`)
    console.log(`   Variações: ${variationFilePath}`)
    console.log(`   Total de meses: ${result.length}`)
    console.log(`   Total de variações: ${variations.length}`)
    console.log(`   Período: ${result[0]?.data} até ${result[result.length - 1]?.data}\n`)
  } catch (error) {
    console.error(`❌ Erro ao processar ${indicatorName}:`, error)
    throw error
  }
}

/**
 * Exemplo de uso para IHFA
 */
async function main() {
  console.log('📥 Baixando indicadores de arquivos XLS...\n')
  
  // IHFA - Download de arquivo XLS
  // Estrutura: Índice | Data de Referência | Número Índice | Variação Diária | Variação no Mês | Variação no Ano | Variação 12 Meses
  await fetchByDownload(
    'https://s3-data-prd-use1-precos.s3.us-east-1.amazonaws.com/arquivos/indices-historico/IHFA-HISTORICO.xls',
    'IHFA',
    'ihfa',
    {
      dateColumn: 1, // Segunda coluna: "Data de Referência" (DD/MM/YYYY)
      valueColumn: 2, // Terceira coluna: "Número Índice" (valor do índice)
      skipRows: 1 // Pular primeira linha (cabeçalho)
    }
  )
  
  console.log('✅ Todos os indicadores XLS foram processados com sucesso!')
}

// Executar se chamado diretamente via tsx/node
main().catch(console.error)

