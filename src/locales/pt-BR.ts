export const ptBR = { 
  software: {
    title: "Foundation",
    description: "Plano de Investimento",
    version: "Versão 1.0.0",
    author: "Gustavo Noll",
    year: "2025",
    month: "Fevereiro",
    day: "20"
  },
  investmentPlan: {
    edit: {
      title: "Editar Plano de Investimento",
      success: "Plano de investimento atualizado com sucesso",
    },
    messages: {
      notFound: {
        title: "Plano de investimento não encontrado",
        description: "O plano que você está procurando não existe ou foi removido."
      }
    },
    details: {
      title: "Detalhes do Plano de Investimento",
      clientInfo: {
        title: "Informações do Cliente",
        name: "Nome",
        initialAge: "Idade Inicial",
        finalAge: "Idade Final",
        years: "anos"
      },
      planOverview: {
        title: "Visão Geral do Plano",
        initialAmount: "Valor Inicial",
        monthlyDeposit: "Depósito Mensal",
        requiredMonthlyDeposit: "Depósito Mensal Necessário",
        adjustContributionForInflation: "Aporte ajustado pela inflação anualmente",
        adjustIncomeForInflation: "Resgate ajustado pela inflação anualmente",
      },
      financialGoals: {
        title: "Objetivos Financeiros",
        desiredMonthlyIncome: "Renda Mensal Desejada",
        inflationAdjustedIncome: "Renda Ajustada pela Inflação",
        futureValue: "Meta Valor Futuro",
        presentFutureValue: "Meta Valor Real"
      },
      investmentParams: {
        title: "Parâmetros do Investimento",
        expectedReturn: "Retorno Esperado",
        inflationRate: "Taxa de Inflação",
        planType: "Tipo do Plano",
        status: "Status",
        types: {
          "1": "Encerrar",
          "2": "Deixar Herança",
          "3": "Não tocar no principal"
        },
        adjustContributionForInflation: "Ajuste do Aporte pela Inflação",
        adjustIncomeForInflation: "Ajuste do Resgate pela Inflação",
        enabled: "Ativado",
        disabled: "Desativado"
      }
    },
    form: {
      selectAge: "Selecione a idade",
      years: "anos",
      planEndAccumulationDate: "Data de Encerramento do Plano",
      initialAmount: "Valor Inicial",
      planInitialDate: "Data de Início do Plano",
      initialAge: "Idade Inicial",
      finalAge: "Idade Final",
      monthlyDeposit: "Depósito Mensal",
      desiredIncome: "Renda Mensal Desejada",
      lifeExpectancy: "Expectativa de Vida",
      riskProfile: "Perfil de Risco / Retorno IPCA+",
      inflationRate: "Taxa de Inflação Anual (%)",
      planType: "Tipo do Plano",
      createButton: "Criar Plano",
      creating: "Criando...",
      adjustContributionForInflation: "Ajustar aporte pela inflação anualmente",
      adjustIncomeForInflation: "Ajustar regaste pela inflação anualmente",
      advancedSettings: "Configurações Avançadas",
      endAge: "Idade de Encerramento",
      legacyAge: "Idade para Deixar Herança",
      keepAge: "Idade para Fim do Planejamento",
      legacyAmount: "Valor da Herança",
      currency: "Moeda",
      currencies: {
        BRL: "Real Brasileiro (R$)",
        USD: "Dólar Americano ($)",
        EUR: "Euro (€)"
      }
    },
    planTypes: {
      endAt120: "Encerrar",
      leave1M: "Deixar Herança",
      keepPrincipal: "Não tocar no principal"
    },
    riskProfiles: {
      conservative: "Conservador",
      moderate: "Moderado",
      aggressive: "Arrojado"
    },
    create: {
      title: "Criar Plano de Investimento",
      calculations: {
        title: "Valores Calculados",
        inflationAdjustedIncome: "Renda Ajustada pela Inflação",
        requiredFutureValue: "Valor Futuro",
        monthlyRealReturn: "Retorno Mensal Real",
        monthlyInflationReturn: "Retorno Mensal da Inflação",
        totalMonthlyReturn: "Retorno Mensal Total",
        requiredMonthlyDeposit: "Depósito Mensal Necessário para o Valor Futuro",
        necessaryFutureValue: "Necessário para renda desejada",
        fillRequired: "Preencha todos os campos obrigatórios para ver os cálculos",
        necessaryMonthlyDeposit: "Necessário para renda desejada"
      },
    },
  },
  dashboard: {
    title: "Portfólio de Investimentos",
    navigation: {
      finances: "Finanças",
      investmentPolicy: "Política de Investimento"
    },
    highlights: {
      startToInvest: "Você já deveria estar investindo!",
      title: "Destaques",
      tooltip: "Suas principais conquistas e marcos no plano de investimento",
      contributionStreak: "Sequência atual: {{months}} meses de aportes consistentes!",
      goalProgress: "Já conquistou {{progress}}% do objetivo (R$ {{amount}})",
      bestReturn: "Seu melhor mês teve retorno de {{return}}%",
      patrimonyGrowth: "Seu patrimônio cresceu {{growth}}% desde o início",
      planAge: "Seu plano completa {{months}} meses de jornada!",
      incomeProgress: "Já está gerando {{percentage}}% da renda mensal desejada",
      returnConsistency: "{{percentage}}% dos meses tiveram retornos positivos",
      futureValueProgress: "Já alcançou {{percentage}}% do valor futuro planejado",
      recordFrequency: "Você registra {{percentage}}% dos meses do seu plano",
      contributionDiscipline: "Você fez aportes em {{percentage}}% dos meses registrados",
      monthsToRetirement: "Faltam {{months}} meses para sua aposentadoria"
    },
    brokerName: "Corretor: {{name}}",
    cards: {
      portfolioValue: {
        title: "Valor Total do Portfólio",
        ytd: "No ano",
        amount: "R$ {{value}}",
        monthlyReturn: "de aumento no último mês",
        tooltip: "Valor baseado no ultimo registro financeiro."
      },
      contributions: {
        title: "Contribuição Total",
        subtitle: "Depósitos regulares",
        target: "Acordado",
        amount: "R$ {{value}}",
        required: "Necessário",
        tooltip: "Total de contribuições mensais no período selecionado.",
        inflationAdjusted: "Ajustado pela inflação",
        currentMonth: "Mês atual",
        total: "Total do período"
      },
      totalReturns: {
        title: "Rendimento",
        subtitle: "",
        amount: "R$ {{value}}",
        percentage: "+{{value}}%",
        tooltip: "Rendimentos do portfólio."
      }
    },
    charts: {
      portfolioPerformance: "Projeção Patrimonial"
    },
    nextSteps: {
      title: "Próximos Passos",
      items: {
        reviewStrategy: "Revisar sua estratégia de investimento",
        increaseContributions: "Considerar aumentar contribuições mensais",
        scheduleReview: "Agendar reunião de revisão do portfólio"
      }
    },
    buttons: {
      clientInfo: "Informações do Cliente",
      settings: "Configurações",
      logout: "Sair",
      back: "Voltar",
      financialRecords: "Registros Financeiros",
      investmentPlan: "Plano de Investimento",
      clientProfile: "Informações do Cliente",
      editPlan: "Editar Plano",
      financialGoals: "Objetivos Financeiros",
      events: 'Eventos',
    },
    messages: {
      contactBroker: {
        title: "Plano não encontrado",
        description: "Por favor, entre em contato com seu corretor para criar um plano de investimento."
      },
      logoutSuccess: "Desconectado com sucesso",
      logoutError: "Erro ao desconectar",
      noPlan: {
        title: "Sem Plano de Investimento",
        description: "Por favor, crie um plano de investimento para continuar."
      },
      errors: {
        fetchPlan: "Erro ao buscar plano de investimento",
        fetchProfile: "Erro ao buscar perfil do corretor"
      }
    },
    loading: "Carregando...",
    buttonGroups: {
      main: "Principal",
      planning: "Planejamento",
      management: "Gerenciamento",
    },
    planProgress: {
      retirement: "Aposentadoria",
      title: "Progresso do Plano",
      timeToRetirement: "Meses para Aposentadoria",
      tooltip: "Acompanhamento do seu plano de aposentadoria baseado nos dados atuais",
      currentAge: "Idade Atual",
      monthsToRetirement: "Meses para Aposentadoria",
      onTrack: "No Caminho Certo",
      needsAttention: "Precisa de Atenção",
      behind: "de atraso",
      monthlyContribution: "Contribuição Mensal",
      monthlyWithdrawal: "Renda Mensal",
      planned: "Planejado",
      projected: "Projetado",
      difference: "diferença",
      ageAtRetirement: "Idade na Aposentadoria"
    },
    investmentPlan: {
      title: "Detalhes do Plano de Investimento",
      timeline: "Linha do Tempo",
      financial: "Informações Financeiras",
      currentAge: "Idade Atual",
      finalAge: "Idade Final do Plano",
      lifeExpectancy: "Expectativa de Vida",
      initialCapital: "Capital Inicial",
      monthlyContribution: "Aporte Mensal",
      desiredWithdrawal: "Resgate Desejado",
      adjustedWithdrawal: "Resgate Ajustado",
      planDuration: "Duração do Plano",
      planStart: "Início do Plano",
      duration: "Duração",
      years: "anos",
      months: "meses"
    },
  },
  brokerDashboard: {
    myProfile: "Meu Perfil",
    title: "Painel do Corretor",
    clientDeleted: "Cliente excluído com sucesso",
    search: {
      title: "Buscar Clientes",
      placeholder: "Buscar por nome ou email...",
      button: "Buscar",
      searching: "Buscando...",
      results: "Clientes",
      noResults: "Nenhum cliente encontrado"
    },
    buttons: {
      newClient: "Novo Cliente",
      logout: "Sair",
      search: "Buscar"
    },
    client: {
      pendingPlan: "Plano Pendente",
      id: "ID",
      name: "Nome",
      email: "Email",
      outdatedRecord: "Registro Desatualizado",
      monthlyReturn: "Retorno Mensal",
      pendingPlanTooltip: "Cliente sem plano de investimento cadastrado",
      outdatedRecordTooltip: "Sem registros há {{months}} meses",
      neverRecordedTooltip: "Nunca registrado",
      monthlyReturnTooltip: "Porcentagem de retorno no último mês",
      lowReturns: "Retornos Baixos",
      lowReturnsTooltip: "Retornos abaixo de 0.5%",
      belowRequiredContribution: "Aportes Insuficientes",
      belowRequiredContributionTooltip: "Aportes abaixo do necessário",
      lastActivity: "Última Atividade",
      shareTooltip: "Compartilhar link de acesso do cliente",
      deleteTooltip: "Excluir cliente",
      deleteWarning: "Esta ação não pode ser desfeita",
      deleteClient: {
        title: "Excluir cliente",
        description: "Tem certeza que deseja excluir este cliente? Esta ação irá remover permanentemente todos os dados do cliente, incluindo planos de investimento, registros financeiros e objetivos."
      }
    },
    metrics: {
      totalClients: "Total de Clientes",
      withPlan: "Com Plano",
      totalBalance: "Saldo Total",
      activeRecords: "Registros em Dia",
      outdatedRecords: "Registros Desatualizados",
      totalPatrimony: "Patrimônio Total",
      wealthDistribution: {
        title: "Distribuição de Patrimônio",
        clientCount: "Quantidade de Clientes",
        tooltips: {
          needsPlanReview: "Clientes que precisam revisar seu plano de investimentos por mudanças significativas ou por estar há mais de 12 meses sem atualização.",
          belowRequiredContribution: "Clientes cujos aportes mensais estão abaixo do valor necessário para atingir os objetivos do plano de investimentos.",
          nearRetirement: "Clientes a menos de 2 anos da idade planejada para aposentadoria e precisam de atenção especial na transição.",
          lowReturns: "Clientes com retornos mensais consistentemente abaixo de 0.5% nos últimos 3 meses, indicando necessidade de ajuste na estratégia."
        }
      },
      planning: {
        title: "Métricas de Planejamento",
        averageAge: "Idade Média",
        averageRetirementAge: "Idade Média Aposentadoria",
        averageDesiredIncome: "Renda Média Desejada",
        planTypes: {
          title: "Tipos de Planos",
          endAt120: "Encerrar",
          leave1M: "Herança",
          keepPrincipal: "Principal",
          count: "{{count}} clientes"
        }
      },
      trends: {
        title: "Tendências",
        newClientsThisMonth: "Novos Clientes (Mês)",
        totalGrowthThisMonth: "Crescimento (Mês)",
        averageMonthlyGrowth: "Crescimento Médio Mensal",
        inactiveClients: "Clientes Inativos",
        tooltip: {
          newClients: "Clientes que iniciaram neste mês",
          totalGrowth: "Crescimento total no mês atual",
          averageGrowth: "Média de crescimento mensal por cliente",
          inactive: "Clientes sem registros nos últimos 6 meses"
        }
      },
      actions: {
        clients: "Clientes",
        title: "Ações Necesfsárias",
        needsPlanReview: "Revisão de Plano",
        belowRequiredContribution: "Aportes Abaixo do Necessário",
        nearRetirement: "Próximos da Aposentadoria",
        lowReturns: "Retornos Baixos",
        tooltip: {
          needsPlanReview: "Clientes que precisam revisar seu plano",
          belowContribution: "Clientes com aportes abaixo do necessário",
          nearRetirement: "Clientes próximos da aposentadoria",
          lowReturns: "Clientes com retornos abaixo do esperado"
        }
      }
    },
    messages: {
      error: {
        title: "Erro",
        fetchClients: "Erro ao buscar clientes",
        search: "Erro ao realizar busca",
        unauthorized: "Acesso não autorizado. Apenas corretores podem acessar esta área."
      }
    },
    share: "Compartilhar",
    shareWithClient: "Compartilhar com Cliente",
    linkCopied: "Link copiado com sucesso!",
    loading: "Verificando permissões..."
  },
  common: {
    notInformed: "Não informado",
    every: "a cada",
    change: "Alterar",
    selectMonth: "Selecione o mês",
    selectYear: "Selecione o ano",
    formErrors: "Erros de validação",
    and: "e",
    name: "Nome",
    enterName: "Digite o nome do objetivo ou evento",
    year: "Ano",
    month: "Mês",
    value: "Valor",
    success: "Sucesso",
    saving: "Salvando..",
    addNew: "Adicionar Novos",
    custom: "Personalizado",
    months: "Meses",
    last1YearS: "1A",
    last5YearsS: "5A",
    last10YearsS: "10A",
    all: "Todos",
    allTime: "Todos os Tempos",
    last6Months: "Últimos 6 Meses",
    last12Months: "Últimos 12 Meses",
    last24Months: "Últimos 24 Meses",
    error: "Erro",
    errors: {
      tryAgain: "Por favor, tente novamente."
    },
    no: "Não",
    yes: "Sim",
    notAvailable: "N/A",
    loading: "Carregando...",
    back: "Voltar",
    cancel: "Cancelar",
    save: "Salvar",
    delete: "Excluir",
    edit: "Editar",
    create: "Criar",
    reset: "Resetar",
    logout: "Sair",
    update: "Atualizar",
    add: "Adicionar",
    select: "Selecione",
    confirmDelete: "Tem certeza que deseja excluir este item?",
    current: "Atual",
    required: "Necessário",
    target: "Meta",
    projected: "Projetado",
    years: "anos",
    showing: 'Mostrando',
    of: 'de',
    items: 'itens',
    view: 'Visualizar',
    minimize: 'Minimizar',
    maximize: 'Maximizar',
  },
  createClient: {
    title: "Criar Novo Cliente",
    form: {
      name: {
        label: "Nome",
        placeholder: "Digite o nome do cliente"
      },
      email: {
        label: "Email",
        placeholder: "Digite o email do cliente"
      },
      password: {
        label: "Senha",
        placeholder: "Digite a senha"
      },
      birthDate: {
        label: "Data de Nascimento",
        placeholder: "Digite a data de nascimento do cliente"
      }
    },
    buttons: {
      cancel: "Cancelar",
      create: "Criar Cliente",
      creating: "Criando..."
    },
    messages: {
      success: {
        title: "Sucesso",
        description: "Cliente criado com sucesso"
      },
      error: {
        title: "Erro",
        description: "Erro ao criar cliente"
      }
    }
  },
  monthlyView: {
    loadMore: "Carregar Mais",
    downloadCSV: "Baixar CSV",
    noData: "Nenhum dado disponível",
    timeWindows: {
      allTime: "Todos os Tempos",
      last6Months: "Últimos 6 Meses",
      last12Months: "Últimos 12 Meses",
      last24Months: "Últimos 24 Meses"
    },
    title: "Desempenho Mensal",
    tabs: {
      chart: "Visualização em Gráfico",
      table: "Histórico",
      returnChart: "Comparação de Retorno",
      balanceChart: "Comparação de Saldo",
      futureProjection: "Projeção Futura"
    },
    chart: {
      accumulatedReturn: "Retorno Acumulado",
      accumulatedCDIReturn: "Retorno CDI Acumulado",
      accumulatedIPCAReturn: "Retorno IPC-A Acumulado",
      accumulatedUSCPIReturn: "Retorno CPI EUA Acumulado",
      accumulatedEuroCPIReturn: "Retorno CPI Euro Acumulado",
      accumulatedTargetReturn: "Rentabilidade Alvo Acumulada",
      endBalance: "Saldo Final",
      contribution: "Contribuição",
      monthlyReturn: "Retorno Mensal",
      targetRentability: "Rentabilidade Alvo"
    },
    table: {
      headers: {
        month: "Mês",
        initialBalance: "Saldo Inicial",
        contribution: "Contribuição", 
        returns: "Rendimento",
        returnPercentage: "Rendimento %",
        endBalance: "Saldo Final",
        targetRentability: "Rentabilidade Alvo"
      },
      months: {
        january: "Janeiro",
        february: "Fevereiro",
        march: "Março",
        april: "Abril",
        may: "Maio",
        june: "Junho",
        july: "Julho",
        august: "Agosto",
        september: "Setembro",
        october: "Outubro",
        november: "Novembro",
        december: "Dezembro"
      }
    },
    futureProjection: {
      age: "Idade",
      year: "Ano",
      contribution: "Aporte",
      ipcaRate: "IPCA",
      effectiveRate: "Meta Retorno",
      withdrawal: "Retirada",
      balance: "Evolução Real",
      expandYear: "Expandir detalhes mensais",
      collapseYear: "Recolher detalhes mensais",
      projectedBalance: "Projeção Financeira",
      monthlyDetails: "Mês",
      cashFlow: "Fluxo de Caixa",
      historical: 'Histórico',
      goalsEventsImpact: 'Objetivos e Eventos',
      strategies: {
        fixed: "Renda Desejada",
        preservation: "Preservação",
        legacy: "Herança",
        spendAll: "Gastar Tudo"
      }
    }
  },
  expenseChart: {
    pastYears: "Anos atrás",
    futureYears: "Anos no futuro",
    portfolioValue: "Valor do Portfólio",
    inflationAdjusted: "Ajustado pela Inflação",
    actualValue: "Evolução Real",
    actualValueReal: "Evolução Real",
    actualValueProjection: "Evolução Projetada",
    projectedValue: "Projeção Financeira",
    projectedValueReal: "Projeção Financeira Real",
    years: "anos",
    goalAchievement: "Meta atingida",
    realValues: "Valores Reais",
    nominalValues: "Valores Nominais",
    realValuesTooltip: "Valores ajustados pela inflação, mostrando o poder de compra real ao longo do tempo",
    nominalValuesTooltip: "Valores nominais, sem ajuste pela inflação, mostrando o valor bruto ao longo do tempo",
    addNewGoal: "Adicionar Novo Objetivo",
    addNewEvent: "Adicionar Novo Evento",
    clickToAdd: "Clique em um ponto do gráfico para adicionar um objetivo ou evento",
    selectedDate: "Data Selecionada",
    selectedMonth: "Mês Selecionado",
    selectedYear: "Ano Selecionado",
    showNegativeValues: "Com Valores Negativos",
    hideNegativeValues: "Sem Valores Negativos"
  },
  budgetCategories: {
    categories: {
      Housing: "Moradia",
      Food: "Alimentação",
      Transportation: "Transporte",
      Entertainment: "Entretenimento"
    }
  },
  savingsGoal: {
    title: "Meta de Investimento",
    tooltip: "Acompanhe seu progresso em direção à sua meta de investimento. O gráfico mostra quanto você já acumulou em relação ao valor necessário para sua aposentadoria.",
    currentValue: "Valor Atual: {{value}}",
    returnRate: "Taxa de retorno: {{value}}% a.a.",
    projectedAge: {
      label: "Idade Projetada:",
      years: " anos",
      months: " meses",
      aheadOfSchedule: "Adiantado em {{years}} anos e {{months}} meses",
      behindSchedule: "Atrasado em {{years}} anos e {{months}} meses",
      aheadOfScheduleMonths: "Adiantado em {{months}} meses",
      behindScheduleMonths: "Atrasado em {{months}} meses"
    },
    goal: {
      meta: "Meta",
      planned: "Planejado",
      projected: "Projetado",
      goalPresentValue: "Meta",
      goalFutureValue: "Meta (Valor Futuro)",
      plannedFutureValue: "Planejado (Valor Futuro)",
      projectedFutureValue: "Projetado (Valor Futuro)",
      targetAge: "Idade Alvo: {{age}} anos",
      projectedValue: "Projetado (Valor Projetado)"
    },
    ageNotAvailable: "Idade projetada não disponível",
    metaNotAchieved: "Meta não será atingida na idade projetada"
  },
  financialRecords: {
    confirmIPCASync: "Tem certeza que deseja sincronizar os registros financeiros com o IPCA?",
    ipcaSyncSuccess: "{{count}} IPCA sincronizado com sucesso",
    ipcaSyncZeroRecords: "Nenhum registro financeiro diferente do IPCA para sincronizar",
    syncIPCA: "Sincronizar IPCA",
    editTitle: "Editar Registro Financeiro",  
    updateSuccess: "Registro atualizado com sucesso",
    partialImport: "Importação Parcial",
    importErrors: "Erros de Importação",
    monthlyContribution: "Contribuição Mensal",
    title: "Registros Financeiros",
    addNew: "Adicionar Novo",
    startingBalance: "Saldo Inicial",
    endingBalance: "Saldo Final",
    growth: "Rendimento",
    noRecords: "Nenhum registro financeiro encontrado",
    new: {
      title: "Novo Registro Financeiro"
    },
    form: {
      year: "Ano",
      basicInfo: "Informações Básicas",
      balances: "Saldo",
      contributions: "Contribuições",
      returns: "Rendimentos",
      month: "Mês",
      startingBalance: "Saldo Inicial",
      monthlyContribution: "Contribuição Mensal",
      monthlyReturn: "Rendimento Mensal",
      monthlyReturnRate: "Taxa de Rendimento Mensal (%)",
      endingBalance: "Saldo Final",
      targetRentability: "Rentabilidade Alvo (%)",
      submit: "Salvar Registro",
      goalsAndEvents: 'Objetivos e Eventos Pendentes',
      noGoalsOrEvents: 'Não há objetivos ou eventos pendentes para este período',
      goals: 'Objetivos',
      events: 'Eventos',
      selectedTotal: 'Saldo de Eventos Selecionados',
      eventsBalance: 'Saldo de Eventos'
    },
    importTitle: "Importar Registros",
    importInstructions: "Selecione um arquivo CSV ou TXT com os registros financeiros. O arquivo deve seguir o formato abaixo:",
    importSuccess: "Registros importados com sucesso",
    confirmDelete: "Tem certeza que deseja excluir este registro?",
    deleteSuccess: "Registro excluído com sucesso",
    confirmReset: "Tem certeza que deseja resetar todos os registros? Esta ação não pode ser desfeita.",
    resetSuccess: "Registros resetados com sucesso",
    errors: {
      ipcaSyncFailed: "Erro ao sincronizar IPCA",
      fetchFailed: "Erro ao buscar registros financeiros",
      createFailed: "Erro ao criar registro financeiro",
      duplicateRecord: "Registro Duplicado",
      recordExists: "Já existe um registro para {{month}} de {{year}}",
      dataFetchFailed: "Erro ao buscar dados iniciais",
      futureDate: "Data Inválida",
      futureDateDescription: "Não é possível adicionar registros para datas futuras",
      deleteFailed: "Erro ao excluir registro",
      importFailed: "Erro ao importar registros",
      resetFailed: "Erro ao resetar registros",
      invalidFormat: "Formato de arquivo inválido",
      emptyFields: "Por favor, preencha todos os campos obrigatórios",
      beforePlanInitialDate: "Data anterior ao início do plano",
      beforePlanInitialDateDescription: "O registro não pode ser criado antes de {{date}} (data inicial do plano)."
    },
    success: {
      updated: "Registro financeiro atualizado com sucesso",
      created: "Registro financeiro criado com sucesso"
    },
    importButton: "Importar CSV",
    chooseFile: 'Escolher arquivo CSV',
    resetRecords: 'Resetar Registros'
  },
  clientProfile: {
    title: 'Informações do Cliente',
    loading: 'Carregando...',
    backToDashboard: 'Voltar ao Dashboard',
    profileSection: 'Dados Pessoais',
    passwordSection: 'Alterar Senha',
    email: 'E-mail',
    fullName: 'Nome Completo',
    birthDate: 'Data de Nascimento',
    newPassword: 'Nova Senha',
    confirmPassword: 'Confirmar Nova Senha',
    buttons: {
      edit: 'Editar',
      editPersonalData: 'Editar Dados Pessoais',
      save: 'Salvar',
      cancel: 'Cancelar',
      changePassword: 'Alterar Senha'
    },
    messages: {
      profileUpdateSuccess: 'Dados atualizados com sucesso',
      profileUpdateError: 'Erro ao atualizar dados',
      passwordUpdateSuccess: 'Senha alterada com sucesso',
      passwordUpdateError: 'Erro ao alterar senha',
      passwordMismatch: 'As senhas não coincidem',
      fillPasswords: 'Por favor, preencha ambos os campos de senha',
      passwordTooShort: 'A senha deve ter pelo menos 6 caracteres'
    }
  },
  settings: {
    title: 'Configurações',
    loading: 'Carregando...',
    backToDashboard: 'Voltar ao Dashboard',
    profileSection: 'Informações do Perfil',
    passwordSection: 'Alterar Senha',
    email: 'E-mail',
    fullName: 'Nome Completo',
    birthDate: 'Data de Nascimento',
    currentPassword: 'Senha Atual',
    newPassword: 'Nova Senha',
    confirmPassword: 'Confirmar Nova Senha',
    buttons: {
      edit: 'Editar',
      save: 'Salvar',
      cancel: 'Cancelar',
      changePassword: 'Alterar Senha'
    },
    messages: {
      profileUpdateSuccess: 'Perfil atualizado com sucesso',
      profileUpdateError: 'Erro ao atualizar perfil',
      passwordUpdateSuccess: 'Senha alterada com sucesso',
      passwordUpdateError: 'Erro ao alterar senha',
      passwordMismatch: 'As senhas não coincidem'
    }
  },
  financialGoals: {
    title: "Objetivos Financeiros",
    addNew: "Novo Objetivo",
    newGoal: "Novo Objetivo Financeiro",
    projected: "Objetivos Projetados",
    showCompleted: "Mostrar Objetivos Concluídos",
    hideCompleted: "Ocultar Objetivos Concluídos",
    messages: {
      createSuccess: "Objetivo criado com sucesso",
      createError: "Erro ao criar objetivo",
      deleteSuccess: "Objetivo removido com sucesso",
      deleteError: "Erro ao remover objetivo",
      priorityUpdateError: "Erro ao atualizar prioridades",
    },
    form: {
      name: "Nome do Objetivo",
      icon: "Ícone",
      assetValue: "Valor do bem",
      goalMonth: "Mês do objetivo",
      goalYear: "Ano do objetivo",
      isInstallment: "Parcelado?",
      installmentProject: "Parcelado?",
      selectInstallments: "Selecione o número de parcelas",
      installmentCount: "Número de parcelas",
      installmentInterval: "Intervalo entre parcelas (meses)"
    },
    labels: {
      assetValue: "Valor do bem",
      targetAmount: "Valor necessário"
    },
    icons: {
      house: "Casa",
      car: "Carro",
      travel: "Viagem",
      family: "Família",
      electronic: "Eletrônico",
      education: "Educação",
      hobby: "Hobby",
      professional: "Profissional",
      health: "Saúde",
      other: "Outro",
    },
  },
  events: {
    title: "Eventos Financeiros",
    addNew: "Novo Evento",
    newEvent: "Novo Evento Financeiro",
    projected: "Eventos Projetados",
    showCompleted: "Mostrar Eventos Concluídos",
    hideCompleted: "Ocultar Eventos Concluídos",
    messages: {
      createSuccess: "Evento criado com sucesso",
      createError: "Erro ao criar evento",
      deleteSuccess: "Evento removido com sucesso",
      deleteError: "Erro ao remover evento",
    },
    form: {
      name: "Nome do Evento",
      icon: "Ícone",
      assetValue: "Valor do evento",
      eventMonth: "Mês do evento",
      eventYear: "Ano do evento",
      isInstallment: "Parcelado?",
      installmentProject: "Parcelado?",
      selectInstallments: "Selecione o número de parcelas",
      installmentCount: "Número de parcelas",
      installmentInterval: "Intervalo entre parcelas (meses)",
      eventType: "Tipo do Evento",
      amount: "Valor",
      month: "Mês",
      year: "Ano"
    },
    labels: {
      assetValue: "Valor do evento",
      targetAmount: "Valor necessário"
    },
    types: {
      goal: "Meta",
      contribution: "Contribuição",
      other: "Outro"
    },
    icons: {
      goal: "Meta",
      contribution: "Contribuição",
      other: "Outro",
      house: "Casa",
      car: "Carro",
      travel: "Viagem",
      family: "Família",
      electronic: "Eletrônico",
      education: "Educação",
      hobby: "Hobby",
      professional: "Profissional",
      health: "Saúde",
    },
  },
  auth: {
    brokerInactive: "Corretor inativo. Entre em contato com o suporte para mais informações.",
    clientLogin: "Acesso do Cliente",
    brokerLogin: "Login",
    password: "Senha",
    enterPassword: "Digite sua senha",
    login: "Entrar",
    loginSuccess: "Login realizado com sucesso",
    invalidPassword: "Senha inválida",
    errorFetchingInfo: "Erro ao carregar informações do cliente",
    clientName: "Cliente: {{name}}",
    brokerName: "Corretor: {{name}}",
    enterEmail: "Digite seu e-mail",
    email: "E-mail",
    errors: {
      invalidCredentials: "Credenciais inválidas",
      sessionExpired: "Sessão expirada",
      networkError: "Erro de conexão",
      unknownError: "Erro desconhecido",
      unauthorized: "Acesso não autorizado. Apenas corretores e administradores podem acessar esta área."
    }
  },
  notFound: {
    title: "404",
    description: "Ops! Página não encontrada",
    returnHome: "Voltar para a Página Inicial"
  },
  error: {
    title: "Erro",
    description: "Ocorreu um erro inesperado",
    tryAgain: "Tente novamente",
    contactSupport: "Entre em contato com o suporte"
  },
  loading: {
    title: "Carregando",
    description: "Por favor, aguarde enquanto carregamos os dados"
  },
  validation: {
    required: 'Todos os campos são obrigatórios',
    invalidEmail: 'Email inválido',
    invalidPassword: "Senha inválida",
    passwordsDontMatch: "As senhas não coincidem",
    minLength: "Mínimo de {{min}} caracteres",
    maxLength: "Máximo de {{max}} caracteres"
  },
  console: {
    error: {
      routeNotFound: "Erro 404: Usuário tentou acessar rota inexistente:"
    }
  },
  api: {
    errors: {
      fetchFailed: "Falha ao buscar dados",
      updateFailed: "Falha ao atualizar dados",
      createFailed: "Falha ao criar registro",
      deleteFailed: "Falha ao excluir registro",
      validationFailed: "Falha na validação dos dados"
    }
  },
  query: {
    errors: {
      notFound: "Registro não encontrado",
      unauthorized: "Acesso não autorizado",
      forbidden: "Acesso proibido",
      serverError: "Erro no servidor"
    }
  },
  navigation: {
    back: "Voltar",
    next: "Próximo",
    previous: "Anterior",
    first: "Primeiro",
    last: "Último",
    page: "Página",
    of: "de",
    items: "itens"
  },
  date: {
    formats: {
      short: "DD/MM/YYYY",
      long: "DD de MMMM de YYYY",
      time: "HH:mm",
      datetime: "DD/MM/YYYY HH:mm"
    },
    months: {
      january: "Janeiro",
      february: "Fevereiro",
      march: "Março",
      april: "Abril",
      may: "Maio",
      june: "Junho",
      july: "Julho",
      august: "Agosto",
      september: "Setembro",
      october: "Outubro",
      november: "Novembro",
      december: "Dezembro"
    },
    days: {
      monday: "Segunda-feira",
      tuesday: "Terça-feira",
      wednesday: "Quarta-feira",
      thursday: "Quinta-feira",
      friday: "Sexta-feira",
      saturday: "Sábado",
      sunday: "Domingo"
    }
  },
  adminDashboard: {
    top5BrokersByClients: "Top 5 Corretores por Clientes",
    top5BrokersByBalance: "Top 5 Corretores por Patrimônio",
    top5BrokersByPlans: "Top 5 Corretores por Planos",
    top5BrokersByActivity: "Top 5 Corretores por Atividade",
    averagePerClient: "Média por cliente",
    needReview: "precisam de revisão",
    title: 'Painel Administrativo',
    subtitle: 'Gerenciar corretores e monitorar métricas do sistema',
    createBroker: 'Criar Corretor',
    createBrokerDescription: 'Criar uma nova conta de corretor com email e senha.',
    brokerName: 'Nome do Corretor',
    brokerNamePlaceholder: 'Digite o nome do corretor',
    brokerEmail: 'Email',
    brokerEmailPlaceholder: 'Digite o email do corretor',
    brokerPassword: 'Senha',
    brokerPasswordPlaceholder: 'Digite a senha do corretor',
    brokerCreated: 'Corretor criado com sucesso',
    brokersList: 'Lista de Corretores',
    broker: 'Corretor',
    status: 'Status',
    active: 'Ativo',
    inactive: 'Inativo',
    actions: 'Ações',
    brokerActivated: 'Corretor ativado com sucesso',
    brokerDeactivated: 'Corretor desativado com sucesso',
    filterStatus: 'Filtrar por Status',
    allStatus: 'Todos',
    activeOnly: 'Somente Ativos',
    inactiveOnly: 'Somente Inativos',
    deactivateClient: 'Desativar Corretor',
    activateClient: 'Ativar Corretor',
    clientDeactivated: 'Corretor desativado com sucesso',
    clientActivated: 'Corretor ativado com sucesso',
    clients: 'Clientes',
    plans: 'Planos',
    balance: 'Saldo',
    lastActivity: 'Última Atividade',
    activeClients: 'Clientes Ativos',
    totalBrokers: 'Total de Corretores',
    totalClients: 'Total de Clientes',
    totalPlans: 'Total de Planos',
    totalBalance: 'Saldo Total',
    clientsPerBroker: 'Clientes por Corretor',
    balancePerBroker: 'Saldo por Corretor',
    planDistribution: 'Distribuição de Planos',
    clientActivity: 'Atividade dos Clientes',
    searchPlaceholder: 'Buscar corretores...',
    loading: 'Carregando...',
    brokers: 'corretoras',
    errors: {
      unauthorized: 'Você não está autorizado a acessar esta página',
      emailExists: 'Este email já está em uso. Por favor, use outro email.'
    },
    showing: 'Mostrando',
    of: 'de',
    items: 'itens',
    showingItems: 'Mostrando {{from}} a {{to}} de {{total}} itens',
    page: 'Página',
    next: 'Próximo',
    previous: 'Anterior',
    first: 'Primeiro',
    last: 'Último',
    email: 'Email',
    activeRatio: 'Razão de Ativos',
    changePassword: 'Alterar Senha',
    changePasswordDescription: 'Digite sua nova senha abaixo. Certifique-se de que ela seja forte e segura.',
    newPassword: 'Nova Senha',
    newPasswordPlaceholder: 'Digite sua nova senha',
    confirmPassword: 'Confirmar Senha',
    confirmPasswordPlaceholder: 'Digite novamente sua nova senha',
    passwordChanged: 'Senha alterada com sucesso',
  },
  familyStructure: {
    title: 'Estrutura Familiar',
    maritalStatus: {
      label: 'Estado Civil',
      placeholder: 'Selecione o estado civil',
      options: {
        single: 'Solteiro',
        total_separation: 'Separação Total',
        partial_community: 'Comunhão Parcial',
        total_community: 'Comunhão Total'
      }
    },
    spouse: {
      name: {
        label: 'Nome do Cônjuge'
      },
      birthDate: {
        label: 'Data de Nascimento do Cônjuge',
        placeholder: 'dd/mm/aaaa'
      }
    },
    children: {
      title: 'Filhos',
      add: 'Adicionar Filho',
      name: {
        label: 'Nome',
        required: 'Nome é obrigatório'
      },
      birthDate: {
        label: 'Data de Nascimento',
        required: 'Data de nascimento é obrigatória',
        placeholder: 'dd/mm/aaaa'
      },
      age: 'Idade: {{age}} anos',
      remove: 'Remover filho'
    },
    messages: {
      success: 'Estrutura familiar atualizada com sucesso',
      error: 'Falha ao atualizar estrutura familiar',
      validation: {
        children: 'Todos os filhos devem ter nome e data de nascimento preenchidos'
      }
    }
  },
  professionalInformation: {
    title: 'Informações Profissionais',
    occupation: {
      label: 'Profissão',
      placeholder: 'Sua profissão',
      required: 'Profissão é obrigatória'
    },
    workDescription: {
      label: 'O que faz',
      placeholder: 'Descrição das suas atividades profissionais',
      required: 'Descrição do trabalho é obrigatória'
    },
    workLocation: {
      label: 'Onde trabalha',
      placeholder: 'Local de trabalho',
      required: 'Local de trabalho é obrigatório'
    },
    workRegime: {
      label: 'Regime de trabalho',
      placeholder: 'Selecione o regime de trabalho',
      required: 'Regime de trabalho é obrigatório',
      options: {
        pj: 'PJ',
        clt: 'CLT',
        public_servant: 'Funcionário Público'
      }
    },
    taxDeclarationMethod: {
      label: 'Como declara IR',
      placeholder: 'Selecione o método de declaração',
      required: 'Método de declaração de IR é obrigatório',
      options: {
        simplified: 'Simplificado',
        complete: 'Completo',
        exempt: 'Não Declara'
      }
    },
    messages: {
      success: 'Informações profissionais atualizadas com sucesso',
      error: 'Falha ao atualizar informações profissionais'
    }
  },
  investmentPolicy: {
    title: 'Política de Investimento',
    quickAccess: 'Acesso Rápido',
    sections: {
      professionalInformation: 'Informações Profissionais',
      familyStructure: 'Estrutura Familiar',
      budget: 'Orçamento',
      patrimonial: 'Situação Patrimonial',
      life: 'Informações de Vida',
      investmentPreferences: 'Preferências de Investimento'
    },
    lifeStage: {
      label: 'Momento de Vida',
      options: {
        accumulation: 'Acumulação de Patrimônio',
        enjoyment: 'Usufruto de Patrimônio',
        consolidation: 'Consolidação'
      }
    },
    hobbies: {
      label: 'Hobbies'
    },
    objectives: {
      label: 'Objetivos de Investimento'
    },
    insurance: {
      hasInsurance: 'Possui Seguro',
      hasHealthPlan: 'Possui Plano de Saúde'
    },
    messages: {
      success: 'Política de investimento atualizada com sucesso',
      error: 'Falha ao atualizar política de investimento'
    }
  },
  budget: {
    title: 'Orçamento',
    incomes: {
      title: 'Rendas',
      add: 'Adicionar Renda',
      remove: 'Remover renda',
      description: 'Descrição',
      amount: 'Valor',
      empty: 'Nenhuma renda cadastrada'
    },
    expenses: {
      title: 'Gastos',
      add: 'Adicionar Gasto',
      remove: 'Remover gasto',
      description: 'Descrição',
      amount: 'Valor',
      empty: 'Nenhum gasto cadastrado'
    },
    other: {
      title: 'Outros',
      bonus: 'Bônus',
      dividends: 'Dividendos',
      savings: 'Poupança'
    },
    messages: {
      success: 'Orçamento atualizado com sucesso',
      error: 'Falha ao atualizar orçamento',
      loadError: 'Falha ao carregar orçamento'
    }
  },
  patrimonial: {
    title: 'Situação Patrimonial',
    form: {
      name: 'Nome',
      value: 'Valor (R$)',
      location: 'Localização',
      country: 'País',
      description: 'Descrição',
      investments: {
        title: 'Investimentos',
        properties: {
          title: 'Imóveis',
          name: 'Nome do Imóvel',
          value: 'Valor (R$)',
          location: 'Localização',
          country: 'País',
          description: 'Descrição',
          add: 'Adicionar Imóvel',
          remove: 'Remover Imóvel',
          empty: 'Nenhum imóvel cadastrado'
        },
        liquid_investments: {
          title: 'Investimentos Líquidos',
          name: 'Nome do Investimento',
          value: 'Valor (R$)',
          location: 'Localização',
          country: 'País',
          description: 'Descrição',
          add: 'Adicionar Investimento',
          remove: 'Remover Investimento',
          empty: 'Nenhum investimento cadastrado'
        },
        participations: {
          title: 'Participações Societárias',
          name: 'Nome da Participação',
          value: 'Valor (R$)',
          location: 'Localização',
          country: 'País',
          description: 'Descrição',
          add: 'Adicionar Participação',
          remove: 'Remover Participação',
          empty: 'Nenhuma participação cadastrada'
        }
      },
      personal_assets: {
        title: 'Bens Pessoais',
        properties: {
          title: 'Imóveis',
          name: 'Nome do Imóvel',
          value: 'Valor (R$)',
          location: 'Localização',
          country: 'País',
          description: 'Descrição',
          add: 'Adicionar Imóvel',
          remove: 'Remover Imóvel',
          empty: 'Nenhum imóvel cadastrado'
        },
        vehicles: {
          title: 'Veículos',
          name: 'Nome do Veículo',
          value: 'Valor (R$)',
          location: 'Localização',
          country: 'País',
          description: 'Descrição',
          add: 'Adicionar Veículo',
          remove: 'Remover Veículo',
          empty: 'Nenhum veículo cadastrado'
        },
        valuable_goods: {
          title: 'Bens de Valor',
          name: 'Nome do Bem',
          value: 'Valor (R$)',
          location: 'Localização',
          country: 'País',
          description: 'Descrição',
          add: 'Adicionar Bem',
          remove: 'Remover Bem',
          empty: 'Nenhum bem cadastrado'
        }
      },
      liabilities: {
        title: 'Passivos',
        financing: {
          title: 'Financiamentos',
          name: 'Nome do Financiamento',
          value: 'Valor (R$)',
          location: 'Localização',
          country: 'País',
          description: 'Descrição',
          add: 'Adicionar Financiamento',
          remove: 'Remover Financiamento',
          empty: 'Nenhum financiamento cadastrado'
        },
        debts: {
          title: 'Dívidas',
          name: 'Nome da Dívida',
          value: 'Valor (R$)',
          location: 'Localização',
          country: 'País',
          description: 'Descrição',
          add: 'Adicionar Dívida',
          remove: 'Remover Dívida',
          empty: 'Nenhuma dívida cadastrada'
        }
      }
    },
    messages: {
      success: 'Situação patrimonial atualizada com sucesso',
      error: 'Falha ao atualizar situação patrimonial'
    }
  },
  life: {
    title: 'Vida',
    messages: {
      success: 'Informações de vida atualizadas com sucesso',
      error: 'Falha ao atualizar informações de vida'
    }
  },
  investmentPreferences: {
    title: 'Preferências de Investimento',
    messages: {
      success: 'Preferências de investimento atualizadas com sucesso',
      error: 'Falha ao atualizar preferências de investimento',
      toast: {
        success: {
          title: 'Sucesso',
          description: 'Preferências de investimento atualizadas com sucesso'
        },
        error: {
          title: 'Erro',
          description: 'Falha ao atualizar preferências de investimento'
        }
      }
    },
    form: {
      riskProfile: 'Perfil de Investimento',
      targetReturnReview: 'Revisão de Meta',
      maxBondMaturity: 'Prazos máximos dos títulos da carteira',
      fgcEventFeeling: 'Como você se sentiria em um evento de FGC?',
      maxFundLiquidity: 'Prazo máximo de liquidez dos fundos (D+X)',
      maxAcceptableLoss: 'Máxima perda aceitável',
      targetReturnIpcaPlus: 'Meta de Retorno (IPCA+X)',
      stockInvestmentMode: 'Modalidade de investimento em ações',
      realEstateFundsMode: 'Fundos imobiliários diretos ou FoFs',
      platformsUsed: 'Plataformas utilizadas',
      assetRestrictions: 'Restrição de ativos',
      areasOfInterest: 'Exposição em área de interesse',
      selectPeriod: 'Selecione o período',
      selectMaturity: 'Selecione o prazo',
      selectFeeling: 'Selecione sua sensação',
      selectLiquidity: 'Selecione o prazo',
      selectLoss: 'Selecione a perda',
      selectReturn: 'Selecione o retorno',
      selectMode: 'Selecione a modalidade',
      addPlatform: 'Adicionar Plataforma',
      addRestriction: 'Adicionar Restrição',
      addInterest: 'Adicionar Interesse',
      platform: 'Plataforma',
      restriction: 'Restrição',
      interest: 'Remover',
      remove: 'Remover',
      assetAllocations: 'Alocação de Ativos',
      totalAllocation: 'Total',
      selectAllocation: 'Selecione a alocação',
      allocation: {
        fixed_income_opportunities: 'Renda Fixa - Oportunidades',
        fixed_income_post_fixed: 'Renda Fixa - Pós Fixado',
        fixed_income_inflation: 'Renda Fixa - Inflação',
        fixed_income_pre_fixed: 'Renda Fixa - Pré Fixado',
        multimarket: 'Multimercado',
        real_estate: 'Imobiliário',
        stocks: 'Ações',
        stocks_long_biased: 'Ações - Long Biased',
        private_equity: 'Private Equity',
        foreign_fixed_income: 'Exterior - Renda Fixa',
        foreign_variable_income: 'Exterior - Renda Variável',
        crypto: 'Criptoativos'
      },
      allocationValidation: {
        totalMustBe100: 'A soma das alocações deve ser igual a 100%',
        currentTotal: 'atual: {{total}}%'
      }
    },
    options: {
      investmentModes: {
        direct_stocks: 'Ações Diretas',
        etfs: 'ETFs',
        stock_funds: 'Fundos de Ações'
      },
      targetReturns: {
        ipca_plus_1: 'IPCA + 1%',
        ipca_plus_2: 'IPCA + 2%',
        ipca_plus_3: 'IPCA + 3%',
        ipca_plus_4: 'IPCA + 4%',
        ipca_plus_5: 'IPCA + 5%',
        ipca_plus_6: 'IPCA + 6%',
        ipca_plus_7: 'IPCA + 7%',
        ipca_plus_8: 'IPCA + 8%',
        ipca_plus_9: 'IPCA + 9%',
        ipca_plus_10: 'IPCA + 10%',
        ipca_plus_11: 'IPCA + 11%'
      },
      reviewPeriods: {
        monthly: 'Mensal',
        quarterly: 'Trimestral',
        semiannual: 'Semestral',
        annual: 'Anual'
      },
      bondMaturities: {
        short_term: 'Curto Prazo (< 2 anos)',
        medium_term: 'Médio Prazo (2-5 anos)',
        long_term: 'Longo Prazo (> 5 anos)'
      },
      fgcFeelings: {
        very_comfortable: 'Muito Confortável',
        comfortable: 'Confortável',
        neutral: 'Neutro',
        uncomfortable: 'Desconfortável',
        very_uncomfortable: 'Muito Desconfortável'
      },
      fundLiquidity: {
        d_plus_0: 'Sem prazo',
        daily: 'Diário',
        d_plus_1: 'D+1',
        d_plus_2: 'D+2',
        d_plus_30: 'D+30',
        d_plus_90: 'D+90'
      },
      acceptableLoss: {
        no_loss: 'Sem perdas',
        five_percent: '5%',
        ten_percent: '10%',
        fifteen_percent: '15%',
        twenty_percent: '20%',
        twenty_five_percent: '25%'
      },
      realEstateFundModes: {
        direct_portfolio: 'Carteira de Fundos',
        fofs_consolidation: 'Consolidação em FoFs'
      }
    }
  },
  clientSummary: {
    predominantProfile: 'Perfil Predominante',
    personalInfo: 'Informações Pessoais',
    name: 'Nome',
    age: 'Idade',
    years: 'anos',
    email: 'E-mail',
    professionalInfo: 'Informações Profissionais',
    occupation: 'Profissão',
    workRegime: 'Regime de Trabalho',
    taxDeclaration: 'Declaração de IR',
    familyInfo: 'Informações Familiares',
    maritalStatus: 'Estado Civil',
    spouse: 'Cônjuge',
    children: 'Filhos',
    childrenCount: 'filhos',
    financialOverview: 'Visão Financeira',
    totalIncome: 'Renda Total',
    totalExpenses: 'Despesas Totais',
    savingsRate: 'Taxa de Poupança',
    investmentPreferences: 'Preferências de Investimento',
    targetReturn: 'Retorno Alvo',
    maxLoss: 'Perda Máxima Aceitável',
    investmentMode: 'Modalidade de Investimento',
    lifeObjectives: 'Objetivos de Vida',
    insuranceCoverage: 'Cobertura de Seguros',
    workDescription: 'Descrição do Trabalho',
    workLocation: 'Local de Trabalho',
    spouseName: 'Nome do Cônjuge',
    spouseAge: 'Idade do Cônjuge',
    childName: 'Nome do Filho',
    childAge: 'Idade do Filho',
    income: 'Renda',
    expense: 'Despesa',
    bonus: 'Bônus',
    dividends: 'Dividendos',
    savings: 'Poupança',
    lifeStage: 'Momento de Vida',
    hobbies: 'Hobbies',
    insuranceType: 'Tipo de Seguro',
    insuranceCompany: 'Seguradora',
    lastReview: 'Última Revisão',
    noData: 'Sem dados disponíveis',
    noChildren: 'Sem filhos',
    noInsurance: 'Sem seguros cadastrados',
    noObjectives: 'Sem objetivos cadastrados',
    noHobbies: 'Sem hobbies cadastrados',
    investments: 'Investimentos',
    properties: 'Imóveis',
    vehicles: 'Carros',
    valuableGoods: 'Bens de Valor',
    other: 'Outros',
    total: 'Total',
    information: 'Informações',
    riskProfile: {
      conservative: 'Conservador',
      moderate: 'Moderado',
      aggressive: 'Arrojado',
      notInformed: 'Não informado'
    }
  },
};
