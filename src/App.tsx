import React, { useState } from 'react';
import ProjectForm from './components/ProjectForm';
import { ProjectReport } from './components/ProjectReport';
import { ProjectData, ValidationErrors } from './types';
import { validateProjectData } from './lib/validation';
import { calculateAllResults } from './lib/calculations';
import { exportToCSV, importFromCSV, validateCSVFile } from './utils/csvHandler';
import { FileText, ArrowLeft, Download, Upload } from 'lucide-react';

const initialProjectData: ProjectData = {
  // Personal Information
  beneficiaryName: '',
  fatherName: '',
  address: '',
  mobileNumber: '',
  aboutBeneficiary: '',
  age: '',
  gender: '',
  maritalStatus: '',
  educationalQualification: '',
  experience: '',
  caste: '',
  familyMembers: '',
  annualIncome: '',
  panNumber: '',
  aadharNumber: '',
  
  // Location Details
  location: '',
  district: '',
  state: '',
  pinCode: '',
  landOwnership: '',
  
  // Bank Details
  bankName: '',
  branchName: '',
  accountNumber: '',
  ifscCode: '',
  
  // Project Details
  projectName: '',
  category: '',
  capacity: '',
  unitOfMeasurement: '',
  projectImplementationPeriod: '',
  powerRequirement: '',
  projectObjective: '',
  marketAnalysis: '',
  competitiveAdvantage: '',
  riskAnalysis: '',
  mitigationMeasures: '',
  
  // Financial Information
  totalProjectCost: '',
  promotersContribution: '',
  subsidy: '',
  rateOfInterest: '',
  loanTenureYears: '',
  moratoriumPeriodMonths: '',
  projectedAnnualRevenue: '',
  projectedAnnualExpenses: '',
  depreciationRate: '',
  revenueGrowthRate: '',
  expenseGrowthRate: '',
  
  // Detailed Cost Components
  machineryEquipmentCost: '',
  shedBuildingCost: '',
  landCost: '',
  furnitureFittingsCost: '',
  vehicleCost: '',
  workingCapitalCost: '',
  otherAssetsCost: '',
  
  // Preliminary & Pre-operative Costs
  projectReportCost: '',
  technicalKnowHowCost: '',
  licensingCost: '',
  trainingCost: '',
  interestDuringConstructionCost: '',
  otherPreOperativeCost: '',
};

function App() {
  const [projectData, setProjectData] = useState<ProjectData>(initialProjectData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showReport, setShowReport] = useState(false);
  const [calculatedResults, setCalculatedResults] = useState(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleInputChange = (field: keyof ProjectData, value: string) => {
    setProjectData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateProjectData(projectData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    // Calculate all financial results
    const results = calculateAllResults(projectData);
    setCalculatedResults(results);
    setShowReport(true);
  };

  const handleReset = () => {
    setProjectData(initialProjectData);
    setErrors({});
    setShowReport(false);
    setCalculatedResults(null);
  };

  const handleExportCSV = () => {
    try {
      exportToCSV(projectData);
    } catch (error) {
      alert('Error exporting CSV. Please try again.');
    }
  };

  const handleImportCSV = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!validateCSVFile(file)) {
      alert('Please select a valid CSV file (max 5MB).');
      return;
    }

    setIsImporting(true);
    try {
      const importedData = await importFromCSV(file);
      setProjectData(importedData);
      setErrors({});
      alert('Data imported successfully!');
    } catch (error) {
      alert(`Error importing CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsImporting(false);
      // Reset the file input
      event.target.value = '';
    }
  };

  const handleLoadSampleData = () => {
    const sampleData: ProjectData = {
      // Personal Information
      beneficiaryName: 'Rajesh Kumar Sharma',
      fatherName: 'Ramesh Kumar Sharma',
      address: 'Plot No. 123, Sector 15, Industrial Area, Near City Mall, Mumbai, Maharashtra - 400001',
      mobileNumber: '9876543210',
      aboutBeneficiary: 'Mr. Rajesh Kumar Sharma is a graduate in Commerce with 8 years of experience in retail business. He has successfully managed a small grocery store and now wants to expand into travel and tourism business. He has good knowledge of local market conditions and customer preferences. His family is supportive of the business venture.',
      age: '35',
      gender: 'Male',
      maritalStatus: 'Married',
      educationalQualification: 'B.Com, Diploma in Tourism Management',
      experience: '8 years in retail business, 2 years in travel industry',
      caste: 'General',
      familyMembers: '4',
      annualIncome: '300000',
      panNumber: 'ABCDE1234F',
      aadharNumber: '1234 5678 9012',
      
      // Location Details
      location: 'Industrial Area, Sector 15',
      district: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400001',
      landOwnership: 'Rented commercial space - 3 year lease agreement',
      
      // Bank Details
      bankName: 'State Bank of India',
      branchName: 'Industrial Area Branch',
      accountNumber: '1234567890123456',
      ifscCode: 'SBIN0001234',
      
      // Project Details
      projectName: 'Travel & Tourism Services',
      category: 'Service',
      capacity: '50 customers per day',
      unitOfMeasurement: 'Customers',
      projectImplementationPeriod: '6 months',
      powerRequirement: '5 KW',
      projectObjective: 'To establish a comprehensive travel and tourism service center providing domestic and international tour packages, hotel bookings, transportation services, and travel insurance. The objective is to cater to the growing demand for organized travel services in the region and provide customers with hassle-free travel experiences.',
      marketAnalysis: 'The travel and tourism industry in India is experiencing significant growth with increasing disposable income and changing lifestyle preferences. The local market shows strong demand for organized tour packages, especially for family vacations and religious tourism. Competition exists but there is room for quality service providers. The location advantage near commercial areas ensures good footfall.',
      competitiveAdvantage: 'Personalized service approach, competitive pricing, local market knowledge, strong vendor relationships, and focus on customer satisfaction. Plans to leverage digital marketing and social media presence to reach wider audience.',
      riskAnalysis: 'Market risks include seasonal fluctuations in travel demand, economic downturns affecting discretionary spending, and increased competition. Operational risks include dependency on external vendors, travel restrictions, and changing government regulations. Financial risks include cash flow variations and bad debts.',
      mitigationMeasures: 'Diversify service offerings to include corporate travel and local tourism. Maintain strong cash reserves for seasonal variations. Develop multiple vendor relationships to reduce dependency. Implement proper credit policies and advance payment systems. Stay updated with industry regulations and maintain necessary licenses.',
      
      // Financial Information
      totalProjectCost: '1575000',
      promotersContribution: '76232',
      subsidy: '434519',
      rateOfInterest: '12',
      loanTenureYears: '7',
      moratoriumPeriodMonths: '0',
      projectedAnnualRevenue: '1200000',
      projectedAnnualExpenses: '826000',
      depreciationRate: '10',
      revenueGrowthRate: '10',
      expenseGrowthRate: '8',
      
      // Detailed Cost Components
      machineryEquipmentCost: '200000',
      shedBuildingCost: '300000',
      landCost: '0',
      furnitureFittingsCost: '150000',
      vehicleCost: '400000',
      workingCapitalCost: '300000',
      otherAssetsCost: '100000',
      
      // Preliminary & Pre-operative Costs
      projectReportCost: '15000',
      technicalKnowHowCost: '25000',
      licensingCost: '20000',
      trainingCost: '30000',
      interestDuringConstructionCost: '25000',
      otherPreOperativeCost: '10000',
    };
    
    setProjectData(sampleData);
    setErrors({});
  };

  const handleBackToForm = () => {
    setShowReport(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-full mr-4">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">
              Project Report Generator
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create comprehensive project reports with detailed financial analysis, 
            cost breakdowns, and viability assessments for business planning and loan applications.
          </p>
        </div>

        {!showReport ? (
          <ProjectForm
            projectData={projectData}
            errors={errors}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onReset={handleReset}
            onLoadSampleData={handleLoadSampleData}
            onExportCSV={handleExportCSV}
            onImportCSV={handleImportCSV}
            isImporting={isImporting}
          />
        ) : (
          <div>
            <div className="mb-6">
              <button
                onClick={handleBackToForm}
                className="flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Form
              </button>
            </div>
            <ProjectReport
              projectData={projectData}
              calculatedResults={calculatedResults}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;