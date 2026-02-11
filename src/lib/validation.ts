import { ProjectData, ValidationErrors } from '../types';

export const validateProjectData = (projectData: ProjectData): { isValid: boolean; errors: ValidationErrors } => {
  const errors: ValidationErrors = {};
  let isValid = true;

  // Personal Information Validation
  if (!projectData.beneficiaryName.trim()) {
    errors.beneficiaryName = 'Beneficiary Name is required.';
    isValid = false;
  }

  if (!projectData.fatherName.trim()) {
    errors.fatherName = 'Father Name is required.';
    isValid = false;
  }

  if (!projectData.address.trim()) {
    errors.address = 'Address is required.';
    isValid = false;
  }

  if (!projectData.mobileNumber.trim()) {
    errors.mobileNumber = 'Mobile Number is required.';
    isValid = false;
  } else if (!/^\d{10}$/.test(projectData.mobileNumber.replace(/\D/g, ''))) {
    errors.mobileNumber = 'Mobile Number must be 10 digits.';
    isValid = false;
  }

  if (!projectData.projectName.trim()) {
    errors.projectName = 'Project Name is required.';
    isValid = false;
  }

  if (!projectData.projectImplementationPeriod.trim()) {
    errors.projectImplementationPeriod = 'Project Implementation Period is required.';
    isValid = false;
  }

  if (!projectData.aboutBeneficiary.trim()) {
    errors.aboutBeneficiary = 'About the Beneficiary is required.';
    isValid = false;
  }

  // Location validation
  if (!projectData.location.trim()) {
    errors.location = 'Location is required.';
    isValid = false;
  }

  if (!projectData.district.trim()) {
    errors.district = 'District is required.';
    isValid = false;
  }

  if (!projectData.state.trim()) {
    errors.state = 'State is required.';
    isValid = false;
  }

  // Financial validation
  const numericFields = [
    { value: projectData.totalProjectCost, name: 'totalProjectCost', label: 'Total Project Cost' },
    { value: projectData.promotersContribution, name: 'promotersContribution', label: "Promoter's Contribution" },
    { value: projectData.subsidy, name: 'subsidy', label: 'Subsidy' },
    { value: projectData.rateOfInterest, name: 'rateOfInterest', label: 'Rate of Interest' },
    { value: projectData.loanTenureYears, name: 'loanTenureYears', label: 'Loan Tenure (Years)' },
    { value: projectData.moratoriumPeriodMonths, name: 'moratoriumPeriodMonths', label: 'Moratorium Period (Months)' },
    { value: projectData.projectedAnnualRevenue, name: 'projectedAnnualRevenue', label: 'Projected Annual Revenue' },
    { value: projectData.projectedAnnualExpenses, name: 'projectedAnnualExpenses', label: 'Projected Annual Expenses' },
    { value: projectData.depreciationRate, name: 'depreciationRate', label: 'Depreciation Rate' },
    { value: projectData.revenueGrowthRate, name: 'revenueGrowthRate', label: 'Annual Revenue Growth Rate' },
    { value: projectData.expenseGrowthRate, name: 'expenseGrowthRate', label: 'Annual Expense Growth Rate' },
  ];

  numericFields.forEach(field => {
    const numValue = parseFloat(field.value);
    if (isNaN(numValue) || numValue < 0) {
      errors[field.name] = `${field.label} must be a non-negative number.`;
      isValid = false;
    }
  });

  // Cost breakdown validation - at least one cost component should be provided
  const costFields = [
    projectData.machineryEquipmentCost,
    projectData.shedBuildingCost,
    projectData.landCost,
    projectData.furnitureFittingsCost,
    projectData.vehicleCost,
    projectData.workingCapitalCost,
    projectData.otherAssetsCost,
  ];

  const hasCostComponents = costFields.some(cost => parseFloat(cost || '0') > 0);
  if (!hasCostComponents) {
    errors.costBreakdown = 'At least one cost component must be provided.';
    isValid = false;
  }

  const loanAmount = parseFloat(projectData.totalProjectCost || '0') - 
                     parseFloat(projectData.promotersContribution || '0') - 
                     parseFloat(projectData.subsidy || '0');

  if (parseFloat(projectData.loanTenureYears) <= 0 && loanAmount > 0) {
    errors.loanTenureYears = 'Loan Tenure must be greater than 0 if there is a loan.';
    isValid = false;
  }

  if (parseFloat(projectData.rateOfInterest) < 0) {
    errors.rateOfInterest = 'Rate of Interest cannot be negative.';
    isValid = false;
  }

  const cost = parseFloat(projectData.totalProjectCost || '0');
  const promoter = parseFloat(projectData.promotersContribution || '0');
  const sub = parseFloat(projectData.subsidy || '0');
  
  if (promoter + sub > cost && cost > 0) {
    errors.promoterSubsidyExceed = "Promoter's Contribution + Subsidy cannot exceed Total Project Cost.";
    isValid = false;
  }

  return { isValid, errors };
};