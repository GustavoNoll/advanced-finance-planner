export const ptBR = { 
  software: {
    title: "NextWealth",
    description: "Plano de Investimento",
    version: "Versão 1.0.0",
    author: "Gustavo Noll",
    year: "2024",
    month: "Fevereiro",
    day: "20"
  },
  investmentPlan: {
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
      initialAmount: "Valor Inicial",
      planInitialDate: "Data de Início do Plano",
      initialAge: "Idade Inicial",
      finalAge: "Idade Final",
      monthlyDeposit: "Depósito Mensal",
      desiredIncome: "Renda Mensal Desejada",
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
      legacyAmount: "Valor da Herança"
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
    edit: {
      title: "Editar Plano de Investimento",
    }
  },
  dashboard: {
    title: "Portfólio de Investimentos",
    highlights: {
      startToInvest: "Você já deveria estar investindo!",
      title: "Destaques",
      tooltip: "Suas principais conquistas e marcos no plano de investimento",
      contributionStreak: "Sequência atual: {{months}} meses de aportes consistentes!",
      goalProgress: "Já conquistou {{progress}}% do objetivo (R$ {{amount}})",
      returnOnContributions: "Seus investimentos já renderam {{percentage}}% sobre os aportes",
      bestReturn: "Seu melhor mês teve retorno de {{return}}%",
      patrimonyGrowth: "Seu patrimônio cresceu {{growth}}% desde o início",
      planAge: "Seu plano completa {{months}} meses de jornada!"
    },
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
      difference: "diferença"
    },
  },
  brokerDashboard: {
    myProfile: "Meu Perfil",
    title: "Painel do Corretor",
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
        search: "Erro ao realizar busca"
      }
    },
    share: "Compartilhar",
    shareWithClient: "Compartilhar com Cliente",
    linkCopied: "Link copiado com sucesso!",
  },
  common: {
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
        January: "Janeiro",
        February: "Fevereiro",
        March: "Março",
        April: "Abril",
        May: "Maio",
        June: "Junho",
        July: "Julho",
        August: "Agosto",
        September: "Setembro",
        October: "Outubro",
        November: "Novembro",
        December: "Dezembro"
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
    addNewGoal: "Adicionar Novo Objetivo",
    addNewEvent: "Adicionar Novo Evento",
    clickToAdd: "Clique em um ponto do gráfico para adicionar um objetivo ou evento",
    selectedDate: "Data Selecionada",
    selectedMonth: "Mês Selecionado",
    selectedYear: "Ano Selecionado"
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
    ageNotAvailable: "Idade projetada não disponível",
    metaNotAchieved: "Meta não irá ser atingida na idade projetada",
    title: "Meta de Investimento",
    currentValue: "{{value}}",
    returnRate: "{{value}}% a.a.",
    goal: {
      label: "Meta: {{value}}",
      goalFutureValue: "Meta Futura: {{value}}",
      targetAge: "Idade Alvo: {{age}}",
      presentFutureValue: "Valor Real: {{value}}",
      goalPresentValue: "Meta: {{value}}",
      projectedValue: "Valor Futuro Projetado: {{value}}"
    },
    projectedAge:{
      label: "Idade Projetada:",
      years: " anos",
      months: " meses",
      aheadOfSchedule: "Avançado em {{years}} anos e {{months}} meses",
      behindSchedule: "Atrasado em {{years}} anos e {{months}} meses",
      behindScheduleMonths: "Atrasado em {{months}} meses",
      aheadOfScheduleMonths: "Avançado em {{months}} meses"
    },
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
      emptyFields: "Por favor, preencha todos os campos obrigatórios" 
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
      save: 'Salvar',
      cancel: 'Cancelar',
      changePassword: 'Alterar Senha'
    },
    messages: {
      profileUpdateSuccess: 'Dados atualizados com sucesso',
      profileUpdateError: 'Erro ao atualizar dados',
      passwordUpdateSuccess: 'Senha alterada com sucesso',
      passwordUpdateError: 'Erro ao alterar senha',
      passwordMismatch: 'As senhas não coincidem'
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
      icon: "Ícone",
      assetValue: "Valor do bem",
      goalMonth: "Mês do objetivo",
      goalYear: "Ano do objetivo",
      isInstallment: "Parcelado?",
      isInstallmentHelp: "Marque esta opção se o objetivo será pago em parcelas",
      installmentCount: "Número de parcelas"
    },
    labels: {
      assetValue: "Valor do bem",
      targetAmount: "Valor necessário"
    },
    icons: {
      house: "Casa",
      car: "Carro",
      education: "Educação",
      retirement: "Aposentadoria",
      travel: "Viagem",
      emergency: "Emergência",
      other: "Outro",
    },
  },
  events: {
    title: 'Eventos',
    addNew: 'Adicionar Novo Evento',
    projected: 'Eventos Projetados',
    showCompleted: 'Mostrar Eventos Concluídos',
    hideCompleted: 'Ocultar Eventos Concluídos',
    complete: 'Concluir',
    reopen: 'Reabrir',
    form: {
      name: 'Nome do Evento',
      amount: 'Valor',
      month: 'Mês',
      year: 'Ano',
    },
    messages: {
      createSuccess: 'Evento criado com sucesso',
      createError: 'Erro ao criar evento',
      deleteSuccess: 'Evento excluído com sucesso',
      deleteError: 'Erro ao excluir evento',
    },
  },
  auth: {
    clientLogin: "Acesso do Cliente",
    password: "Senha",
    enterPassword: "Digite sua senha",
    login: "Entrar",
    loginSuccess: "Login realizado com sucesso",
    invalidPassword: "Senha inválida",
    enterEmail: "Digite seu e-mail",
    errors: {
      invalidCredentials: "Credenciais inválidas",
      sessionExpired: "Sessão expirada",
      networkError: "Erro de conexão",
      unknownError: "Erro desconhecido"
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
    required: "Este campo é obrigatório",
    invalidEmail: "Email inválido",
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
  }
};
