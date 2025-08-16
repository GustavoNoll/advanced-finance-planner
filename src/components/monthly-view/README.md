# Monthly View Components

This folder contains the separated components for each tab of MonthlyView, organized in a modular way for better maintenance and reusability.

## Structure

### `ReturnChartTab.tsx`
Component responsible for the accumulated returns chart tab. Includes:
- Line chart with multiple metrics (real return, target, CDI, IPCA, etc.)
- Period selector (6, 12, 24 months or all time)
- Interactive tooltips
- Configurable legends

### `TableTab.tsx`
Component responsible for the financial records table tab. Includes:
- Paginated table with monthly records
- "Load more" functionality
- CSV download
- Currency and percentage formatting

### `FutureProjectionTab.tsx`
Component responsible for the future projection tab. Includes:
- Annual and monthly projection table
- Year expansion/collapse
- Configurable columns (goals/events, real evolution)
- CSV download
- Support for historical vs. projected data

## Props

### ReturnChartTab
```typescript
interface ReturnChartTabProps {
  allFinancialRecords: FinancialRecord[];
  investmentPlan: InvestmentPlan;
  profile: Profile;
  goals?: Goal[];
  events?: ProjectedEvent[];
}
```

### TableTab
```typescript
interface TableTabProps {
  allFinancialRecords: FinancialRecord[];
  investmentPlan: InvestmentPlan;
  profile: Profile;
}
```

### FutureProjectionTab
```typescript
interface FutureProjectionTabProps {
  investmentPlan: InvestmentPlan;
  profile: Profile;
  allFinancialRecords: FinancialRecord[];
  goals?: Goal[];
  events?: ProjectedEvent[];
  projectionData?: YearlyProjectionData[];
  showGoalsEvents?: boolean;        // Controls display of goals/events column
  showRealEvolution?: boolean;      // Controls display of real evolution column
  isSimulation?: boolean;           // Indicates if used in simulation
}
```

## Usage

### MonthlyView (complete)
```tsx
<MonthlyView
  userId={userId}
  initialRecords={initialRecords}
  allFinancialRecords={allFinancialRecords}
  investmentPlan={investmentPlan}
  profile={profile}
  projectionData={projectionData}
/>
```

### Simulation (without goals/events and real evolution)
```tsx
<FutureProjectionTab
  investmentPlan={investmentPlan}
  profile={profile}
  allFinancialRecords={[]}
  showGoalsEvents={false}
  showRealEvolution={false}
  isSimulation={true}
/>
```

## Advantages of the New Structure

1. **Modularity**: Each tab is an independent component
2. **Reusability**: FutureProjectionTab can be used in simulations
3. **Maintainability**: More organized and easier to maintain code
4. **Flexibility**: Control over which columns to display
5. **Testability**: Smaller components are easier to test
6. **Performance**: Conditional loading of functionalities

## Related Files

- `src/components/MonthlyView.tsx` - Main component that orchestrates the tabs
- `src/components/simulation/SimulationProjectionTable.tsx` - Simulation wrapper
- `src/lib/chart-projections.ts` - Projection data generation logic
- `src/types/financial.ts` - Shared types
