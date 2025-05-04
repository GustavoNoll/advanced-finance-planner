export default {
  financialGoals: {
    title: "Financial Expenses",
    addNew: "New Expense",
    projected: "Projected Expenses",
    showCompleted: "Show Completed Expenses",
    hideCompleted: "Hide Completed Expenses",
    messages: {
      createSuccess: "Expense created successfully",
      createError: "Error creating expense",
      deleteSuccess: "Expense removed successfully",
      deleteError: "Error removing expense",
    },
    form: {
      name: "Expense Name",
      icon: "Icon",
      assetValue: "Expense value",
      goalMonth: "Expense month",
      goalYear: "Expense year",
      isInstallment: "Installment?",
      installmentProject: "Installment?",
      selectInstallments: "Select number of installments",
      installmentCount: "Number of installments",
      installmentInterval: "Interval between installments (months)",
      enterInstallmentInterval: "Enter interval in months",
    },
    labels: {
      assetValue: "Expense value",
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
    addNew: "New Event",
    newEvent: "New Financial Event",
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
      installmentInterval: "Interval between installments (months)",
      enterInstallmentInterval: "Enter interval in months",
    },
    labels: {
      assetValue: "Event value",
      targetAmount: "Required amount"
    },
    icons: {
      goal: "Goal",
      contribution: "Contribution",
      other: "Other",
      house: "House",
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
  professionalInformation: {
    title: 'Professional Information',
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
      placeholder: 'Work location',
      required: 'Work location is required'
    },
    workRegime: {
      label: 'Work regime',
      placeholder: 'Select work regime',
      required: 'Work regime is required',
      options: {
        pj: 'PJ',
        clt: 'CLT',
        public_servant: 'Public Servant'
      }
    },
    taxDeclarationMethod: {
      label: 'How you declare taxes',
      placeholder: 'Select declaration method',
      required: 'Tax declaration method is required',
      options: {
        simplified: 'Simplified',
        complete: 'Complete',
        exempt: 'Exempt'
      }
    },
    messages: {
      success: 'Professional information updated successfully',
      error: 'Failed to update professional information'
    }
  },
}; 