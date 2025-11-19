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
      lifePlanTitle: "Editar Plano de Vida",
      success: "Plano de investimento atualizado com sucesso",
      successWithMicroPlans: "Plano de investimento e micro planos atualizados com sucesso",
      investmentPlan: "Plano de Investimento",
      microPlan: "Micro Plano",
      microPlanSuccess: "Micro plano atualizado com sucesso",
      microPlanError: "Erro ao atualizar micro plano",
      noActiveMicroPlan: "Nenhum micro plano ativo encontrado",
      saveMicroPlan: "Salvar Micro Plano",
      selectMicroPlan: "Selecione o micro plano",
      lifePlanInfo: {
        title: "Informações do Plano de Vida"
      }
    },
    messages: {
      notFound: {
        title: "Plano de investimento não encontrado",
        description: "O plano que você está procurando não existe ou foi removido."
      }
    },
    microPlans: {
      title: "Micro Planos de Investimento",
      createNew: "Criar Novo Micro Plano",
      createFirst: "Criar Primeiro Micro Plano",
      edit: "Editar Micro Plano",
      active: "Ativo",
      base: "Base",
      effectiveFrom: "Vigente desde",
      effectiveDate: "Data de Vigência",
      monthlyDeposit: "Depósito Mensal",
      desiredIncome: "Renda Desejada",
      expectedReturn: "Retorno Esperado",
      inflation: "Inflação",
      noPlans: "Nenhum micro plano encontrado",
      noPlansDescription: "Crie micro planos para gerenciar diferentes estratégias de investimento ao longo do tempo.",
      confirmDelete: "Tem certeza que deseja excluir este micro plano?",
      cannotDeleteBase: "Não é possível excluir o micro plano base",
      timeline: {
        title: "Timeline dos Micro Planos",
        disclaimer: {
          title: "Atenção",
          message: "Existe um micro plano com data de vigência anterior à data atual que não está ativo. Isso pode ocorrer quando não há registros financeiros para ativar automaticamente o micro plano. Considere verificar os registros financeiros ou ativar manualmente o micro plano apropriado.",
          showDetails: "Ver detalhes"
        },
        inflationAdjustment: {
          contributionToggle: "Contribuição ajustada pela inflação",
          withdrawalToggle: "Saque ajustado pela inflação"
        }
      },
      form: {
        effectiveDate: "Data de Vigência",
        monthlyDeposit: "Depósito Mensal",
        desiredIncome: "Renda Desejada",
        expectedReturn: "Retorno Esperado",
        inflation: "Taxa de Inflação",
        selectExpectedReturn: "Selecione o retorno esperado",
        firstPlanDateNote: "Para o primeiro micro plano, a data de vigência será igual à data de início do plano principal.",
        basePlanDateNote: "A data do micro plano base não pode ser editada. Para alterar a data, edite o plano principal.",
        cannotCreateBeforeBase: "Não é possível criar micro planos em datas anteriores ao micro plano base.",
        dateAlreadyUsed: "Já existe um micro plano para este mês/ano. Escolha uma data diferente.",
        adjustContributionForAccumulatedInflation: "Ajustar aporte pela inflação acumulada",
        adjustIncomeForAccumulatedInflation: "Ajustar resgate pela inflação acumulada"
      }
    },
    details: {
      title: "Parâmetros do Plano de Investimento",
      clientInfo: {
        title: "Informações do Cliente",
        name: "Nome",
        initialAge: "Idade Inicial",
        finalAge: "Idade Final",
        years: "anos"
      },
      currency: {
        title: "Moeda e Status",
        currency: "Moeda",
        createdAt: "Criado em"
      },
      planOverview: {
        title: "Visão Geral do Plano",
        initialAmount: "Valor Inicial",
        monthlyDeposit: "Depósito Mensal",
        requiredMonthlyDeposit: "Depósito Mensal Necessário",
        adjustContributionForInflation: "Aporte ajustado pela inflação",
        adjustIncomeForInflation: "Resgate ajustado pela inflação",
        adjustContributionForAccumulatedInflation: "Aporte ajustado pela inflação acumulada",
        adjustIncomeForAccumulatedInflation: "Resgate ajustado pela inflação acumulada",
      },
      financialGoals: {
        title: "Objetivos Financeiros",
        desiredMonthlyIncome: "Renda Mensal Desejada",
        inflationAdjustedIncome: "Renda Ajustada pela Inflação",
        futureValue: "Valor Futuro Necessário",
        presentFutureValue: "Valor Presente da Meta"
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
        adjustContributionForAccumulatedInflation: "Ajuste do Aporte pela Inflação Acumulada",
        adjustIncomeForAccumulatedInflation: "Ajuste do Resgate pela Inflação Acumulada",
        enabled: "Ativado",
        disabled: "Desativado"
      },
      calculations: {
        title: "Cálculos Baseados no Micro Plano Ativo",
        expectedReturn: "Retorno Esperado",
        inflation: "Inflação",
        returnRate: "Taxa de Retorno Real",
        realReturn: "Retorno Real Mensal",
        inflationReturn: "Retorno da Inflação Mensal",
        totalMonthlyReturn: "Retorno Total Mensal"
      }
    },
    form: {
      birthDate: "Data de Nascimento",
      selectAge: "Selecione a idade",
      years: "anos",
      planEndAccumulationDate: "Data de Encerramento do Plano",
      initialAmount: "Valor Inicial",
      initialAmountLockedMessage: "O valor inicial não pode ser alterado quando já existem registros financeiros para este cliente. Isso garante a integridade dos dados históricos.",
      planInitialDate: "Data de Início do Plano",
      planInitialDateLockedMessage: "A data de início do plano não pode ser alterada quando já existem registros financeiros para este cliente. Isso garante a integridade dos dados históricos.",
      initialAge: "Idade Inicial",
      finalAge: "Idade Final",
      monthlyDeposit: "Depósito Mensal",
      desiredIncome: "Renda Mensal Desejada",
      lifeExpectancy: "Expectativa de Vida",
      riskProfile: "Perfil de Risco / Retorno IPCA+",
      inflationRate: "Taxa de Inflação Anual (%)",
      adjustContributionForInflation: "Ajustar aporte pela inflação",
      adjustIncomeForInflation: "Ajustar resgate pela inflação",
      planType: "Tipo do Plano",
      createButton: "Criar Plano",
      creating: "Criando...",
      adjustContributionForAccumulatedInflation: "Ajustar aporte pela inflação acumulada",
      adjustIncomeForAccumulatedInflation: "Ajustar resgate pela inflação acumulada",
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
      },
      hasOldPortfolio: "Cliente possui carteira anterior",
      oldPortfolioProfitability: "Rentabilidade da Carteira Anterior (IPCA+)",
      selectProfitability: "Selecione a rentabilidade",
      effectiveDate: "Data de Vigência",
      effectiveDateLockedMessage: "A data de vigência não pode ser alterada para o micro plano ativo",
      expectedReturn: "Retorno Esperado",
      inflation: "Taxa de Inflação"
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
        futureValue: "Valor Futuro",
        presentFutureValue: "Valor Presente Futuro",
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
      planning: "Planejamento",
      investmentPolicy: "Política de Investimento",
      portfolioPerformance: "Performance"
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
        subtitle: "Ganhos totais",
        amount: "R$ {{value}}",
        percentage: "+{{value}}%",
        tooltip: "Rendimentos do portfólio."
      },
      retirementBalance: {
        title: "Diferença na Aposentadoria",
        subtitle: "Carteira Atual vs. Anterior",
        tooltip: "Diferença entre o valor atual e o valor da carteira anterior no ano de aposentadoria."
      }
    },
    charts: {
      portfolioPerformance: "Criação de Plano Inicial"
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
      editLifePlan: "Editar Plano de Vida",
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
        fetchProfile: "Erro ao buscar perfil do corretor",
        unauthorizedAccess: "Acesso não autorizado",
        clientNotAssociated: "Este cliente não está associado ao seu perfil de corretor",
        validationFailed: "Falha na validação de acesso"
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
      useOptimizedValue: "Usar valor otimizado",
      replaceWithOptimized: "Substituir pelo valor otimizado",
      applyOptimized: "Aplicar",
      optimizationApplied: "Otimização aplicada com sucesso",
      optimizationError: "Erro ao aplicar otimização",
      optimizationNotImplemented: "Otimização para este parâmetro ainda não foi implementada",
      noActiveMicroPlan: "Nenhum micro plano ativo encontrado",
      contributionOptimized: "Contribuição otimizada com sucesso",
      incomeOptimized: "Renda otimizada com sucesso",
      confirmOptimization: "Confirmar Otimização",
              confirmTimeToRetirement: "Isso irá alterar a data de fim do plano e a idade final baseada no valor projetado.",
              confirmMonthlyContribution: "Isso irá criar um novo micro plano com a contribuição mensal otimizada.",
              confirmMonthlyWithdrawal: "Isso irá criar um novo micro plano com a renda mensal otimizada.",
              microPlanExistsError: "Já existe um micro plano para esta data. Escolha uma data diferente.",
              birthDateNotFound: "Data de nascimento não encontrada",
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
      durationTooltip: "Calculado de {{startMonth}} até {{endMonth}}",
      years: "anos",
      months: "meses"
    },
  },
  brokerDashboard: {
    myProfile: "Meu Perfil",
    title: "Dashboard do Corretor",
    subtitle: "Inteligência Artificial para Gestão de Clientes",
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
      simulation: "Simular Projeção",
      logout: "Sair",
      search: "Buscar"
    },
    clientAccessAnalysis: {
      title: "Análise de Acessos dos Clientes",
      activityStatus: {
        title: "Status de Atividade",
        description: "Distribuição por tempo de inatividade",
        today: "Hoje",
        thisWeek: "Esta Semana",
        thisMonth: "Este Mês",
        inactive: "Inativos"
      },
      accessSummary: {
        title: "Resumo de Acessos",
        description: "Métricas dos últimos acessos",
        totalClients: "Total de Clientes",
        accessedToday: "Acessaram Hoje",
        accessedThisWeek: "Acessaram Esta Semana",
        inactive30Days: "Inativos 30+ Dias"
      }
    },
    charts: {
      wealthDistribution: "Distribuição de Patrimônio",
      wealthDistributionDescription: "Análise da distribuição de patrimônio por faixas de valor",
      totalClients: "Total de Clientes",
      totalValue: "Valor Total",
      averageValue: "Valor Médio",
      percentage: "Percentual",
      distributionBreakdown: "Distribuição Detalhada",
      clients: "clientes",
      contributionTrends: "Tendências de Contribuição",
      contributionTrendsDescription: "Evolução dos clientes que contribuem adequadamente nos 6 meses anteriores",
      adequateContributors: "Contribuidores Adequados",
      averageContributors: "Média de Contribuidores",
      averageContributorsDescription: "Média dos 6 meses",
      adequacyRate: "Taxa de Adequação",
      averageAdequacy: "Adequação Média",
      over6Months: "nos 6 meses anteriores",
      trendAnalysis: "Análise de Tendência",
      ofTotal: "de"
    },
    insights: {
      title: "Insights Inteligentes",
      subtitle: "Recomendações personalizadas baseadas em IA",
      engagement: "Engajamento",
      lastActivity: "Última Atividade",
      keyInsights: "Principais Insights",
      recommendations: "Recomendações",
      viewClient: "Ver Cliente",
      noInsights: "Nenhum insight disponível",
      noInsightsDescription: "Os insights aparecerão conforme os dados dos clientes forem analisados",
      today: "Hoje",
      yesterday: "Ontem",
      daysAgo: "há {{days}} dias",
      weeksAgo: "há {{weeks}} semanas",
      monthsAgo: "há {{months}} meses",
      lowEngagementInsight: "Cliente com baixo engajamento no sistema",
      boostEngagementRecommendation: "Enviar lembretes e materiais educativos",
      belowContributionInsight: "Contribuições abaixo do necessário para atingir objetivos",
      increaseContributionRecommendation: "Revisar plano e ajustar contribuições mensais",
      nearRetirementInsight: "Cliente próximo da aposentadoria",
      reviewRetirementPlanRecommendation: "Revisar estratégia de aposentadoria",
      highVolatilityInsight: "Portfolio com alta volatilidade",
      diversifyPortfolioRecommendation: "Diversificar investimentos para reduzir risco",
      lowReturnsInsight: "Retornos abaixo da média do mercado",
      optimizeStrategyRecommendation: "Otimizar estratégia de investimento",
      inconsistentContributionsInsight: "Contribuições irregulares",
      automateContributionsRecommendation: "Implementar contribuições automáticas",
      stablePerformanceInsight: "Performance estável e consistente",
      continueCurrentStrategyRecommendation: "Manter estratégia atual"
    },
    alerts: {
      title: "Alertas Inteligentes",
      subtitle: "Monitoramento em tempo real dos seus clientes",
      urgent: "Urgente",
      client: "Cliente",
      justNow: "Agora mesmo",
      hoursAgo: "há {{hours}} horas",
      daysAgo: "há {{days}} dias",
      viewAll: "Ver Todos",
      noAlerts: "Nenhum alerta",
      noAlertsDescription: "Todos os clientes estão com status normal",
      allAlerts: "Todos os Alertas",
      allAlertsDescription: "Visualize e gerencie todos os alertas dos seus clientes",
      warnings: "Avisos",
      info: "Informações",
      success: "Sucessos",
      urgentAttention: "Atenção Urgente",
      urgentDescription: "{{name}} precisa de atenção imediata",
      urgentNoRecords: "Sem Registros Financeiros",
      urgentNoRecordsDescription: "{{name}} não possui registros financeiros cadastrados",
      urgentNoPlan: "Cliente Sem Plano",
      urgentNoPlanDescription: "{{name}} não possui um plano de investimento cadastrado",
      urgentBelowContribution: "Contribuição Insuficiente",
      urgentBelowContributionDescription: "{{name}} está contribuindo abaixo do valor necessário",
      urgentLowEngagement: "Engajamento Crítico",
      urgentLowEngagementDescription: "{{name}} tem engajamento extremamente baixo ({{score}}/100) - risco de churn",
      urgentRetirement: "Aposentadoria em Risco",
      urgentRetirementDescription: "{{name}} está próximo da aposentadoria ({{years}} anos) mas contribuindo abaixo do necessário",
      contactClient: "Contatar Cliente",
      setupRecords: "Configurar Registros",
      createPlan: "Criar Plano",
      reviewContribution: "Revisar Contribuição",
      contactImmediately: "Contatar Imediatamente",
      reviewRetirementPlan: "Revisar Plano de Aposentadoria",
      rebalancePortfolio: "Rebalancear Portfolio",
      highPriority: "Alta Prioridade",
      highPriorityDescription: "{{name}} requer revisão prioritária",
      reviewClient: "Revisar Cliente",
      lowEngagement: "Baixo Engajamento",
      lowEngagementDescription: "{{name}} tem score de engajamento baixo ({{score}}/100)",
      highVolatility: "Alta Volatilidade",
      highVolatilityDescription: "{{name}} tem portfolio com alta volatilidade ({{volatility}}%)",
      boostEngagement: "Aumentar Engajamento",
      nearRetirement: "Próximo da Aposentadoria",
      nearRetirementDescription: "{{name}} está próximo da aposentadoria ({{years}} anos)",
      reviewPlan: "Revisar Plano",
      belowContribution: "Contribuição Insuficiente",
      belowContributionDescription: "{{name}} está contribuindo abaixo do necessário",
      adjustContribution: "Ajustar Contribuição",
      lowReturns: "Baixos Retornos",
      lowReturnsDescription: "{{name}} tem retorno mensal baixo ({{rate}}%)",
      optimizeStrategy: "Otimizar Estratégia",
      reviewRisk: "Revisar Risco"
    },
    simulation: {
      title: "Simulação de Projeção",
      creatingForClient: "Criando para cliente",
      createPlanFromSimulation: "Criar Plano da Simulação",
      creatingPlan: "Criando plano...",
      planCreatedSuccessfully: "Plano criado com sucesso!",
      planParameters: "Parâmetros do Plano",
      projectionChart: "Gráfico do Plano",
      projectionTable: "Tabela do Plano",
      simulationNotice: {
        title: "Simulação",
        description: "Esta é uma simulação baseada nos parâmetros informados. Nenhum dado será salvo no banco de dados. Use esta ferramenta para demonstrar diferentes cenários ao cliente."
      },
      planInitialDateDisabled: "Data fixada para simulações. Edite quando criar um plano real.",
      errors: {
        missingClientData: "Dados do cliente não encontrados"
      }
    },
    planCreation: {
      title: "Criação de Plano Inicial",
      creatingForClient: "Criando plano para cliente",
      createPlan: "Criar Plano",
      creatingPlan: "Criando plano...",
      planCreatedSuccessfully: "Plano criado com sucesso!",
      planParameters: "Parâmetros do Plano",
      planChart: "Gráfico do Plano",
      planTable: "Tabela do Plano",
      planNotice: {
        title: "Criação de Plano",
        description: "Configure os parâmetros do plano de investimento para o cliente. Este plano será salvo no banco de dados."
      },
      errors: {
        missingClientData: "Dados do cliente não encontrados"
      }
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
      lastLogin: "Último Login",
      never: "Nunca",
      shareTooltip: "Compartilhar link de acesso do cliente",
      simulationTooltip: "Simular Projeção",
      simulationDescription: "Visualizar gráfico de projeção sem salvar",
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
      totalBalance: "Patrimônio Total",
      totalPatrimony: "Patrimônio Total",
      activeRecords: "Registros Ativos",
      outdatedRecords: "Registros Desatualizados",
      averageReturn: "Retorno Médio",
      monthlyAverage: "Média Mensal",
      totalGrowth: "Crescimento Total",
      portfolioGrowth: "Crescimento do Portfolio",
      averageVolatility: "Volatilidade Média",
      riskLevel: "Nível de Risco",
      sharpeRatio: "Sharpe Ratio",
      riskAdjustedReturn: "Retorno Ajustado ao Risco",
      engagementScore: "Score de Engajamento",
      clientEngagement: "Engajamento do Cliente",
      activityDistribution: "Status de Atividade",
      helpers: {
        averageReturn: "Média aritmética dos retornos mensais apenas dos clientes com dados válidos nos últimos 12 meses",
        totalGrowth: "Soma do crescimento total (Valor atual - Valor inicial do plano) de todos os clientes",
        averageVolatility: "Desvio padrão dos retornos mensais apenas dos clientes com dados válidos, medindo a variabilidade dos ganhos/perdas",
        sharpeRatio: "Retorno médio dividido pela volatilidade apenas dos clientes com dados válidos, medindo eficiência do risco (maior = melhor)",
        engagementScore: "Score de 0-100 baseado na frequência de registros (0-60 pontos) + consistência de aportes vs meta do micro plano (0-40 pontos). Clientes que atingem a meta mensal e mantêm consistência alta recebem pontuação máxima",
        activityDistribution: "Distribuição dos clientes por status de atividade: Ativos (último registro < 3 meses), Desatualizados (3-6 meses, precisam acompanhamento), Em Risco (6-12 meses, atenção urgente), Inativos (> 12 meses), Sem Registros (nunca registraram dados financeiros)",
        activeRecords: "Clientes com atividade recente (último registro financeiro há menos de 3 meses)",
        outdatedRecords: "Clientes com atividade desatualizada (último registro há 3-12 meses) ou inativos (sem registros há mais de 12 meses)"
      },
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
        chartLabels: {
          newClients: "Novos Clientes",
          totalGrowth: "Crescimento Total",
          averageGrowth: "Crescimento Médio",
          inactiveClients: "Clientes Inativos"
        },
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
      },

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
    actions: "Ações",
    confirmDeleteTitle: "Confirmar exclusão",
    confirmDeleteMessage: "Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.",
    perYear: "por ano",
    perMonth: "por mês",
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
    confirm: "Confirmar",
    custom: "Personalizado",
    startDate: "Data Inicial",
    endDate: "Data Final",
    months: "Meses",
    time: "vez",
    times: "vezes",
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
    save_changes: 'Salvar alterações',
    theme: {
      light: 'Claro',
      dark: 'Escuro',
      toggle: 'Alternar tema'
    },
    search: 'Buscar',
    noItemsFound: 'Nenhum item encontrado',
    complete: 'Finalizar',
    itemWillBeCompleted: 'Este item será marcado como concluído',
    completeExplanation: {
      title: 'O que significa "Finalizar"?',
      description: 'Ao marcar como "Finalizar", o sistema irá:',
      steps: [
        'Somar todos os valores vinculados entre este item e os registros financeiros',
        'Marcar o item como concluído com o valor total acumulado',
        'Considerar a data do último registro vinculado como data de conclusão'
      ],
      note: 'Se não finalizar, o item permanece pendente e continua sendo considerado nas projeções financeiras nas datas planejadas, com os valores já vinculados aos registros financeiros sendo automaticamente descontados do valor total, mostrando apenas o valor restante que ainda precisa ser pago ou realizado.',
      pendingStatus: 'Status: Pendente',
      completedStatus: 'Status: Concluído',
      pendingDescription: 'O item continuará sendo considerado nas projeções financeiras nas datas planejadas.',
      completedDescription: 'O item não será mais considerado nas projeções financeiras futuras.'
    },
    allowNegativeValues: 'Use valores negativos para despesas/saídas',
    goalsAlwaysNegative: 'Objetivos são sempre despesas: o valor é negativo por padrão.',
    paidAmount: 'Valor pago',
    paidAmountHelp: 'Valor pago referente a este {{type}} vinculado. Ajuste conforme o que foi efetivamente pago neste mês.',
    linkedItems: 'Itens Vinculados',
    completed: 'Concluído',
    remove: 'Remover',
    deselect: 'Desselecionar',
    noLinkedItems: 'Nenhum item vinculado encontrado',
    goal: 'Objetivo',
    event: 'Evento',
    tryAgain: 'Tentar novamente',
    toggleStatus: 'Alternar status',
    loading: 'Carregando',
    partial: 'Parcial'
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
    downloadError: "Erro ao baixar CSV",
    noData: "Nenhum dado disponível",
    timeWindows: {
      allTime: "Todos os Tempos",
      last6Months: "Últimos 6 Meses",
      last12Months: "Últimos 12 Meses",
      last24Months: "Últimos 24 Meses",
      customRange: "Período Personalizado"
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
      title: "Gráfico de Retorno Acumulado",
      accumulatedReturn: "Retorno Acumulado",
      accumulatedCDIReturn: "Retorno CDI Acumulado",
      accumulatedIPCAReturn: "Retorno IPC-A Acumulado",
      accumulatedUSCPIReturn: "Retorno CPI EUA Acumulado",
      accumulatedEuroCPIReturn: "Retorno CPI Euro Acumulado",
      accumulatedOldPortfolioReturn: "Carteira Antiga Acumulada",
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
      projectedBalance: "Planejado",
      plannedBalance: "Planejado",
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
    projectedValue: "Planejado",
    projectedValueReal: "Planejado Real",
    oldPortfolioValue: "Carteira Antiga",
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
    hideNegativeValues: "Sem Valores Negativos",
    lifetimeIncome: "Renda Vitalícia",
    projectedLifetimeIncome: "Renda Vitalícia Projetada",
    plannedLifetimeIncome: "Renda Vitalícia Planejada",
    advancedOptions: "Opções Avançadas",
    oldPortfolioLifetimeIncome: "Renda Vitalícia da Carteira Antiga",
    valueType: "Tipo de Valor",
    display: "Exibição",
    noNegativeValues: "Sem Valores Negativos",
    advancedOptionsHelp: "Valores nominais mostram o valor bruto ao longo do tempo, sem ajuste pela inflação. Valores reais mostram o poder de compra real ao longo do tempo, ajustando pela inflação.",
    chartOptionsSection: "Mudanças nos Aportes/Retiradas",
    changeMonthlyDeposit: "Alterar Depósito Mensal",
    changeMonthlyWithdraw: "Alterar Retirada Mensal",
    newDepositValue: "Novo valor (valor inicial do plano: {{value}})",
    newWithdrawValue: "Novo valor (valor inicial do plano: {{value}})",
    changeDate: "Data da mudança",
    chartOptionsHelp: "O valor informado será aplicado a partir da data especificada, sem considerar inflação acumulada desde o início do plano. A inflação será aplicada apenas a partir da data da mudança.",
    showOldPortfolio: "Mostrar Carteira Antiga",
    showOldPortfolioHelp: "Mostra ou oculta a linha da carteira antiga no gráfico. Esta linha representa o valor que o cliente já possuía antes de iniciar o plano de investimento.",
    showProjectedLine: "Mostrar Linha de Projeção",
    showProjectedLineHelp: "Mostra ou oculta a linha laranja tracejada que representa a projeção financeira planejada.",
    showPlannedLine: "Mostrar Linha de Evolução Real",
    showPlannedLineHelp: "Mostra ou oculta a linha azul que representa a evolução real do patrimônio (dados reais e projetados).",
    chartOptions: "Opções do Gráfico",
    showRealValues: "Mostrar Valores Reais"
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
    currentPeriod: "Período Atual: {{month}}/{{year}}",
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
      eventsBalance: 'Saldo de Eventos',
      linkToGoalsEvents: 'Vincular a Objetivos/Eventos',
      linkDescription: 'Vincule este registro a objetivos ou eventos existentes ou crie novos',
      hide: 'Ocultar',
      link: 'Vincular',
      linkExisting: 'Vincular Existente',
      createNew: 'Criar Novo',
      goal: 'Objetivo',
      event: 'Evento',
      linkedItems: 'Itens Vinculados',
      ipcaReference: 'IPCA referente a {{date}}'
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
      created: "Registro financeiro criado com sucesso",
      linkConflictResolved: "Link existente atualizado com sucesso"
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
      passwordTooShort: 'A senha deve ter pelo menos 6 caracteres',
      samePassword: 'A nova senha deve ser diferente da senha atual'
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
    title_single: "Objetivo Financeiro",
    addNew: "Novo Objetivo",
    newGoal: "Novo Objetivo Financeiro",
    editGoal: "Editar Objetivo Financeiro",
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
      paymentMode: "Forma de Pagamento",
      noPaymentMode: "Sem parcelamento",
      installmentMode: "Parcelar valor",
      repeatMode: "Repetir valor",
      selectInstallments: "Selecione o número de parcelas",
      installmentCount: "Número de parcelas",
      repeatCount: "Número de repetições",
      installmentInterval: "Intervalo entre parcelas (meses)",
      repeatInterval: "Intervalo entre repetições (meses)"
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
    title_single: "Evento Financeiro",
    addNew: "Novo Evento",
    newEvent: "Novo Evento Financeiro",
    editEvent: "Editar Evento",
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
      repeatCount: "Número de repetições",
      installmentInterval: "Intervalo entre parcelas (meses)",
      repeatInterval: "Intervalo entre repetições (meses)",
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
      accident: "Acidente",
      renovation: "Renovação",
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
    activeBrokers: 'Corretores Ativos',
    totalBrokers: 'Total de Corretores',
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
      emailExists: 'Este email já está em uso. Por favor, use outro email.',
      samePassword: 'A nova senha deve ser diferente da senha atual'
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
    clientAccessAnalysis: {
      title: 'Análise de Acessos dos Clientes',
      activityStatus: {
        title: 'Status de Atividade',
        description: 'Distribuição por tempo de inatividade',
        today: 'Hoje',
        thisWeek: 'Esta Semana',
        thisMonth: 'Este Mês',
        inactive: 'Inativos'
      },
      accessSummary: {
        title: 'Resumo de Acessos',
        description: 'Estatísticas dos últimos acessos',
        totalClients: 'Total de Clientes',
        accessedToday: 'Acessaram hoje',
        accessedThisWeek: 'Acessaram esta semana',
        inactive30Days: 'Inativos há 30+ dias'
      },
      recentAccess: {
        title: 'Últimos Acessos de Clientes',
        description: 'Últimos 50 clientes que acessaram a plataforma',
        client: 'Cliente',
        broker: 'Broker',
        lastAccess: 'Último Acesso',
        status: 'Status',
        today: 'Hoje',
        yesterday: 'Ontem',
        days: 'dias',
        inactive: 'Inativo',
        never: 'Nunca'
      }
    },
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
      empty: 'Nenhum filho cadastrado',
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
      age: {
        years: '{{age}} anos',
        months: '{{age}} meses',
        year: '1 ano'
      },
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
    name: {
      label: 'Nome',
      placeholder: 'Seu nome completo',
      required: 'Nome é obrigatório'
    },
    birthDate: {
      label: 'Data de Nascimento',
      placeholder: 'Sua data de nascimento',
      required: 'Data de nascimento é obrigatória'
    },
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
      personalInformation: 'Informações Pessoais',
      professionalInformation: 'Informações Profissionais',
      familyStructure: 'Estrutura Familiar',
      budget: 'Orçamento',
      patrimonial: 'Patrimonial',
      life: 'Vida',
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
    save_changes: 'Salvar alterações em Situação Patrimonial',
    form: {
      name: 'Nome',
      value: 'Valor (R$)',
      location: 'Localização',
      country: 'País',
      description: 'Descrição',
      investments: {
        title: 'Investimentos',
        description: 'Cadastre seus investimentos, incluindo imóveis, investimentos líquidos, participações societárias e reserva de emergência',
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
        },
        emergency_reserve: {
          title: 'Reserva de Emergência',
          name: 'Nome da Reserva',
          value: 'Valor (R$)',
          location: 'Localização',
          country: 'País',
          description: 'Descrição',
          add: 'Adicionar Reserva',
          remove: 'Remover Reserva',
          empty: 'Nenhuma reserva cadastrada'
        }
      },
      personal_assets: {
        title: 'Bens Pessoais',
        description: 'Cadastre seus bens pessoais, incluindo imóveis, veículos e bens de valor',
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
        description: 'Cadastre seus passivos, incluindo financiamentos e dívidas',
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
  portfolioPerformance: {
    selectAll: "Selecionar Todos",
    newRecord: "Novo Registro",
    issuerExposure: {
      title: "Exposição por Emissor",
      limitDescription: "Limite de concentração: {{amount}} por emissor",
      legend: {
        insideLimit: "Dentro do limite",
        aboveLimit: "Acima do limite"
      },
      noData: "Sem dados",
      noMaturities: "N/A",
      maturityRange: "{{start}} ... {{end}} (+{{additional}} outros)",
      limitReferenceLabel: "Limite {{symbol}} {{shortAmount}}",
      tooltip: {
        exposure: "Exposição: {{value}}",
        assets: "Ativos: {{count}}",
        maturitiesTitle: "Vencimentos",
        limitExceeded: "Acima do limite em: {{value}}"
      }
    },
    performanceChart: {
      viewModes: {
        returns: "Retorno Acumulado",
        patrimony: "Seu patrimônio",
        growth: "Crescimento"
      },
      switchView: "Trocar",
      indicators: "Indicadores",
      selectIndicators: "Selecionar Indicadores",
      target: "Meta",
      targetNotAvailable: "(Não disponível)",
      periodButtons: {
        month: "Mês",
        year: "Ano",
        twelveMonths: "12M",
        all: "Ótimo",
        custom: "Personalizado"
      },
      customPeriod: {
        startPeriod: "Competência Inicial",
        endPeriod: "Competência Final",
        selectStart: "Selecionar a competência inicial",
        selectEnd: "Selecionar a competência final"
      },
      growthView: {
        showAll: "Ver Tudo",
        generatedIncome: "Renda Gerada",
        initialPatrimony: "Patrimônio Inicial",
        totalGrowth: "Crescimento Total",
        movement: "Movimentação:",
        financialGain: "Ganho Financeiro:",
        finalPatrimony: "Patrimônio Final:"
      },
      tooltips: {
        portfolio: "Portfolio",
        cdi: "CDI",
        target: "Meta",
        ipca: "IPCA",
        appliedPatrimony: "Patrimônio Aplicado",
        patrimony: "Patrimônio"
      },
      metrics: {
        snowballEffect: "Efeito bola de neve",
        snowballDescription: "sobre o patrimônio aplicado",
        averageGrowth: "Crescimento médio",
        perPeriod: "por período",
        totalGrowthPeriod: "Crescimento total no período",
        lastGeneratedIncome: "Última renda gerada",
        incomePercentage: "% do patrimônio",
        averageIncome12M: "Renda média (12M)",
        total: "Total:",
        vsTarget: "vs Meta",
        meta: "Meta",
        aboveTarget: "acima",
        belowTarget: "abaixo",
        ofTarget: "da meta",
        vsCDI: "vs CDI",
        ofCDIReturn: "do retorno do CDI",
        vsIPCA: "vs IPCA",
        aboveInflation: "acima",
        belowInflation: "abaixo",
        ofInflation: "da inflação"
      }
    },
    assetReturnsTable: {
      title: "Retorno por Ativo",
      columnsButton: "Colunas",
      dropdownLabel: "Exibir Colunas",
      columns: {
        asset: "Ativo",
        allocation: "Alocação / Qtd.",
        grossBalance: "Saldo Bruto",
        month: "Mês",
        year: "Ano",
        inception: "Início",
        issuer: "Emissor",
        institution: "Instituição",
        accountName: "Nome da Conta",
        maturity: "Vencimento",
        currency: "Moeda Origem"
      },
      summary: {
        balance: "Saldo",
        rentability: "Rentabilidade",
        rentabilityShort: "Rent."
      }
    },
    filters: {
      all: "Todos",
      allPeriods: "Todas competências",
      allInstitutions: "Todas instituições",
      allClasses: "Todas classes",
      allIssuers: "Todos emissores"
    },
    importCSV: {
      title: "Importar CSV",
      consolidatedDescription: "Importe dados consolidados de performance em formato CSV",
      detailedDescription: "Importe dados detalhados de performance em formato CSV",
      expectedFormat: "Formato Esperado",
      importFile: "Importar Arquivo",
      requiredColumns: "Colunas Obrigatórias",
      exampleData: "Exemplo de Dados",
      notes: {
        title: "Observações",
        dateFormat: "Data deve estar no formato DD/MM/YYYY",
        periodFormat: "Competência deve estar no formato MM/YYYY",
        currencyFormat: "Valores monetários podem estar em R$ com pontos e vírgulas (ex: R$ 1.234,56)",
        percentageFormat: "Percentuais podem estar com vírgula (ex: 1,24%)",
        duplicates: "Se houver registros duplicados, eles serão inseridos como novos registros"
      },
      importing: "Importando...",
      selectFile: "Selecionar Arquivo CSV",
      fileHint: "Clique para selecionar um arquivo CSV",
      successTitle: "Importação Bem-sucedida",
      partialSuccessTitle: "Importação Parcial",
      successMessage: "{{success}} registros importados com sucesso",
      partialSuccessMessage: "{{success}} registros importados com sucesso, {{failed}} falhas",
      errorRow: "Linha {{row}}: {{reason}}",
      moreErrors: "... e mais {{count}} erro(s)",
      button: "Importar CSV"
    },
    validation: {
      duplicateTitle: "Registro Duplicado",
      consolidatedDuplicate: "Já existe um registro com o mesmo Cliente, Instituição e Competência.",
      detailedDuplicate: "Já existe um registro com o mesmo Cliente, Instituição, Ativo, Posição e Competência.",
      invalidData: "Dados Inválidos",
      assetAndPositionRequired: "Ativo e Posição são obrigatórios.",
      updateSuccess: "Registro atualizado com sucesso",
      createSuccess: "Registro criado com sucesso",
      saveError: "Erro ao salvar",
      unknownError: "Erro desconhecido",
      invalidPeriod: "Período inválido",
      periodFormat: "Formato deve ser MM/YYYY",
      invalidMonth: "Mês deve estar entre 01 e 12",
      invalidYear: "Ano inválido"
    },
    competenceSelector: {
      noCompetenceFound: "Nenhuma competência encontrada",
      filterByPeriod: "Filtrar por Período:",
      from: "De:",
      to: "Até:",
      start: "Início",
      end: "Fim"
    },
    months: {
      short: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
    },
    dataManagement: {
      title: "Gerenciar Dados de Portfólio",
      back: "Voltar",
      filters: "Filtros",
      filterLabels: {
        periods: "Competências",
        institutions: "Instituições",
        assetClasses: "Classes de Ativo",
        issuers: "Emissores",
        search: "Buscar",
        searchPlaceholder: "Buscar por ativo, emissor ou classe...",
        verification: "Verificação"
      },
      tabs: {
        consolidated: "Dados Consolidados",
        detailed: "Dados Detalhados",
        consolidatedSubtitle: "Performance consolidada por competência e instituição"
      },
      addFilter: "+ Adicionar Filtro",
      columns: "Colunas",
      selectColumns: "Selecionar Colunas",
      columnsInfo: "Todas as colunas estão visíveis",
      selected: "selecionado(s)",
      clear: "Limpar",
      loading: "Carregando...",
      noData: "Nenhum dado",
      table: {
        period: "Competência",
        institution: "Instituição",
        currency: "Moeda",
        accountName: "Nome da Conta",
        initialAssets: "Patrimônio Inicial",
        movement: "Movimentação",
        taxes: "Impostos",
        financialGain: "Ganho Financeiro",
        finalAssets: "Patrimônio Final",
        finalAssetsShort: "Patrim. Final",
        yield: "Rendimento %",
        yieldShort: "Rend. %",
        actions: "Ações",
        asset: "Ativo",
        issuer: "Emissor",
        assetClass: "Classe",
        position: "Posição",
        rate: "Taxa",
        maturity: "Vencimento",
        verification: "Verificação"
      },
      viewDetailed: "Ver {{count}} ativo(s) detalhado(s)",
      createFromRecord: "Criar novo registro com base neste",
      edit: "Editar",
      editDialog: {
        edit: "Editar",
        create: "Criar",
        consolidatedData: "Dado Consolidado",
        detailedData: "Dado Detalhado",
        periodLabel: "Competência (MM/YYYY)",
        institutionLabel: "Instituição",
        currencyLabel: "Moeda",
        accountNameLabel: "Nome da Conta",
        accountNamePlaceholder: "Opcional - Nome da conta para diferenciar múltiplas contas",
        initialAssetsLabel: "Patrimônio Inicial",
        movementLabel: "Movimentação",
        taxesLabel: "Impostos",
        financialGainLabel: "Ganho Financeiro",
        finalAssetsLabel: "Patrimônio Final",
        yieldLabel: "Rendimento (%)",
        assetLabel: "Ativo",
        issuerLabel: "Emissor",
        assetClassLabel: "Classe do Ativo",
        positionLabel: "Posição",
        rateLabel: "Taxa",
        maturityLabel: "Vencimento",
        cancel: "Cancelar",
        save: "Salvar",
        invalidMonth: "Mês inválido (01-12)",
        invalidYear: "Ano inválido"
      },
      delete: {
        confirmTitle: "Confirmar Exclusão",
        confirmMessage: "Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.",
        confirmDeleteMultiple: "Confirmar Exclusão",
        confirmDeleteMultipleMessage: "Tem certeza que deseja excluir {{count}} registro(s) selecionado(s)? Esta ação não pode ser desfeita.",
        deleteButton: "Excluir",
        deleteSelected: "Excluir Selecionados",
        cancel: "Cancelar",
        success: "Registro excluído com sucesso",
        successMultiple: "{{count}} registro(s) excluído(s) com sucesso"
      },
      activeFilters: "Filtros:",
      clearAllFilters: "Limpar todos",
      quickFilters: "Filtros Rápidos",
      selectAll: "Selecionar Todas",
      selectAllColumns: "Selecionar Todas as Colunas",
      filterBuilder: {
        field: "Campo",
        selectField: "Selecione um campo",
        operator: "Operador",
        selectOperator: "Selecione um operador",
        value: "Valor",
        selectValue: "Selecione um valor",
        selectValues: "Selecione valores",
        selected: "selecionado(s)",
        enterValue: "Digite o valor",
        add: "Adicionar"
      },
      export: {
        button: "Exportar CSV",
        title: "Exportar Dados para CSV",
        description: "Escolha qual conjunto de dados você deseja exportar:",
        filtered: "Exportar dados filtrados",
        all: "Exportar todos os dados",
        recordsWithFilters: "registro(s) com os filtros atuais aplicados",
        recordsWithoutFilters: "registro(s) sem aplicar filtros",
        recordsExported: "registro(s) exportado(s) com sucesso.",
        success: "Exportação concluída",
        error: "Erro ao exportar",
        errorDescription: "Ocorreu um erro ao exportar os dados.",
        noData: "Nenhum dado para exportar",
        noDataDescription: "Não há dados disponíveis para exportação."
      },
      import: {
        consolidatedTitle: "Importar Dados Consolidados",
        detailedTitle: "Importar Dados Detalhados",
        description: "Escolha uma das opções abaixo para importar seus dados:",
        downloadTemplate: "1. Baixar arquivo exemplo",
        downloadTemplateDescription: "Baixe um arquivo CSV exemplo com o formato correto das colunas.",
        downloadTemplateButton: "Baixar Template CSV",
        uploadCSV: "2. Importar seu arquivo CSV",
        uploadCSVDescription: "Após preencher o arquivo, faça o upload do CSV para importar os dados.",
        selectCSV: "Selecionar arquivo CSV",
        uploadPDF: "3. Importar arquivo PDF",
        uploadPDFDescription: "Envie um PDF para processamento automático via n8n.",
        selectPDF: "Selecionar arquivo PDF",
        uploadingPDF: "Enviando PDF...",
        importing: "Importando...",
        columnOrder: "Ordem das colunas:",
        consolidatedColumnOrder: "Period → Institution → Currency → Account Name → Initial Assets → Movement → Taxes → Financial Gain → Final Assets → Yield",
        detailedColumnOrder: "Period → Institution → Currency → Account Name → Asset → Issuer → Asset Class → Position → Rate → Maturity → Yield",
        templateDownloaded: "Template baixado",
        templateDownloadedDescription: "Arquivo exemplo baixado com sucesso.",
        templateError: "Erro ao gerar template",
        templateErrorDescription: "Ocorreu um erro ao criar o arquivo exemplo.",
        invalidFile: "Arquivo inválido",
        invalidFileDescription: "Por favor, selecione um arquivo PDF.",
        pdfSuccess: "PDF enviado com sucesso",
        pdfSuccessDescription: "O PDF foi enviado para processamento. Os dados serão importados em breve.",
        pdfError: "Erro ao enviar PDF",
        pdfErrorDescription: "Ocorreu um erro ao enviar o PDF."
      },
      marketDataAudit: "Auditoria de Dados de Mercado",
      settings: "Configurações",
      verificationSettings: "Configurações de Verificação",
      correctThreshold: "Limite para \"Correto\" (R$)",
      correctThresholdDescription: "Diferenças abaixo deste valor serão marcadas como \"Correto\" (verde).",
      toleranceThreshold: "Limite para \"Tolerância\" (R$)",
      toleranceThresholdDescription: "Diferenças abaixo deste valor serão marcadas como \"Tolerância\" (amarelo) ao invés de \"Inconsistente\" (vermelho).",
      currentValue: "Valor atual:",
      howItWorks: "Como funciona:",
      differenceCorrect: "Diferença <",
      differenceTolerance: "Diferença <",
      differenceInconsistent: "Diferença ≥",
      correct: "Correto",
      tolerance: "Tolerância",
      inconsistent: "Inconsistente",
      invalidValue: "Valor Inválido",
      invalidToleranceValue: "Por favor, insira um valor de tolerância válido maior ou igual a zero.",
      invalidCorrectThreshold: "Por favor, insira um limite de 'Correto' válido maior ou igual a zero.",
      invalidConfiguration: "Configuração Inválida",
      correctMustBeLessThanTolerance: "O limite 'Correto' deve ser menor que o limite 'Tolerância'.",
      settingsSaved: "Configurações salvas",
      saving: "Salvando...",
      save: "Salvar",
      cancel: "Cancelar",
      error: "Erro",
      profileIdRequired: "ID do perfil não encontrado."
    },
    verification: {
      match: "OK",
      tolerance: "Tolerância",
      mismatch: "Divergência",
      noData: "Sem dados",
      unclassified: "não classificados",
      missingYield: "sem rentabilidade",
      summaryTitle: "Resumo de Verificação de Integridade",
      summarySubtitle: "organizados por competência",
      withUnclassified: "Com Não Classificados",
      withMissingYield: "Com Rentabilidade Faltando",
      assets: "ativos",
      integrity: "Verificação de Integridade",
      finalAssets: "Patrimônio Final:",
      detailedSum: "Soma Detalhada:",
      difference: "Diferença:",
      detailedRecords: "Registros Detalhados:",
      mismatchWarning: "Diferença significativa detectada. Verifique os ativos.",
      noDataWarning: "Nenhum dado detalhado encontrado para esta combinação.",
      classification: "Verificação de Classificação",
      classified: "Classificados:",
      unclassifiedLabel: "Não Classificados:",
      unclassifiedWarning: "{{count}} ativo(s) com classe inválida ou não classificada detectado(s).",
      unclassifiedHint: "Certifique-se de que a classe está na lista de opções válidas do dropdown.",
      profitability: "Verificação de Rentabilidade",
      withYield: "Com Rentabilidade:",
      withoutYield: "Sem Rentabilidade:",
      missingYieldWarning: "{{count}} ativo(s) sem campo \"Rendimento\" preenchido.",
      missingYieldHint: "Preencha o campo \"Rendimento\" para todos os ativos.",
      invalidClass: "Classe inválida ou não classificada",
      validClass: "Classe válida",
      hasYield: "Rentabilidade preenchida",
      status: "Status:",
      invalidClassWarning: "Classe inválida ou não classificada.",
      missingYieldWarningSingle: "Campo \"Rendimento\" não preenchido."
    },
    marketDataAudit: {
      title: "Auditoria de Dados de Mercado",
      subtitle: "Auditoria de dados de mercado por competência",
      back: "Voltar para Gerenciar Dados",
      ptax: "PTAX (Dólar)",
      cdi: "CDI",
      ipca: "IPCA",
      ibov: "IBOV",
      marketIndicators: "Outros Indicadores",
      competencesLoaded: "competências carregadas",
      consolidatedTableTitle: "Dados Consolidados por Competência",
      competence: "Competência",
      ptaxRate: "PTAX (R$/USD)",
      ptaxDate: "Data PTAX",
      cdiMonthly: "CDI Mensal",
      cdiAccumulated: "CDI Acumulado",
      ipcaMonthly: "IPCA Mensal",
      ipcaAccumulated: "IPCA Acumulado",
      ibovMonthly: "IBOV Mensal",
      sp500Monthly: "S&P 500 Mensal",
      tBondMonthly: "T-Bond Mensal",
      goldMonthly: "Ouro Mensal",
      btcMonthly: "Bitcoin Mensal",
      usCpiMonthly: "US CPI Mensal",
      euroCpiMonthly: "Euro CPI Mensal",
      loading: "Carregando...",
      noData: "Nenhum dado disponível",
      loadPtax: "Carregar PTAX",
      filters: "Filtros e Controles",
      filterStartPeriod: "Período Inicial",
      filterEndPeriod: "Período Final",
      filterStartYear: "Ano Inicial",
      filterEndYear: "Ano Final",
      allPeriods: "Todos os períodos",
      allYears: "Todos os anos",
      itemsPerPage: "Itens por página",
      clearFilters: "Limpar Filtros",
      selectColumns: "Selecionar Colunas",
      visibleColumns: "Colunas Visíveis",
      showingItems: "Mostrando {{from}} a {{to}} de {{total}} itens",
      previous: "Anterior",
      next: "Próximo",
      page: "Página",
      of: "de",
      apiInfo: {
        title: "Informações sobre as APIs",
        source: "Fonte",
        endpoint: "Endpoint"
      }
    },
    kpi: {
      manageData: "Gerenciar dados",
      totalAssets: "Patrimônio Total",
      noPreviousMonth: "Sem mês anterior para comparar",
      vsPreviousMonth: "vs mês anterior",
      monthlyYield: "Rentabilidade no mês",
      vsTarget: "vs Meta: ",
      diversification: "Diversificação",
      assetsInPortfolio: "Ativos na carteira",
      nextMaturity: "Próximo Vencimento",
      waitingData: "Aguardando dados",
      noInstitution: "Sem Instituição",
      sixMonthsReturn: "Rentabilidade de 6 meses",
      twelveMonthsReturn: "Rentabilidade de 12 meses",
      yearReturn: "Rentabilidade do ano",
      inceptionReturn: "Rentabilidade desde o início",
      rentability: "Rentabilidade",
      rentabilityVsTarget: "Rentabilidade (pp acima da meta)",
      bestMonthRentability: "Mês com melhor rentabilidade do ano",
      table: {
        title: "Resumo do Patrimônio",
        description: "Evolução patrimonial consolidada com retornos acumulados",
        period: "Competência",
        initialAssets: "Patrimônio Inicial",
        movement: "Movimentações",
        taxes: "Imposto",
        finalAssets: "Patrimônio Final",
        gain: "Rendimento",
        total: "Total"
      },
      investmentDetails: {
        title: "Detalhamento dos Investimentos",
        strategy: "Estratégia",
        month: "Mês",
        year: "Ano",
        sixMonths: "6 Meses",
        twelveMonths: "12 Meses",
        inception: "Início",
        noData: "Nenhum dado disponível",
        performance: {
          excellent: "Excelente",
          good: "Bom",
          regular: "Regular",
          negative: "Negativo"
        }
      },
      strategyBreakdown: {
        title: "Classes",
        name: "Nome",
        allocation: "Alocação",
        grossBalance: "Saldo Bruto",
        grossPatrimony: "Patrimônio Bruto",
        ofPatrimony: "do patrimônio"
      },
      clientDataDisplay: {
        loading: "Carregando dados...",
        title: "Performance Consolidada - Competência Mais Recente",
        table: {
          institution: "Instituição",
          initialAssets: "Patrimônio Inicial",
          movement: "Movimentação",
          taxes: "Impostos",
          financialGain: "Ganho Financeiro",
          finalAssets: "Patrimônio Final",
          yield: "Rendimento"
        },
        noData: {
          title: "Nenhum dado encontrado",
          message: "Não foram encontrados dados para o cliente \"{{clientName}}\"."
        }
      },
      institutionAllocation: {
        title: "Alocação por Instituição",
        grossAssets: "Patrimônio Bruto",
        noData: "Sem dados",
        total: "Total"
      },
      imports: {
        history: "Histórico de Importações",
        neverImported: "Nunca foi importado"
      },
      maturityTimeline: {
        title: "Vencimentos por Estratégia",
        subtitle: "Distribuição por data de vencimento",
        year: "Ano",
        total: "Valor Total",
        avgRate: "Taxa Média",
        byStrategy: "Por Estratégia",
        emptyFor: "Nenhum dado de vencimento disponível para {{assetClass}}",
        noMaturityData: "Nenhum dado de vencimento disponível",
        assetClasses: {
          postFixed: "Pós Fixado",
          inflation: "Inflação",
          preFixed: "Pré Fixado",
          postFixedLiquidity: "Pós Fixado - Liquidez",
          multimarket: "Multimercado",
          realEstate: "Imobiliário",
          stocks: "Ações",
          stocksLongBias: "Ações - Long Bias",
          privateEquity: "Private Equity",
          foreignFixedIncome: "Exterior - Renda Fixa",
          foreignStocks: "Exterior - Ações",
          coe: "COE",
          gold: "Ouro",
          crypto: "Criptoativos"
        }
      },
      diversificationDialog: {
        title: "Diversificação do Portfólio",
        description: "Análise da evolução da diversificação ao longo do tempo",
        currentAssets: "Ativos Atuais",
        currentStrategies: "Estratégias Ativas",
        assetClasses: "classes de ativos",
        inPeriod: "no período {{period}}",
        assetsEvolution: "Evolução de Ativos",
        strategiesTimeline: "Linha do Tempo de Estratégias",
        strategiesTimelineDescription: "Presença de cada classe de ativo ao longo do tempo",
        strategies: "Estratégias",
        activeStrategies: "estratégias ativas",
        clickToFilter: "Clique nas estratégias abaixo para filtrar o gráfico",
        active: "Ativo",
        month: "mês",
        months: "meses",
        strategiesOrder: {
          postFixedLiquidity: "Pós Fixado - Liquidez",
          postFixed: "Pós Fixado",
          inflation: "Inflação",
          preFixed: "Pré Fixado",
          multimarket: "Multimercado",
          realEstate: "Imobiliário",
          stocks: "Ações",
          stocksLongBias: "Ações - Long Bias",
          privateEquity: "Private Equity",
          foreignFixedIncome: "Exterior - Renda Fixa",
          foreignStocks: "Exterior - Ações",
          coe: "COE",
          gold: "Ouro",
          crypto: "Criptoativos",
          others: "Outros"
        }
      },
      maturityDialog: {
        title: "Cronograma de Vencimentos",
        description: "Próximos vencimentos de títulos da carteira",
        totalNext12Months: "Total a Vencer (12 meses)",
        titlesWithMaturity: "Títulos com Vencimento",
        maturitiesByYear: "Vencimentos por Ano",
        chartValueLabel: "Valor",
        noFutureMaturities: "Nenhum vencimento futuro encontrado",
        upcomingMaturities: "Próximos Vencimentos"
      }
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
      interest: 'Interesse',
      remove: 'Remover',
      assetAllocations: 'Alocação de Ativos',
      totalAllocation: 'Total',
      selectAllocation: 'Selecione a alocação',
      otherPreferences: 'Outras Preferências',
      allocation: {
        fixed_income_opportunities: 'Renda Fixa - Oport.',
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
    categories: {
      fixed_income: 'Renda Fixa',
      multimarket: 'Multimercado',
      real_estate: 'Imobiliário',
      stocks: 'Ações',
      foreign_crypto: 'Exterior/Cripto'
    },
    assets: {
      fixed_income_opportunities: 'Renda Fixa - Oport.',
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
    emergencyReserve: 'Reserva de Emergência',
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
  personalInformation: {
    title: 'Informações Pessoais',
    name: {
      label: 'Nome',
      placeholder: 'Seu nome completo',
      required: 'Nome é obrigatório'
    },
    birthDate: {
      label: 'Data de Nascimento',
      placeholder: 'Sua data de nascimento',
      required: 'Data de nascimento é obrigatória'
    },
    messages: {
      success: 'Informações pessoais atualizadas com sucesso',
      error: 'Falha ao atualizar informações pessoais'
    }
  },
  address: {
    cep: 'CEP',
    street: 'Rua',
    number: 'Número',
    complement: 'Complemento',
    neighborhood: 'Bairro',
    city: 'Cidade',
    state: 'Estado',
    cep_not_found: 'CEP não encontrado',
    cep_error: 'Erro ao buscar CEP',
  },
  landingPage: {
    mocks: {
      profile: {
        name: 'Cliente Demo',
        simulationName: 'Cliente Simulação'
      },
      goals: {
        europeTrip: 'Viagem Europa',
        newCar: 'Carro Novo',
        ownHome: 'Casa Própria',
        childrenEducation: 'Educação dos Filhos',
        hobbyEquipment: 'Equipamento Hobby',
        retirementAbroad: 'Aposentadoria no Exterior'
      },
      events: {
        annualBonus: 'Bônus Anual',
        homeRenovation: 'Reforma Casa',
        inheritance: 'Herança',
        carChange: 'Troca de Carro',
        propertySale: 'Venda de Imóvel'
      },
      allocation: {
        fixedIncome: 'Renda Fixa',
        multimarket: 'Multimercado',
        stocks: 'Ações',
        foreign: 'Exterior'
      }
    },
    header: {
      login: 'Login',
      requestDemo: 'Contato Rápido',
      viewDashboard: 'Ver sua dash'
    },
    hero: {
      badge: 'Tecnologia de Ponta para Consultores Financeiros',
      title: 'Gerencie seus clientes com',
      titleHighlight: 'Inteligência Artificial',
      description: 'A plataforma completa de planejamento financeiro que transforma a forma como você atende seus clientes. Projeções precisas, insights automáticos e gestão profissional em um só lugar.',
      requestDemo: 'Solicitar Demonstração',
      viewDemo: 'Ver Demo'
    },
    metrics: {
      clients: 'Clientes Ativos',
      patrimony: 'Patrimônio Gerenciado',
      growth: 'Crescimento Médio',
      satisfaction: 'Satisfação'
    },
    chart: {
      title: 'Projeção Patrimonial em Tempo Real',
      description: 'Acompanhe a evolução do patrimônio dos seus clientes com precisão matemática',
      growth: '+33.5% no período'
    },
    interface: {
      badge: 'Tecnologia de Ponta',
      title: 'Interface Profissional e Intuitiva',
      description: 'Dashboards poderosos que facilitam o acompanhamento e a tomada de decisão',
      dashboard: {
        title: 'Dashboard Completo',
        description: 'Visualização em tempo real de todos os clientes',
        patrimony: 'Patrimônio Total',
        avgReturn: 'Retorno Médio',
        activeClients: 'Clientes Ativos'
      },
      alerts: {
        title: 'Alertas Inteligentes',
        description: 'Notificações automáticas sobre eventos importantes',
        alert1: {
          title: 'Revisão Necessária',
          description: 'Cliente atingiu meta de patrimônio'
        },
        alert2: {
          title: 'Baixo Engajamento',
          description: 'Cliente sem acesso há 30 dias'
        },
        alert3: {
          title: 'Meta Próxima',
          description: 'Cliente a 6 meses da aposentadoria'
        }
      }
    },
    features: {
      title: 'Recursos que Transformam sua Gestão',
      feature1: {
        title: 'Projeções Financeiras Avançadas',
        description: 'Algoritmos proprietários que calculam cenários de aposentadoria, metas e patrimônio com precisão matemática'
      },
      feature2: {
        title: 'Dashboard Inteligente',
        description: 'Visualize todos os seus clientes, métricas de performance e alertas importantes em uma única tela'
      },
      feature3: {
        title: 'Gestão de Objetivos',
        description: 'Acompanhe metas financeiras, eventos e marcos importantes de cada cliente automaticamente'
      },
      feature4: {
        title: 'Relatórios Profissionais',
        description: 'Gere relatórios detalhados e apresentações para seus clientes com poucos cliques'
      },
      feature5: {
        title: 'Multi-Moeda',
        description: 'Suporte completo para Real, Dólar e Euro com taxas de câmbio atualizadas'
      },
      feature6: {
        title: 'Segurança Bancária',
        description: 'Seus dados e dos seus clientes protegidos com criptografia de nível bancário'
      }
    },
    comparison: {
      title: 'Resultados Comprovados',
      description: 'Veja como a Foundation transforma a gestão de carteiras',
      metric1: {
        value: '94%',
        description: 'dos clientes atingem suas metas'
      },
      metric2: {
        value: '3.2x',
        description: 'mais eficiência na gestão'
      },
      metric3: {
        value: '87%',
        description: 'acessam mensalmente a plataforma'
      }
    },
    contact: {
      badge: 'Entre em Contato',
      title: 'Pronto para Transformar sua Gestão?',
      description: 'Preencha o formulário abaixo e nossa equipe entrará em contato para uma demonstração personalizada.',
      form: {
        name: 'Nome',
        namePlaceholder: 'Seu nome completo',
        email: 'Email',
        emailPlaceholder: 'seu@email.com',
        company: 'Empresa',
        companyPlaceholder: 'Nome da sua empresa',
        message: 'Mensagem',
        messagePlaceholder: 'Conte-nos sobre suas necessidades...',
        submit: 'Enviar Mensagem',
        sending: 'Enviando...'
      },
      success: {
        title: 'Mensagem Enviada!',
        description: 'Obrigado pelo interesse. Entraremos em contato em breve.'
      }
    },
    footer: {
      description: 'A plataforma completa de planejamento financeiro para consultores profissionais.',
      product: 'Produto',
      features: 'Recursos',
      pricing: 'Preços',
      docs: 'Documentação',
      company: 'Empresa',
      about: 'Sobre',
      blog: 'Blog',
      contact: 'Contato',
      rights: 'Todos os direitos reservados.',
      copyright: '© 2025 Foundation. Plataforma profissional de planejamento financeiro.'
    },
    stats: {
      vsPreviousMonth: 'vs mês anterior'
    },
    demo: {
      clientDashboard: {
        title: 'Dashboard de Clientes',
        client1: 'João da Silva',
        client1Patrimony: '{{value}} patrimônio',
        client2: 'Maria Santos',
        client2Patrimony: '{{value}} patrimônio',
        client3: 'Pedro Costa',
        client3Patrimony: '{{value}} patrimônio',
        onTrack: 'No prazo',
        attention: 'Atenção',
        excellent: 'Excelente'
      },
      alerts: {
        title: 'Alertas Inteligentes',
        lateContribution: 'Contribuição Atrasada',
        lateContributionDesc: 'João Silva não fez aporte há 2 meses',
        goalAchieved: 'Meta Alcançada',
        goalAchievedDesc: 'Maria Santos atingiu 100% do objetivo',
        abovePerformance: 'Performance Acima',
        abovePerformanceDesc: 'Pedro Costa: +15% vs meta'
      }
    },
    optimization: {
      title: 'Otimização Automática de Planos',
      description: 'A IA analisa continuamente o progresso e sugere ajustes para manter seus clientes no caminho certo',
      planned: 'Planejado',
      projected: 'Projetado',
      allocation: {
        title: 'Alocação de Ativos Sugerida',
        description: 'Distribuição otimizada baseada no perfil de risco'
      }
    },
    metricsSection: {
      title: 'Métricas que Importam',
      description: 'Acompanhe KPIs essenciais para o sucesso dos seus clientes',
      successRate: 'Taxa de Sucesso',
      successRateDesc: 'dos clientes atingem suas metas',
      engagement: 'Engajamento',
      engagementDesc: 'acessam mensalmente a plataforma',
      avgReturn: 'Retorno Médio',
      avgReturnDesc: 'performance acima da meta',
      vsPreviousYear: 'vs ano anterior'
    },
    resources: {
      title: 'Recursos que Transformam Sua Consultoria',
      description: 'Tudo que você precisa para oferecer um serviço de excelência aos seus clientes'
    },
    contactDirect: 'Ou entre em contato diretamente:',
    guarantees: {
      secure: '100% Seguro',
      fastResponse: 'Resposta em 24h',
      noCommitment: 'Sem Compromisso'
    }
  },
  statementImports: {
    title: 'Histórico de Importações',
    description: 'Histórico de importações de extratos via n8n',
    noImports: 'Nenhuma importação encontrada',
    status: {
      success: 'Sucesso',
      failed: 'Falha',
      running: 'Em Execução',
      created: 'Criado'
    },
    type: {
      consolidated: 'Consolidado',
      detailed: 'Detalhado'
    },
    table: {
      title: 'Importações',
      status: 'Status',
      type: 'Tipo',
      n8nId: 'ID n8n',
      createdAt: 'Criado em',
      startedAt: 'Iniciado em',
      completedAt: 'Concluído em',
      error: 'Erro'
    }
  },
};
