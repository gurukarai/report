import { ProjectData, DepreciationScheduleItem, LoanRepaymentItem, ProfitabilityItem, CashFlowItem, DSCRCalculation, CalculatedResults, CostBreakdown, BalanceSheetItem } from '../types';

export const calculateLoanAmount = (
  totalProjectCost: string,
  promotersContribution: string,
  subsidy: string
): number => {
  const cost = parseFloat(totalProjectCost || '0');
  const promoter = parseFloat(promotersContribution || '0');
  const sub = parseFloat(subsidy || '0');
  const amount = cost - promoter - sub;
  return amount > 0 ? amount : 0;
};

export const calculateTotalProjectCost = (projectData: ProjectData): number => {
  const costs = [
    projectData.machineryEquipmentCost,
    projectData.shedBuildingCost,
    projectData.landCost,
    projectData.furnitureFittingsCost,
    projectData.vehicleCost,
    projectData.workingCapitalCost,
    projectData.otherAssetsCost,
  ];
  
  return costs.reduce((total, cost) => total + parseFloat(cost || '0'), 0);
};

export const calculateTotalPreliminaryPreOperativeCost = (projectData: ProjectData): number => {
  const costs = [
    projectData.projectReportCost,
    projectData.technicalKnowHowCost,
    projectData.licensingCost,
    projectData.trainingCost,
    projectData.interestDuringConstructionCost,
    projectData.otherPreOperativeCost,
  ];
  
  return costs.reduce((total, cost) => total + parseFloat(cost || '0'), 0);
};

export const calculateCostBreakdown = (projectData: ProjectData): CostBreakdown[] => {
  const totalCost = parseFloat(projectData.totalProjectCost || '0');
  
  const costItems = [
    { category: 'Machinery & Equipment', amount: parseFloat(projectData.machineryEquipmentCost || '0') },
    { category: 'Shed/Building', amount: parseFloat(projectData.shedBuildingCost || '0') },
    { category: 'Land', amount: parseFloat(projectData.landCost || '0') },
    { category: 'Furniture & Fittings', amount: parseFloat(projectData.furnitureFittingsCost || '0') },
    { category: 'Vehicle', amount: parseFloat(projectData.vehicleCost || '0') },
    { category: 'Working Capital', amount: parseFloat(projectData.workingCapitalCost || '0') },
    { category: 'Other Assets', amount: parseFloat(projectData.otherAssetsCost || '0') },
  ];

  return costItems
    .filter(item => item.amount > 0)
    .map(item => ({
      ...item,
      percentage: totalCost > 0 ? (item.amount / totalCost) * 100 : 0
    }));
};

export const calculatePreliminaryPreOperativeCostBreakdown = (projectData: ProjectData): CostBreakdown[] => {
  const totalCost = calculateTotalPreliminaryPreOperativeCost(projectData);
  
  const costItems = [
    { category: 'Project Report', amount: parseFloat(projectData.projectReportCost || '0') },
    { category: 'Technical Know-How', amount: parseFloat(projectData.technicalKnowHowCost || '0') },
    { category: 'Licensing & Registration', amount: parseFloat(projectData.licensingCost || '0') },
    { category: 'Training & Development', amount: parseFloat(projectData.trainingCost || '0') },
    { category: 'Interest During Construction', amount: parseFloat(projectData.interestDuringConstructionCost || '0') },
    { category: 'Other Pre-operative Expenses', amount: parseFloat(projectData.otherPreOperativeCost || '0') },
  ];

  return costItems
    .filter(item => item.amount > 0)
    .map(item => ({
      ...item,
      percentage: totalCost > 0 ? (item.amount / totalCost) * 100 : 0
    }));
};

export const calculateEMI = (
  loanAmount: number,
  rateOfInterest: string,
  loanTenureYears: string
): number => {
  const P = loanAmount;
  const R = parseFloat(rateOfInterest || '0') / 12 / 100;
  const N = parseFloat(loanTenureYears || '0') * 12;

  if (P > 0 && R > 0 && N > 0) {
    return P * R * Math.pow(1 + R, N) / (Math.pow(1 + R, N) - 1);
  }
  return 0;
};

export const calculateDepreciationSchedule = (
  totalProjectCost: string,
  depreciationRate: string,
  loanTenureYears: string
): DepreciationScheduleItem[] => {
  const schedule: DepreciationScheduleItem[] = [];
  const initialCost = parseFloat(totalProjectCost || '0');
  const depRate = parseFloat(depreciationRate || '0') / 100;
  const tenure = parseInt(loanTenureYears || '0');

  if (initialCost > 0 && depRate > 0 && tenure > 0) {
    let currentWDV = initialCost;
    for (let i = 1; i <= tenure; i++) {
      const depreciationAmount = currentWDV * depRate;
      const wdvAtYearEnd = currentWDV - depreciationAmount;
      schedule.push({
        year: i,
        costWDV: currentWDV,
        rate: `${(depRate * 100).toFixed(0)}%`,
        amount: depreciationAmount,
        wdvAtYearEnd: wdvAtYearEnd,
      });
      currentWDV = wdvAtYearEnd;
    }
  }
  return schedule;
};

export const calculateLoanRepaymentSchedule = (
  loanAmount: number,
  rateOfInterest: string,
  loanTenureYears: string,
  emi: number
): LoanRepaymentItem[] => {
  const schedule: LoanRepaymentItem[] = [];
  let outstandingPrincipal = loanAmount;
  const R = parseFloat(rateOfInterest || '0') / 12 / 100;
  const tenureYears = parseInt(loanTenureYears || '0');

  if (loanAmount > 0 && R > 0 && tenureYears > 0) {
    for (let year = 1; year <= tenureYears; year++) {
      let annualPrincipal = 0;
      let annualInterest = 0;
      const startMonth = (year - 1) * 12 + 1;
      const endMonth = year * 12;

      for (let month = startMonth; month <= endMonth; month++) {
        if (outstandingPrincipal > 0) {
          const interestComponent = outstandingPrincipal * R;
          let principalComponent = emi - interestComponent;

          if (principalComponent > outstandingPrincipal) {
            principalComponent = outstandingPrincipal;
          }

          annualPrincipal += principalComponent;
          annualInterest += interestComponent;
          outstandingPrincipal -= principalComponent;
        }
      }
      schedule.push({
        year: year,
        outstandingPrincipalStart: outstandingPrincipal + annualPrincipal,
        principal: annualPrincipal,
        interest: annualInterest,
      });
    }
  }
  return schedule;
};

export const calculateProfitabilityStatement = (
  projectData: ProjectData,
  loanRepaymentSchedule: LoanRepaymentItem[],
  depreciationSchedule: DepreciationScheduleItem[]
): ProfitabilityItem[] => {
  const statement: ProfitabilityItem[] = [];
  const tenureYears = parseInt(projectData.loanTenureYears || '0');
  const initialRevenue = parseFloat(projectData.projectedAnnualRevenue || '0');
  const initialExpenses = parseFloat(projectData.projectedAnnualExpenses || '0');
  const revGrowth = parseFloat(projectData.revenueGrowthRate || '0') / 100;
  const expGrowth = parseFloat(projectData.expenseGrowthRate || '0') / 100;

  let currentRevenue = initialRevenue;
  let currentExpenses = initialExpenses;

  for (let i = 1; i <= tenureYears; i++) {
    const interestPayment = loanRepaymentSchedule.find(s => s.year === i)?.interest || 0;
    const depreciation = depreciationSchedule.find(s => s.year === i)?.amount || 0;

    const netIncomeBeforeID = currentRevenue - currentExpenses;
    const netProfitBeforeTax = netIncomeBeforeID - interestPayment - depreciation;

    statement.push({
      year: i,
      income: currentRevenue,
      totalExpenses: currentExpenses,
      netIncomeBeforeID: netIncomeBeforeID,
      interest: interestPayment,
      depreciation: depreciation,
      netProfitBeforeTax: netProfitBeforeTax,
    });

    currentRevenue *= (1 + revGrowth);
    currentExpenses *= (1 + expGrowth);
  }
  return statement;
};

export const calculateCashFlowStatement = (
  profitabilityStatement: ProfitabilityItem[]
): CashFlowItem[] => {
  return profitabilityStatement.map(item => ({
    year: item.year,
    netProfit: item.netProfitBeforeTax,
    addDepreciation: item.depreciation,
    addInterest: item.interest,
    netCashAccruals: item.netIncomeBeforeID,
  }));
};

export const calculateDSCR = (
  cashFlowStatement: CashFlowItem[],
  loanRepaymentSchedule: LoanRepaymentItem[],
  loanTenureYears: string
): DSCRCalculation => {
  const dscrData = [];
  let totalDSCR = 0;
  let countDSCR = 0;

  for (let i = 1; i <= parseInt(loanTenureYears || '0'); i++) {
    const cashAccrual = cashFlowStatement.find(s => s.year === i)?.netCashAccruals || 0;
    const debtObligationPrincipal = loanRepaymentSchedule.find(s => s.year === i)?.principal || 0;
    const debtObligationInterest = loanRepaymentSchedule.find(s => s.year === i)?.interest || 0;
    const debtObligation = debtObligationPrincipal + debtObligationInterest;

    let dscr = 0;
    if (debtObligation > 0) {
      dscr = cashAccrual / debtObligation;
      totalDSCR += dscr;
      countDSCR++;
    }

    dscrData.push({
      year: i,
      netCashAccrual: cashAccrual,
      debtObligation: debtObligation,
      dscr: dscr,
    });
  }
  
  const averageDSCR = countDSCR > 0 ? totalDSCR / countDSCR : 0;
  return { data: dscrData, average: averageDSCR };
};

export const calculateBalanceSheet = (
  projectData: ProjectData,
  depreciationSchedule: DepreciationScheduleItem[],
  loanRepaymentSchedule: LoanRepaymentItem[],
  profitabilityStatement: ProfitabilityItem[]
): BalanceSheetItem[] => {
  const balanceSheet: BalanceSheetItem[] = [];
  const tenureYears = parseInt(projectData.loanTenureYears || '0');
  const initialFixedAssets = parseFloat(projectData.totalProjectCost || '0');
  const initialLoan = calculateLoanAmount(
    projectData.totalProjectCost,
    projectData.promotersContribution,
    projectData.subsidy
  );
  const promotersContribution = parseFloat(projectData.promotersContribution || '0');

  let accumulatedProfits = 0;

  for (let i = 1; i <= tenureYears; i++) {
    const depreciation = depreciationSchedule.find(s => s.year === i);
    const loanRepayment = loanRepaymentSchedule.find(s => s.year === i);
    const profitability = profitabilityStatement.find(s => s.year === i);

    const fixedAssets = depreciation ? depreciation.wdvAtYearEnd : initialFixedAssets;
    const currentAssets = Math.max(fixedAssets * 0.2, 50000); // Assume 20% of fixed assets as current assets
    const totalAssets = fixedAssets + currentAssets;

    accumulatedProfits += profitability ? profitability.netProfitBeforeTax : 0;
    const ownersEquity = promotersContribution + accumulatedProfits;

    const longTermLiabilities = loanRepayment ? 
      (initialLoan - loanRepaymentSchedule.slice(0, i).reduce((sum, item) => sum + item.principal, 0)) : 0;
    
    const currentLiabilities = Math.max(totalAssets * 0.1, 25000); // Assume 10% of assets as current liabilities
    const totalLiabilities = ownersEquity + longTermLiabilities + currentLiabilities;

    balanceSheet.push({
      year: i,
      fixedAssets,
      currentAssets,
      totalAssets,
      ownersEquity,
      longTermLiabilities,
      currentLiabilities,
      totalLiabilities,
    });
  }

  return balanceSheet;
};

export const calculateProjectViability = (
  cashFlowStatement: CashFlowItem[],
  initialInvestment: number,
  discountRate: number = 0.12
) => {
  const cashFlows = cashFlowStatement.map(item => item.netCashAccruals);
  
  // NPV Calculation
  let npv = -initialInvestment;
  cashFlows.forEach((cashFlow, index) => {
    npv += cashFlow / Math.pow(1 + discountRate, index + 1);
  });

  // IRR Calculation (simplified approximation)
  let irr = 0;
  for (let rate = 0.01; rate <= 1; rate += 0.01) {
    let testNPV = -initialInvestment;
    cashFlows.forEach((cashFlow, index) => {
      testNPV += cashFlow / Math.pow(1 + rate, index + 1);
    });
    if (testNPV <= 0) {
      irr = rate;
      break;
    }
  }

  // Payback Period
  let cumulativeCashFlow = -initialInvestment;
  let paybackPeriod = 0;
  for (let i = 0; i < cashFlows.length; i++) {
    cumulativeCashFlow += cashFlows[i];
    if (cumulativeCashFlow >= 0) {
      paybackPeriod = i + 1;
      break;
    }
  }

  // Profitability Index
  let presentValueOfCashFlows = 0;
  cashFlows.forEach((cashFlow, index) => {
    presentValueOfCashFlows += cashFlow / Math.pow(1 + discountRate, index + 1);
  });
  const profitabilityIndex = presentValueOfCashFlows / initialInvestment;

  return {
    npv,
    irr,
    paybackPeriod,
    profitabilityIndex,
  };
};

export const calculateAllResults = (projectData: ProjectData): CalculatedResults => {
  const loanAmount = calculateLoanAmount(
    projectData.totalProjectCost,
    projectData.promotersContribution,
    projectData.subsidy
  );

  const emi = calculateEMI(
    loanAmount,
    projectData.rateOfInterest,
    projectData.loanTenureYears
  );

  const costBreakdown = calculateCostBreakdown(projectData);
  const preliminaryPreOperativeCosts = calculatePreliminaryPreOperativeCostBreakdown(projectData);
  const totalPreliminaryPreOperativeCost = calculateTotalPreliminaryPreOperativeCost(projectData);

  const depreciationSchedule = calculateDepreciationSchedule(
    projectData.totalProjectCost,
    projectData.depreciationRate,
    projectData.loanTenureYears
  );

  const loanRepaymentSchedule = calculateLoanRepaymentSchedule(
    loanAmount,
    projectData.rateOfInterest,
    projectData.loanTenureYears,
    emi
  );

  const profitabilityStatement = calculateProfitabilityStatement(
    projectData,
    loanRepaymentSchedule,
    depreciationSchedule
  );

  const cashFlowStatement = calculateCashFlowStatement(profitabilityStatement);

  const dscrCalculation = calculateDSCR(
    cashFlowStatement,
    loanRepaymentSchedule,
    projectData.loanTenureYears
  );

  const balanceSheet = calculateBalanceSheet(
    projectData,
    depreciationSchedule,
    loanRepaymentSchedule,
    profitabilityStatement
  );

  const projectViability = calculateProjectViability(
    cashFlowStatement,
    parseFloat(projectData.totalProjectCost || '0')
  );

  return {
    loanAmount,
    emi,
    costBreakdown,
    preliminaryPreOperativeCosts,
    totalPreliminaryPreOperativeCost,
    depreciationSchedule,
    loanRepaymentSchedule,
    profitabilityStatement,
    cashFlowStatement,
    dscrCalculation,
    balanceSheet,
    projectViability,
  };
};