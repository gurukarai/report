export interface ProjectData {
  // Personal Information
  beneficiaryName: string;
  fatherName: string;
  address: string;
  mobileNumber: string;
  aboutBeneficiary: string;
  age: string;
  gender: string;
  maritalStatus: string;
  educationalQualification: string;
  experience: string;
  caste: string;
  familyMembers: string;
  annualIncome: string;
  panNumber: string;
  aadharNumber: string;
  
  // Location Details
  location: string;
  district: string;
  state: string;
  pinCode: string;
  landOwnership: string;
  
  // Bank Details
  bankName: string;
  branchName: string;
  accountNumber: string;
  ifscCode: string;
  
  // Project Details
  projectName: string;
  category: string;
  capacity: string;
  unitOfMeasurement: string;
  projectImplementationPeriod: string;
  powerRequirement: string;
  projectObjective: string;
  marketAnalysis: string;
  competitiveAdvantage: string;
  riskAnalysis: string;
  mitigationMeasures: string;
  
  // Financial Information
  totalProjectCost: string;
  promotersContribution: string;
  subsidy: string;
  rateOfInterest: string;
  loanTenureYears: string;
  moratoriumPeriodMonths: string;
  projectedAnnualRevenue: string;
  projectedAnnualExpenses: string;
  depreciationRate: string;
  revenueGrowthRate: string;
  expenseGrowthRate: string;
  
  // Detailed Cost Components
  machineryEquipmentCost: string;
  shedBuildingCost: string;
  landCost: string;
  furnitureFittingsCost: string;
  vehicleCost: string;
  workingCapitalCost: string;
  otherAssetsCost: string;
  
  // Preliminary & Pre-operative Costs
  projectReportCost: string;
  technicalKnowHowCost: string;
  licensingCost: string;
  trainingCost: string;
  interestDuringConstructionCost: string;
  otherPreOperativeCost: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface CostBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

export interface DepreciationScheduleItem {
  year: number;
  costWDV: number;
  rate: string;
  amount: number;
  wdvAtYearEnd: number;
}

export interface LoanRepaymentItem {
  year: number;
  outstandingPrincipalStart: number;
  principal: number;
  interest: number;
}

export interface ProfitabilityItem {
  year: number;
  income: number;
  totalExpenses: number;
  netIncomeBeforeID: number;
  interest: number;
  depreciation: number;
  netProfitBeforeTax: number;
}

export interface CashFlowItem {
  year: number;
  netProfit: number;
  addDepreciation: number;
  addInterest: number;
  netCashAccruals: number;
}

export interface DSCRItem {
  year: number;
  netCashAccrual: number;
  debtObligation: number;
  dscr: number;
}

export interface DSCRCalculation {
  data: DSCRItem[];
  average: number;
}

export interface BalanceSheetItem {
  year: number;
  fixedAssets: number;
  currentAssets: number;
  totalAssets: number;
  ownersEquity: number;
  longTermLiabilities: number;
  currentLiabilities: number;
  totalLiabilities: number;
}

export interface CalculatedResults {
  loanAmount: number;
  emi: number;
  costBreakdown: CostBreakdown[];
  preliminaryPreOperativeCosts: CostBreakdown[];
  totalPreliminaryPreOperativeCost: number;
  depreciationSchedule: DepreciationScheduleItem[];
  loanRepaymentSchedule: LoanRepaymentItem[];
  profitabilityStatement: ProfitabilityItem[];
  cashFlowStatement: CashFlowItem[];
  dscrCalculation: DSCRCalculation;
  balanceSheet: BalanceSheetItem[];
  projectViability: {
    npv: number;
    irr: number;
    paybackPeriod: number;
    profitabilityIndex: number;
  };
}