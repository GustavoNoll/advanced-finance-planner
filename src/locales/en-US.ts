export const enUS = { 
  software: {
    title: "Foundation",
    description: "Investment Plan",
    version: "Version 1.0.0",
    author: "Gustavo Noll",
    year: "2025",
    month: "February",
    day: "20"
  },
  investmentPlan: {
    edit: {
      title: "Edit Investment Plan",
      lifePlanTitle: "Edit Life Plan",
      success: "Investment plan updated successfully",
      successWithMicroPlans: "Investment plan and micro plans updated successfully",
      investmentPlan: "Investment Plan",
      microPlan: "Micro Plan",
      microPlanSuccess: "Micro plan updated successfully",
      microPlanError: "Error updating micro plan",
      noActiveMicroPlan: "No active micro plan found",
      saveMicroPlan: "Save Micro Plan",
      selectMicroPlan: "Select micro plan",
      lifePlanInfo: {
        title: "Life Plan Information"
      }
    },
    messages: {
      notFound: {
        title: "Investment plan not found",
        description: "The plan you are looking for does not exist or has been removed."
      }
    },
    microPlans: {
      title: "Investment Micro Plans",
      createNew: "Create New Micro Plan",
      createFirst: "Create First Micro Plan",
      edit: "Edit Micro Plan",
      active: "Active",
      base: "Base",
      effectiveFrom: "Effective from",
      effectiveDate: "Effective Date",
      monthlyDeposit: "Monthly Deposit",
      desiredIncome: "Desired Income",
      expectedReturn: "Expected Return",
      inflation: "Inflation",
      noPlans: "No micro plans found",
      noPlansDescription: "Create micro plans to manage different investment strategies over time.",
      confirmDelete: "Are you sure you want to delete this micro plan?",
      cannotDeleteBase: "Cannot delete the base micro plan",
      timeline: {
        title: "Micro Plans Timeline",
        disclaimer: {
          title: "Attention",
          message: "There is a micro plan with an effective date prior to the current date that is not active. This may occur when there are no financial records to automatically activate the micro plan. Consider checking financial records or manually activating the appropriate micro plan.",
          showDetails: "Show details"
        },
        inflationAdjustment: {
          contributionToggle: "Inflation-adjusted contribution",
          withdrawalToggle: "Inflation-adjusted withdrawal"
        }
      },
      form: {
        effectiveDate: "Effective Date",
        monthlyDeposit: "Monthly Deposit",
        desiredIncome: "Desired Income",
        expectedReturn: "Expected Return",
        inflation: "Inflation Rate",
        selectExpectedReturn: "Select expected return",
        firstPlanDateNote: "For the first micro plan, the effective date will be equal to the main plan's start date.",
        basePlanDateNote: "The base micro plan date cannot be edited. To change the date, edit the main plan.",
        cannotCreateBeforeBase: "Cannot create micro plans on dates before the base micro plan.",
        dateAlreadyUsed: "A micro plan already exists for this month/year. Choose a different date.",
        adjustContributionForAccumulatedInflation: "Adjust contribution for accumulated inflation",
        adjustIncomeForAccumulatedInflation: "Adjust withdrawal for accumulated inflation"
      }
    },
    details: {
      title: "Investment Plan Parameters",
      clientInfo: {
        title: "Client Information",
        name: "Name",
        initialAge: "Initial Age",
        finalAge: "Final Age",
        years: "years"
      },
      currency: {
        title: "Currency and Status",
        currency: "Currency",
        createdAt: "Created at"
      },
      planOverview: {
        title: "Plan Overview",
        initialAmount: "Initial Amount",
        monthlyDeposit: "Monthly Deposit",
        requiredMonthlyDeposit: "Required Monthly Deposit",
        adjustContributionForInflation: "Inflation-adjusted contribution",
        adjustIncomeForInflation: "Inflation-adjusted withdrawal",
        adjustContributionForAccumulatedInflation: "Accumulated inflation-adjusted contribution",
        adjustIncomeForAccumulatedInflation: "Accumulated inflation-adjusted withdrawal",
      },
      financialGoals: {
        title: "Financial Goals",
        desiredMonthlyIncome: "Desired Monthly Income",
        inflationAdjustedIncome: "Inflation-Adjusted Income",
        futureValue: "Required Future Value",
        presentFutureValue: "Goal Present Value"
      },
      investmentParams: {
        title: "Investment Parameters",
        expectedReturn: "Expected Return",
        inflationRate: "Inflation Rate",
        planType: "Plan Type",
        status: "Status",
        types: {
          "1": "Close Out",
          "2": "Leave Legacy",
          "3": "Don't Touch Principal"
        },
        adjustContributionForAccumulatedInflation: "Accumulated Inflation Contribution Adjustment",
        adjustIncomeForAccumulatedInflation: "Accumulated Inflation Withdrawal Adjustment",
        enabled: "Enabled",
        disabled: "Disabled"
      },
      calculations: {
        title: "Calculations Based on Active Micro Plan",
        expectedReturn: "Expected Return",
        inflation: "Inflation",
        returnRate: "Real Return Rate",
        realReturn: "Monthly Real Return",
        inflationReturn: "Monthly Inflation Return",
        totalMonthlyReturn: "Total Monthly Return"
      }
    },
    form: {
      birthDate: "Date of Birth",
      selectAge: "Select age",
      years: "years",
      planEndAccumulationDate: "Plan End Date",
      initialAmount: "Initial Amount",
      initialAmountLockedMessage: "The initial amount cannot be changed when financial records already exist for this client. This ensures the integrity of historical data.",
      planInitialDate: "Plan Start Date",
      planInitialDateLockedMessage: "The plan start date cannot be changed when financial records already exist for this client. This ensures the integrity of historical data.",
      initialAge: "Initial Age",
      finalAge: "Final Age",
      monthlyDeposit: "Monthly Deposit",
      desiredIncome: "Desired Monthly Income",
      lifeExpectancy: "Life Expectancy",
      riskProfile: "Risk Profile / Return IPCA+",
      inflationRate: "Annual Inflation Rate (%)",
      adjustContributionForInflation: "Adjust contribution for inflation",
      adjustIncomeForInflation: "Adjust withdrawal for inflation",
      planType: "Plan Type",
      createButton: "Create Plan",
      creating: "Creating...",
      adjustContributionForAccumulatedInflation: "Adjust contribution for accumulated inflation",
      adjustIncomeForAccumulatedInflation: "Adjust withdrawal for accumulated inflation",
      advancedSettings: "Advanced Settings",
      endAge: "End Age",
      legacyAge: "Legacy Age",
      keepAge: "Planning End Age",
      legacyAmount: "Legacy Amount",
      currency: "Currency",
      currencies: {
        BRL: "Brazilian Real (R$)",
        USD: "US Dollar ($)",
        EUR: "Euro (€)"
      },
      hasOldPortfolio: "Client has previous portfolio",
      oldPortfolioProfitability: "Previous Portfolio Profitability (IPCA+)",
      selectProfitability: "Select profitability",
      effectiveDate: "Effective Date",
      effectiveDateLockedMessage: "The effective date cannot be changed for the active micro plan",
      expectedReturn: "Expected Return",
      inflation: "Inflation Rate"
    },
    planTypes: {
      endAt120: "Close Out",
      leave1M: "Leave Legacy",
      keepPrincipal: "Don't Touch Principal"
    },
    riskProfiles: {
      conservative: "Conservative",
      moderate: "Moderate",
      aggressive: "Aggressive"
    },
    create: {
      title: "Create Investment Plan",
      calculations: {
        title: "Calculated Values",
        futureValue: "Future Value",
        presentFutureValue: "Present Future Value",
        inflationAdjustedIncome: "Inflation-Adjusted Income",
        requiredFutureValue: "Future Value",
        monthlyRealReturn: "Monthly Real Return",
        monthlyInflationReturn: "Monthly Inflation Return",
        totalMonthlyReturn: "Total Monthly Return",
        requiredMonthlyDeposit: "Required Monthly Deposit for Future Value",
        necessaryFutureValue: "Necessary for desired income",
        fillRequired: "Fill in all required fields to see calculations",
        necessaryMonthlyDeposit: "Necessary for desired income"
      },
    },
  },
  dashboard: {
    title: "Investment Portfolio",
    navigation: {
      planning: "Planning",
      investmentPolicy: "Investment Policy",
      portfolioPerformance: "Performance"
    },
    highlights: {
      startToInvest: "You should start investing now!",
      title: "Highlights",
      tooltip: "Your main achievements and milestones in the investment plan",
      contributionStreak: "Current streak: {{months}} months of consistent contributions!",
      goalProgress: "Already achieved {{progress}}% of the goal ($ {{amount}})",
      bestReturn: "Your best month had a return of {{return}}%",
      patrimonyGrowth: "Your wealth has grown {{growth}}% since the beginning",
      planAge: "Your plan is {{months}} months old!",
      incomeProgress: "Already generating {{percentage}}% of the desired monthly income",
      returnConsistency: "{{percentage}}% of months had positive returns",
      futureValueProgress: "Already reached {{percentage}}% of the planned future value",
      recordFrequency: "You record {{percentage}}% of your plan's months",
      contributionDiscipline: "You made contributions in {{percentage}}% of the recorded months",
      monthsToRetirement: "{{months}} months until your retirement"
    },
    brokerName: "Broker: {{name}}",
    cards: {
      portfolioValue: {
        title: "Total Portfolio Value",
        ytd: "YTD",
        amount: "$ {{value}}",
        monthlyReturn: "increase in the last month",
        tooltip: "Value based on the last financial record."
      },
      contributions: {
        title: "Total Contribution",
        subtitle: "Regular deposits",
        target: "Agreed",
        amount: "$ {{value}}",
        required: "Required",
        tooltip: "Total monthly contributions in the selected period.",
        inflationAdjusted: "Inflation adjusted",
        currentMonth: "Current month",
        total: "Period total"
      },
      totalReturns: {
        title: "Returns",
        subtitle: "Total gains",
        amount: "$ {{value}}",
        percentage: "+{{value}}%",
        tooltip: "Portfolio returns."
      },
      retirementBalance: {
        title: "Retirement Difference",
        subtitle: "Current vs. Previous Portfolio",
        tooltip: "Difference between current value and previous portfolio value at retirement year."
      }
    },
    charts: {
      portfolioPerformance: "Initial Plan Creation"
    },
    nextSteps: {
      title: "Next Steps",
      items: {
        reviewStrategy: "Review your investment strategy",
        increaseContributions: "Consider increasing monthly contributions",
        scheduleReview: "Schedule portfolio review meeting"
      }
    },
    buttons: {
      clientInfo: "Client Information",
      settings: "Settings",
      logout: "Logout",
      back: "Back",
      financialRecords: "Financial Records",
      investmentPlan: "Investment Plan",
      clientProfile: "Client Information",
      editPlan: "Edit Plan",
      editLifePlan: "Edit Life Plan",
      financialGoals: "Financial Goals",
      events: 'Events',
    },
    messages: {
      contactBroker: {
        title: "Plan not found",
        description: "Please contact your broker to create an investment plan."
      },
      logoutSuccess: "Logged out successfully",
      logoutError: "Error logging out",
      noPlan: {
        title: "No Investment Plan",
        description: "Please create an investment plan to continue."
      },
      errors: {
        fetchPlan: "Error fetching investment plan",
        fetchProfile: "Error fetching broker profile",
        unauthorizedAccess: "Unauthorized access",
        clientNotAssociated: "This client is not associated with your broker profile",
        validationFailed: "Access validation failed"
      }
    },
    loading: "Loading...",
    buttonGroups: {
      main: "Main",
      planning: "Planning",
      management: "Management",
    },
    planProgress: {
      retirement: "Retirement",
      title: "Plan Progress",
      timeToRetirement: "Months to Retirement",
      tooltip: "Track your retirement plan based on current data",
      currentAge: "Current Age",
      monthsToRetirement: "Months to Retirement",
      onTrack: "On Track",
      needsAttention: "Needs Attention",
      behind: "behind",
      monthlyContribution: "Monthly Contribution",
      useOptimizedValue: "Use optimized value",
      replaceWithOptimized: "Replace with optimized value",
      applyOptimized: "Apply",
      optimizationApplied: "Optimization applied successfully",
      optimizationError: "Error applying optimization",
      optimizationNotImplemented: "Optimization for this parameter has not been implemented yet",
      noActiveMicroPlan: "No active micro plan found",
      contributionOptimized: "Contribution optimized successfully",
      incomeOptimized: "Income optimized successfully",
      confirmOptimization: "Confirm Optimization",
              confirmTimeToRetirement: "This will change the plan end date and final age based on the projected value.",
              confirmMonthlyContribution: "This will create a new micro plan with the optimized monthly contribution.",
              confirmMonthlyWithdrawal: "This will create a new micro plan with the optimized monthly income.",
              microPlanExistsError: "A micro plan already exists for this date. Choose a different date.",
              birthDateNotFound: "Date of birth not found",
      monthlyWithdrawal: "Monthly Income",
      planned: "Planned",
      projected: "Projected",
      difference: "difference",
      ageAtRetirement: "Age at Retirement"
    },
    investmentPlan: {
      title: "Investment Plan Details",
      timeline: "Timeline",
      financial: "Financial Information",
      currentAge: "Current Age",
      finalAge: "Final Plan Age",
      lifeExpectancy: "Life Expectancy",
      initialCapital: "Initial Capital",
      monthlyContribution: "Monthly Contribution",
      desiredWithdrawal: "Desired Withdrawal",
      adjustedWithdrawal: "Adjusted Withdrawal",
      planDuration: "Plan Duration",
      planStart: "Plan Start",
      duration: "Duration",
      durationTooltip: "Calculated from {{startMonth}} to {{endMonth}}",
      years: "years",
      months: "months"
    },
  },
  brokerDashboard: {
    myProfile: "My Profile",
    title: "Broker Dashboard",
    subtitle: "Artificial Intelligence for Client Management",
    clientDeleted: "Client deleted successfully",
    search: {
      title: "Search Clients",
      placeholder: "Search by name or email...",
      button: "Search",
      searching: "Searching...",
      results: "Clients",
      noResults: "No clients found"
    },
    buttons: {
      newClient: "New Client",
      simulation: "Simulate Projection",
      logout: "Logout",
      search: "Search"
    },
    clientAccessAnalysis: {
      title: "Client Access Analysis",
      activityStatus: {
        title: "Activity Status",
        description: "Distribution by inactivity time",
        today: "Today",
        thisWeek: "This Week",
        thisMonth: "This Month",
        inactive: "Inactive"
      },
      accessSummary: {
        title: "Access Summary",
        description: "Last access metrics",
        totalClients: "Total Clients",
        accessedToday: "Accessed Today",
        accessedThisWeek: "Accessed This Week",
        inactive30Days: "Inactive 30+ Days"
      }
    },
    charts: {
      wealthDistribution: "Wealth Distribution",
      wealthDistributionDescription: "Analysis of wealth distribution by value ranges",
      totalClients: "Total Clients",
      totalValue: "Total Value",
      averageValue: "Average Value",
      percentage: "Percentage",
      distributionBreakdown: "Detailed Distribution",
      clients: "clients",
      contributionTrends: "Contribution Trends",
      contributionTrendsDescription: "Evolution of clients who contribute adequately in the previous 6 months",
      adequateContributors: "Adequate Contributors",
      averageContributors: "Average Contributors",
      averageContributorsDescription: "6-month average",
      adequacyRate: "Adequacy Rate",
      averageAdequacy: "Average Adequacy",
      over6Months: "over previous 6 months",
      trendAnalysis: "Trend Analysis",
      ofTotal: "of"
    },
    insights: {
      title: "Smart Insights",
      subtitle: "Personalized AI-based recommendations",
      engagement: "Engagement",
      lastActivity: "Last Activity",
      keyInsights: "Key Insights",
      recommendations: "Recommendations",
      viewClient: "View Client",
      noInsights: "No insights available",
      noInsightsDescription: "Insights will appear as client data is analyzed",
      today: "Today",
      yesterday: "Yesterday",
      daysAgo: "{{days}} days ago",
      weeksAgo: "{{weeks}} weeks ago",
      monthsAgo: "{{months}} months ago",
      lowEngagementInsight: "Client with low system engagement",
      boostEngagementRecommendation: "Send reminders and educational materials",
      belowContributionInsight: "Contributions below necessary to reach goals",
      increaseContributionRecommendation: "Review plan and adjust monthly contributions",
      nearRetirementInsight: "Client near retirement",
      reviewRetirementPlanRecommendation: "Review retirement strategy",
      highVolatilityInsight: "Portfolio with high volatility",
      diversifyPortfolioRecommendation: "Diversify investments to reduce risk",
      lowReturnsInsight: "Returns below market average",
      optimizeStrategyRecommendation: "Optimize investment strategy",
      inconsistentContributionsInsight: "Irregular contributions",
      automateContributionsRecommendation: "Implement automatic contributions",
      stablePerformanceInsight: "Stable and consistent performance",
      continueCurrentStrategyRecommendation: "Continue current strategy"
    },
    alerts: {
      title: "Smart Alerts",
      subtitle: "Real-time monitoring of your clients",
      urgent: "Urgent",
      client: "Client",
      justNow: "Just now",
      hoursAgo: "{{hours}} hours ago",
      daysAgo: "{{days}} days ago",
      viewAll: "View All",
      noAlerts: "No alerts",
      noAlertsDescription: "All clients have normal status",
      allAlerts: "All Alerts",
      allAlertsDescription: "View and manage all your client alerts",
      warnings: "Warnings",
      info: "Information",
      success: "Successes",
      urgentAttention: "Urgent Attention",
      urgentDescription: "{{name}} needs immediate attention",
      urgentNoRecords: "No Financial Records",
      urgentNoRecordsDescription: "{{name}} has no registered financial records",
      urgentNoPlan: "Client Without Plan",
      urgentNoPlanDescription: "{{name}} does not have a registered investment plan",
      urgentBelowContribution: "Insufficient Contribution",
      urgentBelowContributionDescription: "{{name}} is contributing below the required amount",
      urgentLowEngagement: "Critical Engagement",
      urgentLowEngagementDescription: "{{name}} has extremely low engagement ({{score}}/100) - churn risk",
      urgentRetirement: "Retirement at Risk",
      urgentRetirementDescription: "{{name}} is near retirement ({{years}} years) but contributing below necessary",
      contactClient: "Contact Client",
      setupRecords: "Setup Records",
      createPlan: "Create Plan",
      reviewContribution: "Review Contribution",
      contactImmediately: "Contact Immediately",
      reviewRetirementPlan: "Review Retirement Plan",
      rebalancePortfolio: "Rebalance Portfolio",
      highPriority: "High Priority",
      highPriorityDescription: "{{name}} requires priority review",
      reviewClient: "Review Client",
      lowEngagement: "Low Engagement",
      lowEngagementDescription: "{{name}} has low engagement score ({{score}}/100)",
      highVolatility: "High Volatility",
      highVolatilityDescription: "{{name}} has portfolio with high volatility ({{volatility}}%)",
      boostEngagement: "Boost Engagement",
      nearRetirement: "Near Retirement",
      nearRetirementDescription: "{{name}} is near retirement ({{years}} years)",
      reviewPlan: "Review Plan",
      belowContribution: "Insufficient Contribution",
      belowContributionDescription: "{{name}} is contributing below necessary",
      adjustContribution: "Adjust Contribution",
      lowReturns: "Low Returns",
      lowReturnsDescription: "{{name}} has low monthly return ({{rate}}%)",
      optimizeStrategy: "Optimize Strategy",
      reviewRisk: "Review Risk"
    },
    simulation: {
      title: "Projection Simulation",
      creatingForClient: "Creating for client",
      createPlanFromSimulation: "Create Plan from Simulation",
      creatingPlan: "Creating plan...",
      planCreatedSuccessfully: "Plan created successfully!",
      planParameters: "Plan Parameters",
      projectionChart: "Plan Chart",
      projectionTable: "Plan Table",
      simulationNotice: {
        title: "Simulation",
        description: "This is a simulation based on the provided parameters. No data will be saved to the database. Use this tool to demonstrate different scenarios to the client."
      },
      planInitialDateDisabled: "Fixed date for simulations. Edit when creating a real plan.",
      errors: {
        missingClientData: "Client data not found"
      }
    },
    planCreation: {
      title: "Initial Plan Creation",
      creatingForClient: "Creating plan for client",
      createPlan: "Create Plan",
      creatingPlan: "Creating plan...",
      planCreatedSuccessfully: "Plan created successfully!",
      planParameters: "Plan Parameters",
      planChart: "Plan Chart",
      planTable: "Plan Table",
      planNotice: {
        title: "Plan Creation",
        description: "Configure investment plan parameters for the client. This plan will be saved in the database."
      },
      errors: {
        missingClientData: "Client data not found"
      }
    },
    client: {
      pendingPlan: "Pending Plan",
      id: "ID",
      name: "Name",
      email: "Email",
      outdatedRecord: "Outdated Record",
      monthlyReturn: "Monthly Return",
      pendingPlanTooltip: "Client without registered investment plan",
      outdatedRecordTooltip: "No records for {{months}} months",
      neverRecordedTooltip: "Never recorded",
      monthlyReturnTooltip: "Return percentage in the last month",
      lowReturns: "Low Returns",
      lowReturnsTooltip: "Returns below 0.5%",
      belowRequiredContribution: "Insufficient Contributions",
      belowRequiredContributionTooltip: "Contributions below necessary",
      lastActivity: "Last Activity",
      lastLogin: "Last Login",
      never: "Never",
      shareTooltip: "Share client access link",
      simulationTooltip: "Simulate Projection",
      simulationDescription: "View projection chart without saving",
      deleteTooltip: "Delete client",
      deleteWarning: "This action cannot be undone",
      deleteClient: {
        title: "Delete client",
        description: "Are you sure you want to delete this client? This action will permanently remove all client data, including investment plans, financial records, and goals."
      }
    },
    metrics: {
      totalClients: "Total Clients",
      withPlan: "With Plan",
      totalBalance: "Total Wealth",
      totalPatrimony: "Total Wealth",
      activeRecords: "Active Records",
      outdatedRecords: "Outdated Records",
      averageReturn: "Average Return",
      monthlyAverage: "Monthly Average",
      totalGrowth: "Total Growth",
      portfolioGrowth: "Portfolio Growth",
      averageVolatility: "Average Volatility",
      riskLevel: "Risk Level",
      sharpeRatio: "Sharpe Ratio",
      riskAdjustedReturn: "Risk-Adjusted Return",
      engagementScore: "Engagement Score",
      clientEngagement: "Client Engagement",
      activityDistribution: "Activity Status",
      helpers: {
        averageReturn: "Arithmetic mean of monthly returns only for clients with valid data in the last 12 months",
        totalGrowth: "Sum of total growth (Current value - Plan initial value) of all clients",
        averageVolatility: "Standard deviation of monthly returns only for clients with valid data, measuring variability of gains/losses",
        sharpeRatio: "Average return divided by volatility only for clients with valid data, measuring risk efficiency (higher = better)",
        engagementScore: "Score from 0-100 based on record frequency (0-60 points) + contribution consistency vs micro plan target (0-40 points). Clients who reach monthly target and maintain high consistency receive maximum score",
        activityDistribution: "Distribution of clients by activity status: Active (last record < 3 months), Outdated (3-6 months, need follow-up), At Risk (6-12 months, urgent attention), Inactive (> 12 months), No Records (never recorded financial data)",
        activeRecords: "Clients with recent activity (last financial record less than 3 months ago)",
        outdatedRecords: "Clients with outdated activity (last record 3-12 months ago) or inactive (no records for more than 12 months)"
      },
      wealthDistribution: {
        title: "Wealth Distribution",
        clientCount: "Number of Clients",
        tooltips: {
          needsPlanReview: "Clients who need to review their investment plan due to significant changes or being more than 12 months without update.",
          belowRequiredContribution: "Clients whose monthly contributions are below the amount necessary to reach investment plan goals.",
          nearRetirement: "Clients less than 2 years from planned retirement age and need special attention in transition.",
          lowReturns: "Clients with monthly returns consistently below 0.5% in the last 3 months, indicating need for strategy adjustment."
        }
      },
      planning: {
        title: "Planning Metrics",
        averageAge: "Average Age",
        averageRetirementAge: "Average Retirement Age",
        averageDesiredIncome: "Average Desired Income",
        planTypes: {
          title: "Plan Types",
          endAt120: "Close Out",
          leave1M: "Legacy",
          keepPrincipal: "Principal",
          count: "{{count}} clients"
        }
      },
      trends: {
        title: "Trends",
        newClientsThisMonth: "New Clients (Month)",
        totalGrowthThisMonth: "Growth (Month)",
        averageMonthlyGrowth: "Average Monthly Growth",
        inactiveClients: "Inactive Clients",
        chartLabels: {
          newClients: "New Clients",
          totalGrowth: "Total Growth",
          averageGrowth: "Average Growth",
          inactiveClients: "Inactive Clients"
        },
        tooltip: {
          newClients: "Clients who started this month",
          totalGrowth: "Total growth in current month",
          averageGrowth: "Average monthly growth per client",
          inactive: "Clients without records in the last 6 months"
        }
      },
      actions: {
        clients: "Clients",
        title: "Necessary Actions",
        needsPlanReview: "Plan Review",
        belowRequiredContribution: "Contributions Below Necessary",
        nearRetirement: "Near Retirement",
        lowReturns: "Low Returns",
        tooltip: {
          needsPlanReview: "Clients who need to review their plan",
          belowContribution: "Clients with contributions below necessary",
          nearRetirement: "Clients near retirement",
          lowReturns: "Clients with returns below expected"
        }
      },

    },
    messages: {
      error: {
        title: "Error",
        fetchClients: "Error fetching clients",
        search: "Error performing search",
        unauthorized: "Unauthorized access. Only brokers can access this area."
      }
    },
    share: "Share",
    shareWithClient: "Share with Client",
    linkCopied: "Link copied successfully!",
    loading: "Verifying permissions..."
  },
  common: {
    actions: "Actions",
    confirmDeleteTitle: "Confirm deletion",
    confirmDeleteMessage: "Are you sure you want to delete this item? This action cannot be undone.",
    perYear: "per year",
    perMonth: "per month",
    notInformed: "Not informed",
    every: "every",
    change: "Change",
    selectMonth: "Select month",
    selectYear: "Select year",
    formErrors: "Validation errors",
    and: "and",
    name: "Name",
    enterName: "Enter the name of the goal or event",
    year: "Year",
    month: "Month",
    value: "Value",
    success: "Success",
    saving: "Saving...",
    addNew: "Add New",
    confirm: "Confirm",
    custom: "Custom",
    startDate: "Start Date",
    endDate: "End Date",
    months: "Months",
    time: "time",
    times: "times",
    last1YearS: "1Y",
    last5YearsS: "5Y",
    last10YearsS: "10Y",
    all: "All",
    allTime: "All Time",
    last6Months: "Last 6 Months",
    last12Months: "Last 12 Months",
    last24Months: "Last 24 Months",
    error: "Error",
    errors: {
      tryAgain: "Please try again."
    },
    no: "No",
    yes: "Yes",
    notAvailable: "N/A",
    back: "Back",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    create: "Create",
    reset: "Reset",
    logout: "Logout",
    update: "Update",
    add: "Add",
    select: "Select",
    confirmDelete: "Are you sure you want to delete this item?",
    current: "Current",
    required: "Required",
    target: "Target",
    projected: "Projected",
    years: "years",
    showing: 'Showing',
    of: 'of',
    items: 'items',
    view: 'View',
    minimize: 'Minimize',
    maximize: 'Maximize',
    save_changes: 'Save changes',
    theme: {
      light: 'Light',
      dark: 'Dark',
      toggle: 'Toggle theme'
    },
    search: 'Search',
    noItemsFound: 'No items found',
    complete: 'Complete',
    itemWillBeCompleted: 'This item will be marked as completed',
    completeExplanation: {
      title: 'What does "Complete" mean?',
      description: 'When marking as "Complete", the system will:',
      steps: [
        'Sum all linked values between this item and financial records',
        'Mark the item as completed with the total accumulated value',
        'Consider the date of the last linked record as completion date'
      ],
      note: 'If not completed, the item remains pending and continues to be considered in financial projections on planned dates, with values already linked to financial records being automatically discounted from the total value, showing only the remaining amount that still needs to be paid or realized.',
      pendingStatus: 'Status: Pending',
      completedStatus: 'Status: Completed',
      pendingDescription: 'The item will continue to be considered in financial projections on planned dates.',
      completedDescription: 'The item will no longer be considered in future financial projections.'
    },
    allowNegativeValues: 'Use negative values for expenses/outflows',
    goalsAlwaysNegative: 'Goals are always expenses: the value is negative by default.',
    paidAmount: 'Amount paid',
    paidAmountHelp: 'Amount paid for this linked {{type}}. Adjust according to what was actually paid this month.',
    linkedItems: 'Linked Items',
    completed: 'Completed',
    remove: 'Remove',
    deselect: 'Deselect',
    noLinkedItems: 'No linked items found',
    goal: 'Goal',
    event: 'Event',
    tryAgain: 'Try again',
    toggleStatus: 'Toggle status',
    loading: 'Loading',
    partial: 'Partial'
  },
  createClient: {
    title: "Create New Client",
    form: {
      name: {
        label: "Name",
        placeholder: "Enter client name"
      },
      email: {
        label: "Email",
        placeholder: "Enter client email"
      },
      password: {
        label: "Password",
        placeholder: "Enter password"
      },
      birthDate: {
        label: "Date of Birth",
        placeholder: "Enter client date of birth"
      }
    },
    buttons: {
      cancel: "Cancel",
      create: "Create Client",
      creating: "Creating..."
    },
    messages: {
      success: {
        title: "Success",
        description: "Client created successfully"
      },
      error: {
        title: "Error",
        description: "Error creating client"
      }
    }
  },
  monthlyView: {
    loadMore: "Load More",
    downloadCSV: "Download CSV",
    downloadError: "Error downloading CSV",
    noData: "No data available",
    timeWindows: {
      allTime: "All Time",
      last6Months: "Last 6 Months",
      last12Months: "Last 12 Months",
      last24Months: "Last 24 Months",
      customRange: "Custom Range"
    },
    title: "Monthly Performance",
    tabs: {
      chart: "Chart View",
      table: "History",
      returnChart: "Return Comparison",
      balanceChart: "Balance Comparison",
      futureProjection: "Future Projection"
    },
    chart: {
      title: "Accumulated Return Chart",
      accumulatedReturn: "Accumulated Return",
      accumulatedCDIReturn: "Accumulated CDI Return",
      accumulatedIPCAReturn: "Accumulated IPCA Return",
      accumulatedUSCPIReturn: "Accumulated US CPI Return",
      accumulatedEuroCPIReturn: "Accumulated Euro CPI Return",
      accumulatedOldPortfolioReturn: "Accumulated Old Portfolio",
      accumulatedTargetReturn: "Accumulated Target Return",
      endBalance: "End Balance",
      contribution: "Contribution",
      monthlyReturn: "Monthly Return",
      targetRentability: "Target Return"
    },
    table: {
      headers: {
        month: "Month",
        initialBalance: "Initial Balance",
        contribution: "Contribution", 
        returns: "Returns",
        returnPercentage: "Return %",
        endBalance: "End Balance",
        targetRentability: "Target Return"
      },
      months: {
        january: "January",
        february: "February",
        march: "March",
        april: "April",
        may: "May",
        june: "June",
        july: "July",
        august: "August",
        september: "September",
        october: "October",
        november: "November",
        december: "December"
      }
    },
    futureProjection: {
      age: "Age",
      year: "Year",
      contribution: "Contribution",
      ipcaRate: "IPCA",
      effectiveRate: "Target Return",
      withdrawal: "Withdrawal",
      balance: "Real Evolution",
      expandYear: "Expand monthly details",
      collapseYear: "Collapse monthly details",
      projectedBalance: "Planned",
      plannedBalance: "Planned",
      monthlyDetails: "Month",
      cashFlow: "Cash Flow",
      historical: 'Historical',
      goalsEventsImpact: 'Goals and Events',
      strategies: {
        fixed: "Desired Income",
        preservation: "Preservation",
        legacy: "Legacy",
        spendAll: "Spend All"
      }
    }
  },
  expenseChart: {
    pastYears: "Years ago",
    futureYears: "Years in the future",
    portfolioValue: "Portfolio Value",
    inflationAdjusted: "Inflation Adjusted",
    actualValue: "Real Evolution",
    actualValueReal: "Real Evolution",
    actualValueProjection: "Projected Evolution",
    projectedValue: "Planned",
    projectedValueReal: "Planned Real",
    oldPortfolioValue: "Old Portfolio",
    years: "years",
    goalAchievement: "Goal achieved",
    realValues: "Real Values",
    nominalValues: "Nominal Values",
    realValuesTooltip: "Inflation-adjusted values, showing real purchasing power over time",
    nominalValuesTooltip: "Nominal values, without inflation adjustment, showing gross value over time",
    addNewGoal: "Add New Goal",
    addNewEvent: "Add New Event",
    clickToAdd: "Click on a chart point to add a goal or event",
    selectedDate: "Selected Date",
    selectedMonth: "Selected Month",
    selectedYear: "Selected Year",
    showNegativeValues: "With Negative Values",
    hideNegativeValues: "Without Negative Values",
    lifetimeIncome: "Lifetime Income",
    projectedLifetimeIncome: "Projected Lifetime Income",
    plannedLifetimeIncome: "Planned Lifetime Income",
    advancedOptions: "Advanced Options",
    oldPortfolioLifetimeIncome: "Old Portfolio Lifetime Income",
    valueType: "Value Type",
    display: "Display",
    noNegativeValues: "Without Negative Values",
    advancedOptionsHelp: "Nominal values show gross value over time, without inflation adjustment. Real values show real purchasing power over time, adjusting for inflation.",
    chartOptionsSection: "Contribution/Withdrawal Changes",
    changeMonthlyDeposit: "Change Monthly Deposit",
    changeMonthlyWithdraw: "Change Monthly Withdrawal",
    newDepositValue: "New value (plan initial value: {{value}})",
    newWithdrawValue: "New value (plan initial value: {{value}})",
    changeDate: "Change date",
    chartOptionsHelp: "The entered value will be applied from the specified date, without considering accumulated inflation since plan start. Inflation will only be applied from the change date onwards.",
    showOldPortfolio: "Show Old Portfolio",
    showOldPortfolioHelp: "Shows or hides the old portfolio line in the chart. This line represents the value the client already had before starting the investment plan.",
    showProjectedLine: "Show Projection Line",
    showProjectedLineHelp: "Shows or hides the dashed orange line representing the planned financial projection.",
    showPlannedLine: "Show Real Evolution Line",
    showPlannedLineHelp: "Shows or hides the blue line representing the real wealth evolution (real and projected data).",
    chartOptions: "Chart Options",
    showRealValues: "Show Real Values"
  },
  budgetCategories: {
    categories: {
      Housing: "Housing",
      Food: "Food",
      Transportation: "Transportation",
      Entertainment: "Entertainment"
    }
  },
  savingsGoal: {
    title: "Investment Goal",
    tooltip: "Track your progress toward your investment goal. The chart shows how much you've already accumulated relative to the required amount for your retirement.",
    currentValue: "Current Value: {{value}}",
    currentPeriod: "Current Period: {{month}}/{{year}}",
    returnRate: "Return rate: {{value}}% p.a.",
    projectedAge: {
      label: "Projected Age:",
      years: " years",
      months: " months",
      aheadOfSchedule: "Ahead by {{years}} years and {{months}} months",
      behindSchedule: "Behind by {{years}} years and {{months}} months",
      aheadOfScheduleMonths: "Ahead by {{months}} months",
      behindScheduleMonths: "Behind by {{months}} months"
    },
    goal: {
      meta: "Goal",
      planned: "Planned",
      projected: "Projected",
      goalPresentValue: "Goal",
      goalFutureValue: "Goal (Future Value)",
      plannedFutureValue: "Planned (Future Value)",
      projectedFutureValue: "Projected (Future Value)",
      targetAge: "Target Age: {{age}} years",
      projectedValue: "Projected (Projected Value)"
    },
    ageNotAvailable: "Projected age not available",
    metaNotAchieved: "Goal will not be achieved at projected age"
  },
  financialRecords: {
    confirmIPCASync: "Are you sure you want to sync financial records with IPCA?",
    ipcaSyncSuccess: "{{count}} IPCA synced successfully",
    ipcaSyncZeroRecords: "No financial records different from IPCA to sync",
    syncIPCA: "Sync IPCA",
    editTitle: "Edit Financial Record",  
    updateSuccess: "Record updated successfully",
    partialImport: "Partial Import",
    importErrors: "Import Errors",
    monthlyContribution: "Monthly Contribution",
    title: "Financial Records",
    addNew: "Add New",
    startingBalance: "Starting Balance",
    endingBalance: "Ending Balance",
    growth: "Returns",
    noRecords: "No financial records found",
    new: {
      title: "New Financial Record"
    },
    form: {
      year: "Year",
      basicInfo: "Basic Information",
      balances: "Balance",
      contributions: "Contributions",
      returns: "Returns",
      month: "Month",
      startingBalance: "Starting Balance",
      monthlyContribution: "Monthly Contribution",
      monthlyReturn: "Monthly Return",
      monthlyReturnRate: "Monthly Return Rate (%)",
      endingBalance: "Ending Balance",
      targetRentability: "Target Return (%)",
      submit: "Save Record",
      goalsAndEvents: 'Pending Goals and Events',
      noGoalsOrEvents: 'There are no pending goals or events for this period',
      goals: 'Goals',
      events: 'Events',
      selectedTotal: 'Selected Events Balance',
      eventsBalance: 'Events Balance',
      linkToGoalsEvents: 'Link to Goals/Events',
      linkDescription: 'Link this record to existing goals or events or create new ones',
      hide: 'Hide',
      link: 'Link',
      linkExisting: 'Link Existing',
      createNew: 'Create New',
      goal: 'Goal',
      event: 'Event',
      linkedItems: 'Linked Items',
      ipcaReference: 'IPCA for {{date}}'
    },
    importTitle: "Import Records",
    importInstructions: "Select a CSV or TXT file with financial records. The file must follow the format below:",
    importSuccess: "Records imported successfully",
    confirmDelete: "Are you sure you want to delete this record?",
    deleteSuccess: "Record deleted successfully",
    confirmReset: "Are you sure you want to reset all records? This action cannot be undone.",
    resetSuccess: "Records reset successfully",
    errors: {
      ipcaSyncFailed: "Error syncing IPCA",
      fetchFailed: "Error fetching financial records",
      createFailed: "Error creating financial record",
      duplicateRecord: "Duplicate Record",
      recordExists: "A record already exists for {{month}} {{year}}",
      dataFetchFailed: "Error fetching initial data",
      futureDate: "Invalid Date",
      futureDateDescription: "Cannot add records for future dates",
      deleteFailed: "Error deleting record",
      importFailed: "Error importing records",
      resetFailed: "Error resetting records",
      invalidFormat: "Invalid file format",
      emptyFields: "Please fill in all required fields",
      beforePlanInitialDate: "Date before plan start date",
      beforePlanInitialDateDescription: "The record cannot be created before {{date}} (plan start date)."
    },
    success: {
      updated: "Financial record updated successfully",
      created: "Financial record created successfully",
      linkConflictResolved: "Existing link updated successfully"
    },
    importButton: "Import CSV",
    chooseFile: 'Choose CSV file',
    resetRecords: 'Reset Records'
  },
  clientProfile: {
    title: 'Client Information',
    loading: 'Loading...',
    backToDashboard: 'Back to Dashboard',
    profileSection: 'Personal Data',
    passwordSection: 'Change Password',
    email: 'E-mail',
    fullName: 'Full Name',
    birthDate: 'Date of Birth',
    newPassword: 'New Password',
    confirmPassword: 'Confirm New Password',
    buttons: {
      edit: 'Edit',
      editPersonalData: 'Edit Personal Data',
      save: 'Save',
      cancel: 'Cancel',
      changePassword: 'Change Password'
    },
    messages: {
      profileUpdateSuccess: 'Data updated successfully',
      profileUpdateError: 'Error updating data',
      passwordUpdateSuccess: 'Password changed successfully',
      passwordUpdateError: 'Error changing password',
      passwordMismatch: 'Passwords do not match',
      fillPasswords: 'Please fill in both password fields',
      passwordTooShort: 'Password must be at least 6 characters',
      samePassword: 'New password should be different from the old password'
    }
  },
  settings: {
    title: 'Settings',
    loading: 'Loading...',
    backToDashboard: 'Back to Dashboard',
    profileSection: 'Profile Information',
    passwordSection: 'Change Password',
    email: 'E-mail',
    fullName: 'Full Name',
    birthDate: 'Date of Birth',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm New Password',
    buttons: {
      edit: 'Edit',
      save: 'Save',
      cancel: 'Cancel',
      changePassword: 'Change Password'
    },
    messages: {
      profileUpdateSuccess: 'Profile updated successfully',
      profileUpdateError: 'Error updating profile',
      passwordUpdateSuccess: 'Password changed successfully',
      passwordUpdateError: 'Error changing password',
      passwordMismatch: 'Passwords do not match'
    }
  },
  financialGoals: {
    title: "Financial Goals",
    title_single: "Financial Goal",
    addNew: "New Goal",
    newGoal: "New Financial Goal",
    editGoal: "Edit Financial Goal",
    projected: "Projected Goals",
    showCompleted: "Show Completed Goals",
    hideCompleted: "Hide Completed Goals",
    messages: {
      createSuccess: "Goal created successfully",
      createError: "Error creating goal",
      deleteSuccess: "Goal removed successfully",
      deleteError: "Error removing goal",
      priorityUpdateError: "Error updating priorities",
    },
    form: {
      name: "Goal Name",
      icon: "Icon",
      assetValue: "Asset value",
      goalMonth: "Goal month",
      goalYear: "Goal year",
      paymentMode: "Payment Method",
      noPaymentMode: "No installment",
      installmentMode: "Installment value",
      repeatMode: "Repeat value",
      selectInstallments: "Select number of installments",
      installmentCount: "Number of installments",
      repeatCount: "Number of repetitions",
      installmentInterval: "Interval between installments (months)",
      repeatInterval: "Interval between repetitions (months)"
    },
    labels: {
      assetValue: "Asset value",
      targetAmount: "Required amount"
    },
    icons: {
      house: "House",
      car: "Car",
      travel: "Travel",
      family: "Family",
      electronic: "Electronic",
      education: "Education",
      hobby: "Hobby",
      professional: "Professional",
      health: "Health",
      other: "Other",
    },
  },
  events: {
    title: "Financial Events",
    title_single: "Financial Event",
    addNew: "New Event",
    newEvent: "New Financial Event",
    editEvent: "Edit Event",
    projected: "Projected Events",
    showCompleted: "Show Completed Events",
    hideCompleted: "Hide Completed Events",
    messages: {
      createSuccess: "Event created successfully",
      createError: "Error creating event",
      deleteSuccess: "Event removed successfully",
      deleteError: "Error removing event",
    },
    form: {
      name: "Event Name",
      icon: "Icon",
      assetValue: "Event value",
      eventMonth: "Event month",
      eventYear: "Event year",
      isInstallment: "Installment?",
      installmentProject: "Installment?",
      selectInstallments: "Select number of installments",
      installmentCount: "Number of installments",
      repeatCount: "Number of repetitions",
      installmentInterval: "Interval between installments (months)",
      repeatInterval: "Interval between repetitions (months)",
      eventType: "Event Type",
      amount: "Amount",
      month: "Month",
      year: "Year"
    },
    labels: {
      assetValue: "Event value",
      targetAmount: "Required amount"
    },
    types: {
      goal: "Goal",
      contribution: "Contribution",
      other: "Other"
    },
    icons: {
      goal: "Goal",
      contribution: "Contribution",
      other: "Other",
      house: "House",
      accident: "Accident",
      renovation: "Renovation",
      car: "Car",
      travel: "Travel",
      family: "Family",
      electronic: "Electronic",
      education: "Education",
      hobby: "Hobby",
      professional: "Professional",
      health: "Health",
    },
  },
  auth: {
    brokerInactive: "Broker inactive. Contact support for more information.",
    clientLogin: "Client Access",
    brokerLogin: "Login",
    password: "Password",
    enterPassword: "Enter your password",
    login: "Login",
    loginSuccess: "Login successful",
    invalidPassword: "Invalid password",
    errorFetchingInfo: "Error loading client information",
    clientName: "Client: {{name}}",
    brokerName: "Broker: {{name}}",
    enterEmail: "Enter your email",
    email: "Email",
    errors: {
      invalidCredentials: "Invalid credentials",
      sessionExpired: "Session expired",
      networkError: "Connection error",
      unknownError: "Unknown error",
      unauthorized: "Unauthorized access. Only brokers and administrators can access this area."
    }
  },
  notFound: {
    title: "404",
    description: "Oops! Page not found",
    returnHome: "Return to Home Page"
  },
  error: {
    title: "Error",
    description: "An unexpected error occurred",
    tryAgain: "Try again",
    contactSupport: "Contact support"
  },
  loading: {
    title: "Loading",
    description: "Please wait while we load the data"
  },
  validation: {
    required: 'All fields are required',
    invalidEmail: 'Invalid email',
    invalidPassword: "Invalid password",
    passwordsDontMatch: "Passwords do not match",
    minLength: "Minimum {{min}} characters",
    maxLength: "Maximum {{max}} characters"
  },
  console: {
    error: {
      routeNotFound: "404 Error: User tried to access non-existent route:"
    }
  },
  api: {
    errors: {
      fetchFailed: "Failed to fetch data",
      updateFailed: "Failed to update data",
      createFailed: "Failed to create record",
      deleteFailed: "Failed to delete record",
      validationFailed: "Data validation failed"
    }
  },
  query: {
    errors: {
      notFound: "Record not found",
      unauthorized: "Unauthorized access",
      forbidden: "Access forbidden",
      serverError: "Server error"
    }
  },
  navigation: {
    back: "Back",
    next: "Next",
    previous: "Previous",
    first: "First",
    last: "Last",
    page: "Page",
    of: "of",
    items: "items"
  },
  date: {
    formats: {
      short: "MM/DD/YYYY",
      long: "MMMM DD, YYYY",
      time: "HH:mm",
      datetime: "MM/DD/YYYY HH:mm"
    },
    months: {
      january: "January",
      february: "February",
      march: "March",
      april: "April",
      may: "May",
      june: "June",
      july: "July",
      august: "August",
      september: "September",
      october: "October",
      november: "November",
      december: "December"
    },
    days: {
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      thursday: "Thursday",
      friday: "Friday",
      saturday: "Saturday",
      sunday: "Sunday"
    }
  },
  adminDashboard: {
    activeBrokers: 'Active Brokers',
    totalBrokers: 'Total Brokers',
    averagePerClient: "Average per client",
    needReview: "need review",
    title: 'Administrative Panel',
    subtitle: 'Manage brokers and monitor system metrics',
    createBroker: 'Create Broker',
    createBrokerDescription: 'Create a new broker account with email and password.',
    brokerName: 'Broker Name',
    brokerNamePlaceholder: 'Enter broker name',
    brokerEmail: 'Email',
    brokerEmailPlaceholder: 'Enter broker email',
    brokerPassword: 'Password',
    brokerPasswordPlaceholder: 'Enter broker password',
    brokerCreated: 'Broker created successfully',
    brokersList: 'Brokers List',
    broker: 'Broker',
    status: 'Status',
    active: 'Active',
    inactive: 'Inactive',
    actions: 'Actions',
    brokerActivated: 'Broker activated successfully',
    brokerDeactivated: 'Broker deactivated successfully',
    filterStatus: 'Filter by Status',
    allStatus: 'All',
    activeOnly: 'Active Only',
    inactiveOnly: 'Inactive Only',
    deactivateClient: 'Deactivate Broker',
    activateClient: 'Activate Broker',
    clientDeactivated: 'Broker deactivated successfully',
    clientActivated: 'Broker activated successfully',
    clients: 'Clients',
    plans: 'Plans',
    balance: 'Balance',
    lastActivity: 'Last Activity',
    activeClients: 'Active Clients',
    totalClients: 'Total Clients',
    totalPlans: 'Total Plans',
    totalBalance: 'Total Balance',
    clientsPerBroker: 'Clients per Broker',
    balancePerBroker: 'Balance per Broker',
    planDistribution: 'Plan Distribution',
    clientActivity: 'Client Activity',
    searchPlaceholder: 'Search brokers...',
    loading: 'Loading...',
    brokers: 'brokers',
    errors: {
      unauthorized: 'You are not authorized to access this page',
      emailExists: 'This email is already in use. Please use another email.',
      samePassword: 'New password should be different from the old password'
    },
    showing: 'Showing',
    of: 'of',
    items: 'items',
    showingItems: 'Showing {{from}} to {{to}} of {{total}} items',
    page: 'Page',
    next: 'Next',
    previous: 'Previous',
    first: 'First',
    last: 'Last',
    email: 'Email',
    activeRatio: 'Active Ratio',
    changePassword: 'Change Password',
    changePasswordDescription: 'Enter your new password below. Make sure it is strong and secure.',
    newPassword: 'New Password',
    newPasswordPlaceholder: 'Enter your new password',
    confirmPassword: 'Confirm Password',
    confirmPasswordPlaceholder: 'Enter your new password again',
    passwordChanged: 'Password changed successfully',
    clientAccessAnalysis: {
      title: 'Client Access Analysis',
      activityStatus: {
        title: 'Activity Status',
        description: 'Distribution by inactivity time',
        today: 'Today',
        thisWeek: 'This Week',
        thisMonth: 'This Month',
        inactive: 'Inactive'
      },
      accessSummary: {
        title: 'Access Summary',
        description: 'Last access statistics',
        totalClients: 'Total Clients',
        accessedToday: 'Accessed today',
        accessedThisWeek: 'Accessed this week',
        inactive30Days: 'Inactive for 30+ days'
      },
      recentAccess: {
        title: 'Recent Client Access',
        description: 'Last 50 clients who accessed the platform',
        client: 'Client',
        broker: 'Broker',
        lastAccess: 'Last Access',
        status: 'Status',
        today: 'Today',
        yesterday: 'Yesterday',
        days: 'days',
        inactive: 'Inactive',
        never: 'Never'
      }
    },
  },
  familyStructure: {
    title: 'Family Structure',
    maritalStatus: {
      label: 'Marital Status',
      placeholder: 'Select marital status',
      options: {
        single: 'Single',
        total_separation: 'Total Separation',
        partial_community: 'Partial Community',
        total_community: 'Total Community'
      }
    },
    spouse: {
      name: {
        label: 'Spouse Name'
      },
      birthDate: {
        label: 'Spouse Date of Birth',
        placeholder: 'mm/dd/yyyy'
      }
    },
    children: {
      empty: 'No children registered',
      title: 'Children',
      add: 'Add Child',
      name: {
        label: 'Name',
        required: 'Name is required'
      },
      birthDate: {
        label: 'Date of Birth',
        required: 'Date of birth is required',
        placeholder: 'mm/dd/yyyy'
      },
      age: {
        years: '{{age}} years',
        months: '{{age}} months',
        year: '1 year'
      },
      remove: 'Remove child'
    },
    messages: {
      success: 'Family structure updated successfully',
      error: 'Failed to update family structure',
      validation: {
        children: 'All children must have name and date of birth filled in'
      }
    }
  },
  professionalInformation: {
    title: 'Professional Information',
    name: {
      label: 'Name',
      placeholder: 'Your full name',
      required: 'Name is required'
    },
    birthDate: {
      label: 'Date of Birth',
      placeholder: 'Your date of birth',
      required: 'Date of birth is required'
    },
    occupation: {
      label: 'Occupation',
      placeholder: 'Your occupation',
      required: 'Occupation is required'
    },
    workDescription: {
      label: 'What you do',
      placeholder: 'Description of your professional activities',
      required: 'Work description is required'
    },
    workLocation: {
      label: 'Where you work',
      placeholder: 'Workplace',
      required: 'Workplace is required'
    },
    workRegime: {
      label: 'Work regime',
      placeholder: 'Select work regime',
      required: 'Work regime is required',
      options: {
        pj: 'Independent Contractor',
        clt: 'Employee',
        public_servant: 'Public Servant'
      }
    },
    taxDeclarationMethod: {
      label: 'How you file taxes',
      placeholder: 'Select filing method',
      required: 'Tax filing method is required',
      options: {
        simplified: 'Simplified',
        complete: 'Complete',
        exempt: 'Does Not File'
      }
    },
    messages: {
      success: 'Professional information updated successfully',
      error: 'Failed to update professional information'
    }
  },
  investmentPolicy: {
    title: 'Investment Policy',
    quickAccess: 'Quick Access',
    sections: {
      personalInformation: 'Personal Information',
      professionalInformation: 'Professional Information',
      familyStructure: 'Family Structure',
      budget: 'Budget',
      patrimonial: 'Wealth',
      life: 'Life',
      investmentPreferences: 'Investment Preferences'
    },
    lifeStage: {
      label: 'Life Stage',
      options: {
        accumulation: 'Wealth Accumulation',
        enjoyment: 'Wealth Enjoyment',
        consolidation: 'Consolidation'
      }
    },
    hobbies: {
      label: 'Hobbies'
    },
    objectives: {
      label: 'Investment Objectives'
    },
    insurance: {
      hasInsurance: 'Has Insurance',
      hasHealthPlan: 'Has Health Plan'
    },
    messages: {
      success: 'Investment policy updated successfully',
      error: 'Failed to update investment policy'
    }
  },
  budget: {
    title: 'Budget',
    incomes: {
      title: 'Income',
      add: 'Add Income',
      remove: 'Remove income',
      description: 'Description',
      amount: 'Amount',
      empty: 'No income registered'
    },
    expenses: {
      title: 'Expenses',
      add: 'Add Expense',
      remove: 'Remove expense',
      description: 'Description',
      amount: 'Amount',
      empty: 'No expenses registered'
    },
    other: {
      title: 'Other',
      bonus: 'Bonus',
      dividends: 'Dividends',
      savings: 'Savings'
    },
    messages: {
      success: 'Budget updated successfully',
      error: 'Failed to update budget',
      loadError: 'Failed to load budget'
    }
  },
  patrimonial: {
    title: 'Wealth Situation',
    save_changes: 'Save changes in Wealth Situation',
    form: {
      name: 'Name',
      value: 'Value ($)',
      location: 'Location',
      country: 'Country',
      description: 'Description',
      investments: {
        title: 'Investments',
        description: 'Register your investments, including real estate, liquid investments, equity interests, and emergency reserve',
        properties: {
          title: 'Real Estate',
          name: 'Property Name',
          value: 'Value ($)',
          location: 'Location',
          country: 'Country',
          description: 'Description',
          add: 'Add Property',
          remove: 'Remove Property',
          empty: 'No properties registered'
        },
        liquid_investments: {
          title: 'Liquid Investments',
          name: 'Investment Name',
          value: 'Value ($)',
          location: 'Location',
          country: 'Country',
          description: 'Description',
          add: 'Add Investment',
          remove: 'Remove Investment',
          empty: 'No investments registered'
        },
        participations: {
          title: 'Equity Interests',
          name: 'Interest Name',
          value: 'Value ($)',
          location: 'Location',
          country: 'Country',
          description: 'Description',
          add: 'Add Interest',
          remove: 'Remove Interest',
          empty: 'No interests registered'
        },
        emergency_reserve: {
          title: 'Emergency Reserve',
          name: 'Reserve Name',
          value: 'Value ($)',
          location: 'Location',
          country: 'Country',
          description: 'Description',
          add: 'Add Reserve',
          remove: 'Remove Reserve',
          empty: 'No reserves registered'
        }
      },
      personal_assets: {
        title: 'Personal Assets',
        description: 'Register your personal assets, including real estate, vehicles, and valuables',
        properties: {
          title: 'Real Estate',
          name: 'Property Name',
          value: 'Value ($)',
          location: 'Location',
          country: 'Country',
          description: 'Description',
          add: 'Add Property',
          remove: 'Remove Property',
          empty: 'No properties registered'
        },
        vehicles: {
          title: 'Vehicles',
          name: 'Vehicle Name',
          value: 'Value ($)',
          location: 'Location',
          country: 'Country',
          description: 'Description',
          add: 'Add Vehicle',
          remove: 'Remove Vehicle',
          empty: 'No vehicles registered'
        },
        valuable_goods: {
          title: 'Valuables',
          name: 'Item Name',
          value: 'Value ($)',
          location: 'Location',
          country: 'Country',
          description: 'Description',
          add: 'Add Item',
          remove: 'Remove Item',
          empty: 'No items registered'
        }
      },
      liabilities: {
        title: 'Liabilities',
        description: 'Register your liabilities, including financing and debts',
        financing: {
          title: 'Financing',
          name: 'Financing Name',
          value: 'Value ($)',
          location: 'Location',
          country: 'Country',
          description: 'Description',
          add: 'Add Financing',
          remove: 'Remove Financing',
          empty: 'No financing registered'
        },
        debts: {
          title: 'Debts',
          name: 'Debt Name',
          value: 'Value ($)',
          location: 'Location',
          country: 'Country',
          description: 'Description',
          add: 'Add Debt',
          remove: 'Remove Debt',
          empty: 'No debts registered'
        }
      }
    },
    messages: {
      success: 'Wealth situation updated successfully',
      error: 'Failed to update wealth situation'
    }
  },
  life: {
    title: 'Life',
    messages: {
      success: 'Life information updated successfully',
      error: 'Failed to update life information'
    }
  },
  portfolioPerformance: {
    selectAll: "Select All",
    newRecord: "New Record",
    filters: {
      all: "All",
      allPeriods: "All periods",
      allInstitutions: "All institutions",
      allClasses: "All classes",
      allIssuers: "All issuers"
    },
    importCSV: {
      title: "Import CSV",
      consolidatedDescription: "Import consolidated performance data in CSV format",
      detailedDescription: "Import detailed performance data in CSV format",
      expectedFormat: "Expected Format",
      importFile: "Import File",
      requiredColumns: "Required Columns",
      exampleData: "Example Data",
      notes: {
        title: "Notes",
        dateFormat: "Date must be in DD/MM/YYYY format",
        periodFormat: "Period must be in MM/YYYY format",
        currencyFormat: "Currency values can be in $ with dots and commas (e.g., $ 1,234.56)",
        percentageFormat: "Percentages can be with comma (e.g., 1.24%)",
        duplicates: "If there are duplicate records, they will be inserted as new records"
      },
      importing: "Importing...",
      selectFile: "Select CSV File",
      fileHint: "Click to select a CSV file",
      successTitle: "Import Successful",
      partialSuccessTitle: "Partial Import",
      successMessage: "{{success}} records imported successfully",
      partialSuccessMessage: "{{success}} records imported successfully, {{failed}} failures",
      errorRow: "Row {{row}}: {{reason}}",
      moreErrors: "... and {{count}} more error(s)",
      button: "Import CSV"
    },
    validation: {
      duplicateTitle: "Duplicate Record",
      consolidatedDuplicate: "A record with the same Profile, Institution, and Period already exists.",
      detailedDuplicate: "A record with the same Profile, Institution, Asset, Position, and Period already exists.",
      invalidData: "Invalid Data",
      assetAndPositionRequired: "Asset and Position are required.",
      updateSuccess: "Record updated successfully",
      createSuccess: "Record created successfully",
      saveError: "Error saving",
      unknownError: "Unknown error",
      invalidPeriod: "Invalid period",
      periodFormat: "Format must be MM/YYYY",
      invalidMonth: "Month must be between 01 and 12",
      invalidYear: "Invalid year"
    },
    competenceSelector: {
      noCompetenceFound: "No period found",
      filterByPeriod: "Filter by Period:",
      from: "From:",
      to: "To:",
      start: "Start",
      end: "End"
    },
    months: {
      short: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    },
    dataManagement: {
      title: "Manage Portfolio Data",
      back: "Back",
      filters: "Filters",
      filterLabels: {
        periods: "Periods",
        institutions: "Institutions",
        assetClasses: "Asset Classes",
        issuers: "Issuers",
        search: "Search",
        searchPlaceholder: "Search by asset, issuer or class...",
        verification: "Verification"
      },
      tabs: {
        consolidated: "Consolidated Data",
        detailed: "Detailed Data",
        consolidatedSubtitle: "Consolidated performance by period and institution"
      },
      addFilter: "+ Add Filter",
      columns: "Columns",
      selectColumns: "Select Columns",
      columnsInfo: "All columns are visible",
      selected: "selected",
      clear: "Clear",
      loading: "Loading...",
      noData: "No data",
      table: {
        period: "Period",
        institution: "Institution",
        currency: "Currency",
        accountName: "Account Name",
        initialAssets: "Initial Assets",
        movement: "Movement",
        taxes: "Taxes",
        financialGain: "Financial Gain",
        finalAssets: "Final Assets",
        finalAssetsShort: "Final Assets",
        yield: "Yield %",
        yieldShort: "Yield %",
        actions: "Actions",
        asset: "Asset",
        issuer: "Issuer",
        assetClass: "Class",
        position: "Position",
        rate: "Rate",
        maturity: "Maturity",
        verification: "Verification"
      },
      viewDetailed: "View {{count}} detailed asset(s)",
      createFromRecord: "Create new record based on this",
      edit: "Edit",
      editDialog: {
        edit: "Edit",
        create: "Create",
        consolidatedData: "Consolidated Data",
        detailedData: "Detailed Data",
        periodLabel: "Period (MM/YYYY)",
        institutionLabel: "Institution",
        currencyLabel: "Currency",
        accountNameLabel: "Account Name",
        accountNamePlaceholder: "Optional - Account name to differentiate multiple accounts",
        initialAssetsLabel: "Initial Assets",
        movementLabel: "Movement",
        taxesLabel: "Taxes",
        financialGainLabel: "Financial Gain",
        finalAssetsLabel: "Final Assets",
        yieldLabel: "Yield (%)",
        assetLabel: "Asset",
        issuerLabel: "Issuer",
        assetClassLabel: "Asset Class",
        positionLabel: "Position",
        rateLabel: "Rate",
        maturityLabel: "Maturity",
        cancel: "Cancel",
        save: "Save",
        invalidMonth: "Invalid month (01-12)",
        invalidYear: "Invalid year"
      },
      delete: {
        confirmTitle: "Confirm Deletion",
        confirmMessage: "Are you sure you want to delete this record? This action cannot be undone.",
        confirmDeleteMultiple: "Confirm Deletion",
        confirmDeleteMultipleMessage: "Are you sure you want to delete {{count}} selected record(s)? This action cannot be undone.",
        deleteButton: "Delete",
        deleteSelected: "Delete Selected",
        cancel: "Cancel",
        success: "Record deleted successfully",
        successMultiple: "{{count}} record(s) deleted successfully"
      },
      activeFilters: "Filters:",
      clearAllFilters: "Clear all",
      quickFilters: "Quick Filters",
      selectAll: "Select All",
      selectAllColumns: "Select All Columns",
      filterBuilder: {
        field: "Field",
        selectField: "Select a field",
        operator: "Operator",
        selectOperator: "Select an operator",
        value: "Value",
        selectValue: "Select a value",
        selectValues: "Select values",
        selected: "selected",
        enterValue: "Enter value",
        add: "Add"
      },
      export: {
        button: "Export CSV",
        title: "Export Data to CSV",
        description: "Choose which data set you want to export:",
        filtered: "Export filtered data",
        all: "Export all data",
        recordsWithFilters: "record(s) with current filters applied",
        recordsWithoutFilters: "record(s) without applying filters",
        recordsExported: "record(s) exported successfully.",
        success: "Export completed",
        error: "Export error",
        errorDescription: "An error occurred while exporting the data.",
        noData: "No data to export",
        noDataDescription: "There is no data available for export."
      },
      import: {
        consolidatedTitle: "Import Consolidated Data",
        detailedTitle: "Import Detailed Data",
        description: "Choose one of the options below to import your data:",
        downloadTemplate: "1. Download example file",
        downloadTemplateDescription: "Download a CSV example file with the correct column format.",
        downloadTemplateButton: "Download CSV Template",
        uploadCSV: "2. Import your CSV file",
        uploadCSVDescription: "After filling the file, upload the CSV to import the data.",
        selectCSV: "Select CSV file",
        uploadPDF: "3. Import PDF file",
        uploadPDFDescription: "Send a PDF for automatic processing via n8n.",
        selectPDF: "Select PDF file",
        uploadingPDF: "Uploading PDF...",
        importing: "Importing...",
        columnOrder: "Column order:",
        consolidatedColumnOrder: "Period → Institution → Currency → Account Name → Initial Assets → Movement → Taxes → Financial Gain → Final Assets → Yield",
        detailedColumnOrder: "Period → Institution → Currency → Account Name → Asset → Issuer → Asset Class → Position → Rate → Maturity → Yield",
        templateDownloaded: "Template downloaded",
        templateDownloadedDescription: "Example file downloaded successfully.",
        templateError: "Error generating template",
        templateErrorDescription: "An error occurred while creating the example file.",
        invalidFile: "Invalid file",
        invalidFileDescription: "Please select a PDF file.",
        pdfSuccess: "PDF sent successfully",
        pdfSuccessDescription: "The PDF has been sent for processing. Data will be imported shortly.",
        pdfError: "Error sending PDF",
        pdfErrorDescription: "An error occurred while sending the PDF."
      },
      marketDataAudit: "Real Proof",
      settings: "Settings",
      verificationSettings: "Verification Settings",
      correctThreshold: "Limit for \"Correct\" ($)",
      correctThresholdDescription: "Differences below this value will be marked as \"Correct\" (green).",
      toleranceThreshold: "Limit for \"Tolerance\" ($)",
      toleranceThresholdDescription: "Differences below this value will be marked as \"Tolerance\" (yellow) instead of \"Inconsistent\" (red).",
      currentValue: "Current value:",
      howItWorks: "How it works:",
      differenceCorrect: "Difference <",
      differenceTolerance: "Difference <",
      differenceInconsistent: "Difference ≥",
      correct: "Correct",
      tolerance: "Tolerance",
      inconsistent: "Inconsistent",
      invalidValue: "Invalid Value",
      invalidToleranceValue: "Please enter a valid tolerance value greater than or equal to zero.",
      invalidCorrectThreshold: "Please enter a valid 'Correct' limit greater than or equal to zero.",
      invalidConfiguration: "Invalid Configuration",
      correctMustBeLessThanTolerance: "The 'Correct' limit must be less than the 'Tolerance' limit.",
      settingsSaved: "Settings saved",
      saving: "Saving...",
      save: "Save",
      cancel: "Cancel",
      error: "Error",
      profileIdRequired: "Profile ID not found."
    },
    verification: {
      match: "OK",
      tolerance: "Tolerance",
      mismatch: "Mismatch",
      noData: "No data",
      unclassified: "unclassified",
      missingYield: "missing yield",
      summaryTitle: "Integrity Verification Summary",
      summarySubtitle: "organized by competence",
      withUnclassified: "With Unclassified",
      withMissingYield: "With Missing Yield",
      assets: "assets",
      integrity: "Integrity Verification",
      finalAssets: "Final Assets:",
      detailedSum: "Detailed Sum:",
      difference: "Difference:",
      detailedRecords: "Detailed Records:",
      mismatchWarning: "Significant difference detected. Check the assets.",
      noDataWarning: "No detailed data found for this combination.",
      classification: "Classification Verification",
      classified: "Classified:",
      unclassifiedLabel: "Unclassified:",
      unclassifiedWarning: "{{count}} asset(s) with invalid or unclassified class detected.",
      unclassifiedHint: "Make sure the class is in the valid options list of the dropdown.",
      profitability: "Profitability Verification",
      withYield: "With Yield:",
      withoutYield: "Without Yield:",
      missingYieldWarning: "{{count}} asset(s) without \"Yield\" field filled.",
      missingYieldHint: "Fill the \"Yield\" field for all assets.",
      invalidClass: "Invalid or unclassified class",
      validClass: "Valid class",
      hasYield: "Yield filled",
      status: "Status:",
      invalidClassWarning: "Invalid or unclassified class.",
      missingYieldWarningSingle: "\"Yield\" field not filled."
    },
    marketDataAudit: {
      title: "Real Proof - API Data",
      subtitle: "Market data audit by competency",
      back: "Back to Manage Data",
      ptax: "PTAX (Dollar)",
      cdi: "CDI",
      ipca: "IPCA",
      ibov: "IBOV",
      marketIndicators: "Other Indicators",
      competencesLoaded: "competencies loaded",
      consolidatedTableTitle: "Consolidated Data by Competency",
      competence: "Competency",
      ptaxRate: "PTAX (R$/USD)",
      ptaxDate: "PTAX Date",
      cdiMonthly: "Monthly CDI",
      cdiAccumulated: "Accumulated CDI",
      ipcaMonthly: "Monthly IPCA",
      ipcaAccumulated: "Accumulated IPCA",
      ibovMonthly: "Monthly IBOV",
      sp500Monthly: "Monthly S&P 500",
      tBondMonthly: "Monthly T-Bond",
      goldMonthly: "Monthly Gold",
      btcMonthly: "Monthly Bitcoin",
      usCpiMonthly: "Monthly US CPI",
      euroCpiMonthly: "Monthly Euro CPI",
      loading: "Loading...",
      noData: "No data available",
      loadPtax: "Load PTAX",
      filters: "Filters and Controls",
      filterStartPeriod: "Start Period",
      filterEndPeriod: "End Period",
      filterStartYear: "Start Year",
      filterEndYear: "End Year",
      allPeriods: "All periods",
      allYears: "All years",
      itemsPerPage: "Items per page",
      clearFilters: "Clear Filters",
      selectColumns: "Select Columns",
      visibleColumns: "Visible Columns",
      showingItems: "Showing {{from}} to {{to}} of {{total}} items",
      previous: "Previous",
      next: "Next",
      page: "Page",
      of: "of",
      apiInfo: {
        title: "API Information",
        source: "Source",
        endpoint: "Endpoint"
      }
    },
    kpi: {
      manageData: "Manage Data",
      totalAssets: "Total Assets",
      noPreviousMonth: "No previous month to compare",
      vsPreviousMonth: "vs previous month",
      monthlyYield: "Monthly Yield",
      vsTarget: "vs Target: --",
      diversification: "Diversification",
      assetsInPortfolio: "Assets in portfolio",
      nextMaturity: "Next Maturity",
      waitingData: "Waiting for data",
      noInstitution: "No Institution",
      sixMonthsReturn: "6 Months Return",
      twelveMonthsReturn: "12 Months Return",
      yearReturn: "Year Return",
      inceptionReturn: "Return since inception",
      rentability: "Return Rate",
      rentabilityVsTarget: "Return Rate (pp above target)",
      bestMonthRentability: "Month with best return rate of the year",
      table: {
        title: "Wealth Summary",
        description: "Consolidated wealth evolution with accumulated returns",
        period: "Period",
        initialAssets: "Initial Assets",
        movement: "Movements",
        taxes: "Taxes",
        finalAssets: "Final Assets",
        gain: "Gain",
        total: "Total"
      },
      investmentDetails: {
        title: "Investment Details",
        strategy: "Strategy",
        month: "Month",
        year: "Year",
        sixMonths: "6 Months",
        twelveMonths: "12 Months",
        inception: "Inception",
        noData: "No data available",
        performance: {
          excellent: "Excellent",
          good: "Good",
          regular: "Regular",
          negative: "Negative"
        }
      },
      strategyBreakdown: {
        title: "Classes",
        name: "Name",
        allocation: "Allocation",
        grossBalance: "Gross Balance",
        grossPatrimony: "Gross Patrimony",
        ofPatrimony: "of patrimony"
      },
      clientDataDisplay: {
        loading: "Loading data...",
        title: "Consolidated Performance - Most Recent Period",
        table: {
          institution: "Institution",
          initialAssets: "Initial Assets",
          movement: "Movement",
          taxes: "Taxes",
          financialGain: "Financial Gain",
          finalAssets: "Final Assets",
          yield: "Yield"
        },
        noData: {
          title: "No data found",
          message: "No data found for client \"{{clientName}}\"."
        }
      },
      institutionAllocation: {
        title: "Institution Allocation",
        grossAssets: "Gross Assets",
        noData: "No data",
        total: "Total"
      },
      imports: {
        history: "Import History",
        neverImported: "Never imported"
      },
      maturityTimeline: {
        title: "Maturities by Strategy",
        subtitle: "Distribution by maturity date",
        year: "Year",
        total: "Total Value",
        avgRate: "Average Rate",
        byStrategy: "By Strategy",
        emptyFor: "No maturity data available for",
        assetClasses: {
          postFixed: "Post Fixed",
          inflation: "Inflation",
          preFixed: "Pre Fixed",
          postFixedLiquidity: "Post Fixed - Liquidity",
          multimarket: "Multimarket",
          realEstate: "Real Estate",
          stocks: "Stocks",
          stocksLongBias: "Stocks - Long Bias",
          privateEquity: "Private Equity",
          foreignFixedIncome: "Foreign - Fixed Income",
          foreignStocks: "Foreign - Stocks",
          coe: "COE",
          gold: "Gold",
          crypto: "Crypto Assets"
        }
      }
    }
  },
  investmentPreferences: {
    title: 'Investment Preferences',
    messages: {
      success: 'Investment preferences updated successfully',
      error: 'Failed to update investment preferences',
      toast: {
        success: {
          title: 'Success',
          description: 'Investment preferences updated successfully'
        },
        error: {
          title: 'Error',
          description: 'Failed to update investment preferences'
        }
      }
    },
    form: {
      riskProfile: 'Investment Profile',
      targetReturnReview: 'Target Review',
      maxBondMaturity: 'Maximum bond maturities in portfolio',
      fgcEventFeeling: 'How would you feel in an FGC event?',
      maxFundLiquidity: 'Maximum fund liquidity period (D+X)',
      maxAcceptableLoss: 'Maximum acceptable loss',
      targetReturnIpcaPlus: 'Target Return (IPCA+X)',
      stockInvestmentMode: 'Stock investment mode',
      realEstateFundsMode: 'Direct real estate funds or FoFs',
      platformsUsed: 'Platforms used',
      assetRestrictions: 'Asset restrictions',
      areasOfInterest: 'Exposure in area of interest',
      selectPeriod: 'Select period',
      selectMaturity: 'Select maturity',
      selectFeeling: 'Select your feeling',
      selectLiquidity: 'Select period',
      selectLoss: 'Select loss',
      selectReturn: 'Select return',
      selectMode: 'Select mode',
      addPlatform: 'Add Platform',
      addRestriction: 'Add Restriction',
      addInterest: 'Add Interest',
      platform: 'Platform',
      restriction: 'Restriction',
      interest: 'Interest',
      remove: 'Remove',
      assetAllocations: 'Asset Allocation',
      totalAllocation: 'Total',
      selectAllocation: 'Select allocation',
      otherPreferences: 'Other Preferences',
      allocation: {
        fixed_income_opportunities: 'Fixed Income - Opport.',
        fixed_income_post_fixed: 'Fixed Income - Post Fixed',
        fixed_income_inflation: 'Fixed Income - Inflation',
        fixed_income_pre_fixed: 'Fixed Income - Pre Fixed',
        multimarket: 'Multimarket',
        real_estate: 'Real Estate',
        stocks: 'Stocks',
        stocks_long_biased: 'Stocks - Long Biased',
        private_equity: 'Private Equity',
        foreign_fixed_income: 'Foreign - Fixed Income',
        foreign_variable_income: 'Foreign - Variable Income',
        crypto: 'Crypto Assets'
      },
      allocationValidation: {
        totalMustBe100: 'Sum of allocations must equal 100%',
        currentTotal: 'current: {{total}}%'
      }
    },
    categories: {
      fixed_income: 'Fixed Income',
      multimarket: 'Multimarket',
      real_estate: 'Real Estate',
      stocks: 'Stocks',
      foreign_crypto: 'Foreign/Crypto'
    },
    assets: {
      fixed_income_opportunities: 'Fixed Income - Opport.',
      fixed_income_post_fixed: 'Fixed Income - Post Fixed',
      fixed_income_inflation: 'Fixed Income - Inflation',
      fixed_income_pre_fixed: 'Fixed Income - Pre Fixed',
      multimarket: 'Multimarket',
      real_estate: 'Real Estate',
      stocks: 'Stocks',
      stocks_long_biased: 'Stocks - Long Biased',
      private_equity: 'Private Equity',
      foreign_fixed_income: 'Foreign - Fixed Income',
      foreign_variable_income: 'Foreign - Variable Income',
      crypto: 'Crypto Assets'
    },
    options: {
      investmentModes: {
        direct_stocks: 'Direct Stocks',
        etfs: 'ETFs',
        stock_funds: 'Stock Funds'
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
        monthly: 'Monthly',
        quarterly: 'Quarterly',
        semiannual: 'Semiannual',
        annual: 'Annual'
      },
      bondMaturities: {
        short_term: 'Short Term (< 2 years)',
        medium_term: 'Medium Term (2-5 years)',
        long_term: 'Long Term (> 5 years)'
      },
      fgcFeelings: {
        very_comfortable: 'Very Comfortable',
        comfortable: 'Comfortable',
        neutral: 'Neutral',
        uncomfortable: 'Uncomfortable',
        very_uncomfortable: 'Very Uncomfortable'
      },
      fundLiquidity: {
        daily: 'Daily',
        d_plus_1: 'D+1',
        d_plus_2: 'D+2',
        d_plus_30: 'D+30',
        d_plus_90: 'D+90'
      },
      acceptableLoss: {
        no_loss: 'No losses',
        five_percent: '5%',
        ten_percent: '10%',
        fifteen_percent: '15%',
        twenty_percent: '20%',
        twenty_five_percent: '25%'
      },
      realEstateFundModes: {
        direct_portfolio: 'Fund Portfolio',
        fofs_consolidation: 'FoFs Consolidation'
      }
    }
  },
  clientSummary: {
    emergencyReserve: 'Emergency Reserve',
    predominantProfile: 'Predominant Profile',
    personalInfo: 'Personal Information',
    name: 'Name',
    age: 'Age',
    years: 'years',
    email: 'E-mail',
    professionalInfo: 'Professional Information',
    occupation: 'Occupation',
    workRegime: 'Work Regime',
    taxDeclaration: 'Tax Declaration',
    familyInfo: 'Family Information',
    maritalStatus: 'Marital Status',
    spouse: 'Spouse',
    children: 'Children',
    childrenCount: 'children',
    financialOverview: 'Financial Overview',
    totalIncome: 'Total Income',
    totalExpenses: 'Total Expenses',
    savingsRate: 'Savings Rate',
    investmentPreferences: 'Investment Preferences',
    targetReturn: 'Target Return',
    maxLoss: 'Maximum Acceptable Loss',
    investmentMode: 'Investment Mode',
    lifeObjectives: 'Life Objectives',
    insuranceCoverage: 'Insurance Coverage',
    workDescription: 'Work Description',
    workLocation: 'Workplace',
    spouseName: 'Spouse Name',
    spouseAge: 'Spouse Age',
    childName: 'Child Name',
    childAge: 'Child Age',
    income: 'Income',
    expense: 'Expense',
    bonus: 'Bonus',
    dividends: 'Dividends',
    savings: 'Savings',
    lifeStage: 'Life Stage',
    hobbies: 'Hobbies',
    insuranceType: 'Insurance Type',
    insuranceCompany: 'Insurance Company',
    lastReview: 'Last Review',
    noData: 'No data available',
    noChildren: 'No children',
    noInsurance: 'No insurance registered',
    noObjectives: 'No objectives registered',
    noHobbies: 'No hobbies registered',
    investments: 'Investments',
    properties: 'Real Estate',
    vehicles: 'Vehicles',
    valuableGoods: 'Valuables',
    other: 'Other',
    total: 'Total',
    information: 'Information',
    riskProfile: {
      conservative: 'Conservative',
      moderate: 'Moderate',
      aggressive: 'Aggressive',
      notInformed: 'Not informed'
    }
  },
  personalInformation: {
    title: 'Personal Information',
    name: {
      label: 'Name',
      placeholder: 'Your full name',
      required: 'Name is required'
    },
    birthDate: {
      label: 'Date of Birth',
      placeholder: 'Your date of birth',
      required: 'Date of birth is required'
    },
    messages: {
      success: 'Personal information updated successfully',
      error: 'Failed to update personal information'
    }
  },
  address: {
    cep: 'ZIP Code',
    street: 'Street',
    number: 'Number',
    complement: 'Complement',
    neighborhood: 'Neighborhood',
    city: 'City',
    state: 'State',
    cep_not_found: 'ZIP Code not found',
    cep_error: 'Error fetching ZIP Code',
  },
  landingPage: {
    mocks: {
      profile: {
        name: 'Demo Client',
        simulationName: 'Simulation Client'
      },
      goals: {
        europeTrip: 'Europe Trip',
        newCar: 'New Car',
        ownHome: 'Own Home',
        childrenEducation: 'Children Education',
        hobbyEquipment: 'Hobby Equipment',
        retirementAbroad: 'Retirement Abroad'
      },
      events: {
        annualBonus: 'Annual Bonus',
        homeRenovation: 'Home Renovation',
        inheritance: 'Inheritance',
        carChange: 'Car Change',
        propertySale: 'Property Sale'
      },
      allocation: {
        fixedIncome: 'Fixed Income',
        multimarket: 'Multimarket',
        stocks: 'Stocks',
        foreign: 'Foreign'
      }
    },
    header: {
      login: 'Login',
      requestDemo: 'Quick Contact',
      viewDashboard: 'View Dashboard'
    },
    hero: {
      badge: 'Cutting-Edge Technology for Financial Advisors',
      title: 'Manage your clients with',
      titleHighlight: 'Artificial Intelligence',
      description: 'The complete financial planning platform that transforms how you serve your clients. Accurate projections, automatic insights, and professional management in one place.',
      requestDemo: 'Request Demo',
      viewDemo: 'View Demo'
    },
    metrics: {
      clients: 'Active Clients',
      patrimony: 'Assets Under Management',
      growth: 'Average Growth',
      satisfaction: 'Satisfaction'
    },
    chart: {
      title: 'Real-Time Wealth Projection',
      description: 'Track your clients\' wealth evolution with mathematical precision',
      growth: '+33.5% in period'
    },
    interface: {
      badge: 'Cutting-Edge Technology',
      title: 'Professional and Intuitive Interface',
      description: 'Powerful dashboards that facilitate monitoring and decision making',
      dashboard: {
        title: 'Complete Dashboard',
        description: 'Real-time view of all clients',
        patrimony: 'Total Wealth',
        avgReturn: 'Average Return',
        activeClients: 'Active Clients'
      },
      alerts: {
        title: 'Smart Alerts',
        description: 'Automatic notifications about important events',
        alert1: {
          title: 'Review Needed',
          description: 'Client reached wealth target'
        },
        alert2: {
          title: 'Low Engagement',
          description: 'Client without access for 30 days'
        },
        alert3: {
          title: 'Goal Near',
          description: 'Client 6 months from retirement'
        }
      }
    },
    features: {
      title: 'Features that Transform Your Management',
      feature1: {
        title: 'Advanced Financial Projections',
        description: 'Proprietary algorithms that calculate retirement scenarios, goals, and wealth with mathematical precision'
      },
      feature2: {
        title: 'Smart Dashboard',
        description: 'View all your clients, performance metrics, and important alerts in a single screen'
      },
      feature3: {
        title: 'Goal Management',
        description: 'Track financial goals, events, and important milestones of each client automatically'
      },
      feature4: {
        title: 'Professional Reports',
        description: 'Generate detailed reports and presentations for your clients with just a few clicks'
      },
      feature5: {
        title: 'Multi-Currency',
        description: 'Full support for Real, Dollar, and Euro with updated exchange rates'
      },
      feature6: {
        title: 'Banking Security',
        description: 'Your data and your clients\' data protected with banking-level encryption'
      }
    },
    comparison: {
      title: 'Proven Results',
      description: 'See how Foundation transforms portfolio management',
      metric1: {
        value: '94%',
        description: 'of clients reach their goals'
      },
      metric2: {
        value: '3.2x',
        description: 'more efficiency in management'
      },
      metric3: {
        value: '87%',
        description: 'access the platform monthly'
      }
    },
    contact: {
      badge: 'Get in Touch',
      title: 'Ready to Transform Your Management?',
      description: 'Fill out the form below and our team will contact you for a personalized demo.',
      form: {
        name: 'Name',
        namePlaceholder: 'Your full name',
        email: 'Email',
        emailPlaceholder: 'your@email.com',
        company: 'Company',
        companyPlaceholder: 'Your company name',
        message: 'Message',
        messagePlaceholder: 'Tell us about your needs...',
        submit: 'Send Message',
        sending: 'Sending...'
      },
      success: {
        title: 'Message Sent!',
        description: 'Thank you for your interest. We will contact you soon.'
      }
    },
    footer: {
      description: 'The complete financial planning platform for professional advisors.',
      product: 'Product',
      features: 'Features',
      pricing: 'Pricing',
      docs: 'Documentation',
      company: 'Company',
      about: 'About',
      blog: 'Blog',
      contact: 'Contact',
      rights: 'All rights reserved.',
      copyright: '© 2025 Foundation. Professional financial planning platform.'
    },
    stats: {
      vsPreviousMonth: 'vs previous month'
    },
    demo: {
      clientDashboard: {
        title: 'Client Dashboard',
        client1: 'John Silva',
        client1Patrimony: '{{value}} wealth',
        client2: 'Mary Santos',
        client2Patrimony: '{{value}} wealth',
        client3: 'Peter Costa',
        client3Patrimony: '{{value}} wealth',
        onTrack: 'On track',
        attention: 'Attention',
        excellent: 'Excellent'
      },
      alerts: {
        title: 'Smart Alerts',
        lateContribution: 'Late Contribution',
        lateContributionDesc: 'John Silva hasn\'t made contribution for 2 months',
        goalAchieved: 'Goal Achieved',
        goalAchievedDesc: 'Mary Santos reached 100% of goal',
        abovePerformance: 'Above Performance',
        abovePerformanceDesc: 'Peter Costa: +15% vs target'
      }
    },
    optimization: {
      title: 'Automatic Plan Optimization',
      description: 'AI continuously analyzes progress and suggests adjustments to keep your clients on track',
      planned: 'Planned',
      projected: 'Projected',
      allocation: {
        title: 'Suggested Asset Allocation',
        description: 'Optimized distribution based on risk profile'
      }
    },
    metricsSection: {
      title: 'Metrics that Matter',
      description: 'Track essential KPIs for your clients\' success',
      successRate: 'Success Rate',
      successRateDesc: 'of clients reach their goals',
      engagement: 'Engagement',
      engagementDesc: 'access the platform monthly',
      avgReturn: 'Average Return',
      avgReturnDesc: 'performance above target',
      vsPreviousYear: 'vs previous year'
    },
    resources: {
      title: 'Features that Transform Your Consulting',
      description: 'Everything you need to offer excellent service to your clients'
    },
    contactDirect: 'Or contact us directly:',
    guarantees: {
      secure: '100% Secure',
      fastResponse: '24h Response',
      noCommitment: 'No Commitment'
    }
  },
  statementImports: {
    title: 'Import History',
    description: 'History of statement imports via n8n',
    noImports: 'No imports found',
    status: {
      success: 'Success',
      failed: 'Failed',
      running: 'Running',
      created: 'Created'
    },
    type: {
      consolidated: 'Consolidated',
      detailed: 'Detailed'
    },
    table: {
      title: 'Imports',
      status: 'Status',
      type: 'Type',
      n8nId: 'n8n ID',
      createdAt: 'Created at',
      startedAt: 'Started at',
      completedAt: 'Completed at',
      error: 'Error'
    }
  },
};
