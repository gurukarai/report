import React from 'react';
import { ProjectData, ValidationErrors } from '../types';
import { calculateLoanAmount, calculateTotalProjectCost, calculateTotalPreliminaryPreOperativeCost } from '../lib/calculations';
import { formatCurrency } from '../utils/formatting';
import InputField from './InputField';
import TextAreaField from './TextAreaField';
import { User, MapPin, Phone, TrendingUp, DollarSign, Calendar, Percent, Settings, Wrench, Building, CreditCard, Target, BarChart3, Download, Upload } from 'lucide-react';

interface ProjectFormProps {
  projectData: ProjectData;
  errors: ValidationErrors;
  onInputChange: (field: keyof ProjectData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
  onLoadSampleData: () => void;
  onExportCSV: () => void;
  onImportCSV: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isImporting: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  projectData,
  errors,
  onInputChange,
  onSubmit,
  onReset,
  onLoadSampleData,
  onExportCSV,
  onImportCSV,
  isImporting
}) => {
  const handleInputChange = (field: keyof ProjectData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onInputChange(field, e.target.value);
  };

  const calculatedTotalCost = calculateTotalProjectCost(projectData);
  const preliminaryPreOperativeCost = calculateTotalPreliminaryPreOperativeCost(projectData);
  const grandTotalCost = calculatedTotalCost + preliminaryPreOperativeCost;
  const loanAmount = calculateLoanAmount(
    grandTotalCost.toString(),
    projectData.promotersContribution,
    projectData.subsidy
  );

  // Auto-update total project cost when component costs change
  React.useEffect(() => {
    if (grandTotalCost > 0) {
      onInputChange('totalProjectCost', grandTotalCost.toString());
    }
  }, [grandTotalCost, onInputChange]);

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Personal Information Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-blue-100 rounded-lg mr-3">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Personal Information</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InputField
            label="Beneficiary Name"
            id="beneficiaryName"
            value={projectData.beneficiaryName}
            onChange={handleInputChange('beneficiaryName')}
            error={errors.beneficiaryName}
            placeholder="e.g., John Doe"
            required
          />
          
          <InputField
            label="Father's Name"
            id="fatherName"
            value={projectData.fatherName}
            onChange={handleInputChange('fatherName')}
            error={errors.fatherName}
            placeholder="e.g., Robert Doe"
            required
          />
          
          <InputField
            label="Mobile Number"
            id="mobileNumber"
            value={projectData.mobileNumber}
            onChange={handleInputChange('mobileNumber')}
            error={errors.mobileNumber}
            placeholder="e.g., 9876543210"
            required
          />

          <InputField
            label="Age"
            id="age"
            type="number"
            value={projectData.age}
            onChange={handleInputChange('age')}
            error={errors.age}
            placeholder="e.g., 35"
          />

          <div className="group">
            <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 mb-2">
              Gender
            </label>
            <select
              id="gender"
              value={projectData.gender}
              onChange={handleInputChange('gender')}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 hover:bg-white focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="group">
            <label htmlFor="maritalStatus" className="block text-sm font-semibold text-gray-700 mb-2">
              Marital Status
            </label>
            <select
              id="maritalStatus"
              value={projectData.maritalStatus}
              onChange={handleInputChange('maritalStatus')}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 hover:bg-white focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
            >
              <option value="">Select Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          </div>

          <InputField
            label="Educational Qualification"
            id="educationalQualification"
            value={projectData.educationalQualification}
            onChange={handleInputChange('educationalQualification')}
            error={errors.educationalQualification}
            placeholder="e.g., B.Com, MBA"
          />

          <InputField
            label="Experience (Years)"
            id="experience"
            value={projectData.experience}
            onChange={handleInputChange('experience')}
            error={errors.experience}
            placeholder="e.g., 5 years in retail"
          />

          <InputField
            label="Caste Category"
            id="caste"
            value={projectData.caste}
            onChange={handleInputChange('caste')}
            error={errors.caste}
            placeholder="e.g., General, OBC, SC, ST"
          />

          <InputField
            label="Family Members"
            id="familyMembers"
            type="number"
            value={projectData.familyMembers}
            onChange={handleInputChange('familyMembers')}
            error={errors.familyMembers}
            placeholder="e.g., 4"
          />

          <InputField
            label="Annual Income (₹)"
            id="annualIncome"
            type="number"
            value={projectData.annualIncome}
            onChange={handleInputChange('annualIncome')}
            error={errors.annualIncome}
            placeholder="e.g., 300000"
          />

          <InputField
            label="PAN Number"
            id="panNumber"
            value={projectData.panNumber}
            onChange={handleInputChange('panNumber')}
            error={errors.panNumber}
            placeholder="e.g., ABCDE1234F"
          />

          <InputField
            label="Aadhar Number"
            id="aadharNumber"
            value={projectData.aadharNumber}
            onChange={handleInputChange('aadharNumber')}
            error={errors.aadharNumber}
            placeholder="e.g., 1234 5678 9012"
          />
          
          <div className="lg:col-span-3">
            <TextAreaField
              label="Address"
              id="address"
              value={projectData.address}
              onChange={handleInputChange('address')}
              error={errors.address}
              placeholder="Complete address with city, state, and PIN code"
              required
              rows={3}
            />
          </div>
          
          <div className="lg:col-span-3">
            <TextAreaField
              label="About the Beneficiary"
              id="aboutBeneficiary"
              value={projectData.aboutBeneficiary}
              onChange={handleInputChange('aboutBeneficiary')}
              error={errors.aboutBeneficiary}
              placeholder="Educational background, experience, skills, and other relevant information about the beneficiary"
              required
              rows={4}
            />
          </div>
        </div>
      </div>

      {/* Location Details Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-green-100 rounded-lg mr-3">
            <MapPin className="h-5 w-5 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Location Details</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <InputField
            label="Location"
            id="location"
            value={projectData.location}
            onChange={handleInputChange('location')}
            error={errors.location}
            placeholder="e.g., Industrial Area"
            required
          />
          
          <InputField
            label="District"
            id="district"
            value={projectData.district}
            onChange={handleInputChange('district')}
            error={errors.district}
            placeholder="e.g., Mumbai"
            required
          />
          
          <InputField
            label="State"
            id="state"
            value={projectData.state}
            onChange={handleInputChange('state')}
            error={errors.state}
            placeholder="e.g., Maharashtra"
            required
          />

          <InputField
            label="PIN Code"
            id="pinCode"
            value={projectData.pinCode}
            onChange={handleInputChange('pinCode')}
            error={errors.pinCode}
            placeholder="e.g., 400001"
          />

          <div className="lg:col-span-4">
            <InputField
              label="Land Ownership Details"
              id="landOwnership"
              value={projectData.landOwnership}
              onChange={handleInputChange('landOwnership')}
              error={errors.landOwnership}
              placeholder="e.g., Own land, Leased land, Rented premises"
            />
          </div>
        </div>
      </div>

      {/* Bank Details Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-purple-100 rounded-lg mr-3">
            <CreditCard className="h-5 w-5 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Bank Details</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Bank Name"
            id="bankName"
            value={projectData.bankName}
            onChange={handleInputChange('bankName')}
            error={errors.bankName}
            placeholder="e.g., State Bank of India"
          />
          
          <InputField
            label="Branch Name"
            id="branchName"
            value={projectData.branchName}
            onChange={handleInputChange('branchName')}
            error={errors.branchName}
            placeholder="e.g., Main Branch"
          />
          
          <InputField
            label="Account Number"
            id="accountNumber"
            value={projectData.accountNumber}
            onChange={handleInputChange('accountNumber')}
            error={errors.accountNumber}
            placeholder="e.g., 1234567890"
          />

          <InputField
            label="IFSC Code"
            id="ifscCode"
            value={projectData.ifscCode}
            onChange={handleInputChange('ifscCode')}
            error={errors.ifscCode}
            placeholder="e.g., SBIN0001234"
          />
        </div>
      </div>

      {/* Project Details Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-orange-100 rounded-lg mr-3">
            <Building className="h-5 w-5 text-orange-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Project Details</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InputField
            label="Project Name"
            id="projectName"
            value={projectData.projectName}
            onChange={handleInputChange('projectName')}
            error={errors.projectName}
            placeholder="e.g., Travel Business"
            required
          />
          
          <InputField
            label="Category"
            id="category"
            value={projectData.category}
            onChange={handleInputChange('category')}
            error={errors.category}
            placeholder="e.g., Service, Manufacturing, Trading"
          />

          <InputField
            label="Capacity"
            id="capacity"
            value={projectData.capacity}
            onChange={handleInputChange('capacity')}
            error={errors.capacity}
            placeholder="e.g., 100 units per day"
          />

          <InputField
            label="Unit of Measurement"
            id="unitOfMeasurement"
            value={projectData.unitOfMeasurement}
            onChange={handleInputChange('unitOfMeasurement')}
            error={errors.unitOfMeasurement}
            placeholder="e.g., Units, Kg, Liters"
          />
          
          <InputField
            label="Project Implementation Period"
            id="projectImplementationPeriod"
            value={projectData.projectImplementationPeriod}
            onChange={handleInputChange('projectImplementationPeriod')}
            error={errors.projectImplementationPeriod}
            placeholder="e.g., 6 months"
            required
          />
          
          <InputField
            label="Power Requirement"
            id="powerRequirement"
            value={projectData.powerRequirement}
            onChange={handleInputChange('powerRequirement')}
            error={errors.powerRequirement}
            placeholder="e.g., 10 KW"
          />

          <div className="lg:col-span-3">
            <TextAreaField
              label="Project Objective"
              id="projectObjective"
              value={projectData.projectObjective}
              onChange={handleInputChange('projectObjective')}
              error={errors.projectObjective}
              placeholder="Describe the main objectives and goals of the project"
              rows={3}
            />
          </div>

          <div className="lg:col-span-3">
            <TextAreaField
              label="Market Analysis"
              id="marketAnalysis"
              value={projectData.marketAnalysis}
              onChange={handleInputChange('marketAnalysis')}
              error={errors.marketAnalysis}
              placeholder="Describe the target market, demand analysis, and market potential"
              rows={4}
            />
          </div>

          <div className="lg:col-span-3">
            <TextAreaField
              label="Competitive Advantage"
              id="competitiveAdvantage"
              value={projectData.competitiveAdvantage}
              onChange={handleInputChange('competitiveAdvantage')}
              error={errors.competitiveAdvantage}
              placeholder="Describe what makes this project unique and competitive in the market"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Risk Analysis Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-red-100 rounded-lg mr-3">
            <Target className="h-5 w-5 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Risk Analysis</h2>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <TextAreaField
            label="Risk Analysis"
            id="riskAnalysis"
            value={projectData.riskAnalysis}
            onChange={handleInputChange('riskAnalysis')}
            error={errors.riskAnalysis}
            placeholder="Identify potential risks including market risks, operational risks, financial risks, etc."
            rows={4}
          />

          <TextAreaField
            label="Mitigation Measures"
            id="mitigationMeasures"
            value={projectData.mitigationMeasures}
            onChange={handleInputChange('mitigationMeasures')}
            error={errors.mitigationMeasures}
            placeholder="Describe strategies and measures to mitigate the identified risks"
            rows={4}
          />
        </div>
      </div>

      {/* Detailed Cost Breakdown Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-purple-100 rounded-lg mr-3">
            <Wrench className="h-5 w-5 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Detailed Cost of the Project</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Machinery & Equipment Cost"
            id="machineryEquipmentCost"
            type="number"
            value={projectData.machineryEquipmentCost}
            onChange={handleInputChange('machineryEquipmentCost')}
            error={errors.machineryEquipmentCost}
            placeholder="e.g., 500000"
          />
          
          <InputField
            label="Shed/Building Cost"
            id="shedBuildingCost"
            type="number"
            value={projectData.shedBuildingCost}
            onChange={handleInputChange('shedBuildingCost')}
            error={errors.shedBuildingCost}
            placeholder="e.g., 300000"
          />
          
          <InputField
            label="Land Cost"
            id="landCost"
            type="number"
            value={projectData.landCost}
            onChange={handleInputChange('landCost')}
            error={errors.landCost}
            placeholder="e.g., 200000"
          />
          
          <InputField
            label="Furniture & Fittings Cost"
            id="furnitureFittingsCost"
            type="number"
            value={projectData.furnitureFittingsCost}
            onChange={handleInputChange('furnitureFittingsCost')}
            error={errors.furnitureFittingsCost}
            placeholder="e.g., 50000"
          />
          
          <InputField
            label="Vehicle Cost"
            id="vehicleCost"
            type="number"
            value={projectData.vehicleCost}
            onChange={handleInputChange('vehicleCost')}
            error={errors.vehicleCost}
            placeholder="e.g., 400000"
          />
          
          <InputField
            label="Working Capital Cost"
            id="workingCapitalCost"
            type="number"
            value={projectData.workingCapitalCost}
            onChange={handleInputChange('workingCapitalCost')}
            error={errors.workingCapitalCost}
            placeholder="e.g., 100000"
          />
          
          <InputField
            label="Other Assets Cost"
            id="otherAssetsCost"
            type="number"
            value={projectData.otherAssetsCost}
            onChange={handleInputChange('otherAssetsCost')}
            error={errors.otherAssetsCost}
            placeholder="e.g., 25000"
          />
          
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Calculated Total Cost
            </label>
            <div className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-700 font-medium">
              {formatCurrency(calculatedTotalCost)}
            </div>
          </div>
        </div>
        
        {errors.costBreakdown && (
          <p className="text-red-500 text-xs mt-2 flex items-center">
            <span className="mr-1">⚠</span>
            {errors.costBreakdown}
          </p>
        )}
      </div>

      {/* Preliminary & Pre-operative Costs Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-orange-100 rounded-lg mr-3">
            <Settings className="h-5 w-5 text-orange-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Preliminary & Pre-operative Costs</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Project Report Cost"
            id="projectReportCost"
            type="number"
            value={projectData.projectReportCost}
            onChange={handleInputChange('projectReportCost')}
            error={errors.projectReportCost}
            placeholder="e.g., 15000"
          />
          
          <InputField
            label="Technical Know-How Cost"
            id="technicalKnowHowCost"
            type="number"
            value={projectData.technicalKnowHowCost}
            onChange={handleInputChange('technicalKnowHowCost')}
            error={errors.technicalKnowHowCost}
            placeholder="e.g., 25000"
          />
          
          <InputField
            label="Licensing & Registration Cost"
            id="licensingCost"
            type="number"
            value={projectData.licensingCost}
            onChange={handleInputChange('licensingCost')}
            error={errors.licensingCost}
            placeholder="e.g., 10000"
          />
          
          <InputField
            label="Training & Development Cost"
            id="trainingCost"
            type="number"
            value={projectData.trainingCost}
            onChange={handleInputChange('trainingCost')}
            error={errors.trainingCost}
            placeholder="e.g., 20000"
          />
          
          <InputField
            label="Interest During Construction"
            id="interestDuringConstructionCost"
            type="number"
            value={projectData.interestDuringConstructionCost}
            onChange={handleInputChange('interestDuringConstructionCost')}
            error={errors.interestDuringConstructionCost}
            placeholder="e.g., 30000"
          />
          
          <InputField
            label="Other Pre-operative Expenses"
            id="otherPreOperativeCost"
            type="number"
            value={projectData.otherPreOperativeCost}
            onChange={handleInputChange('otherPreOperativeCost')}
            error={errors.otherPreOperativeCost}
            placeholder="e.g., 15000"
          />
          
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Total Preliminary & Pre-operative Cost
            </label>
            <div className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-700 font-medium">
              {formatCurrency(preliminaryPreOperativeCost)}
            </div>
          </div>
          
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Grand Total Project Cost
            </label>
            <div className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 bg-blue-50 text-blue-700 font-bold text-lg">
              {formatCurrency(grandTotalCost)}
            </div>
          </div>
        </div>
      </div>

      {/* Financial Inputs Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-green-100 rounded-lg mr-3">
            <DollarSign className="h-5 w-5 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Financial Inputs</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Total Project Cost (Auto-calculated)
            </label>
            <div className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-700 font-medium">
              {formatCurrency(grandTotalCost)}
            </div>
          </div>
          
          <InputField
            label="Promoter's Contribution"
            id="promotersContribution"
            type="number"
            value={projectData.promotersContribution}
            onChange={handleInputChange('promotersContribution')}
            error={errors.promotersContribution || errors.promoterSubsidyExceed}
            placeholder="e.g., 76232"
            required
          />
          
          <InputField
            label="Subsidy"
            id="subsidy"
            type="number"
            value={projectData.subsidy}
            onChange={handleInputChange('subsidy')}
            error={errors.subsidy || errors.promoterSubsidyExceed}
            placeholder="e.g., 434519"
          />
          
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Bank Loan Amount
            </label>
            <div className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-700 font-medium">
              {formatCurrency(loanAmount)}
            </div>
          </div>
        </div>
      </div>

      {/* Loan Details Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-purple-100 rounded-lg mr-3">
            <Calendar className="h-5 w-5 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Loan Details</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Rate of Interest (% Annual)"
            id="rateOfInterest"
            type="number"
            value={projectData.rateOfInterest}
            onChange={handleInputChange('rateOfInterest')}
            error={errors.rateOfInterest}
            placeholder="e.g., 12"
            min="0"
            required
          />
          
          <InputField
            label="Loan Tenure (Years)"
            id="loanTenureYears"
            type="number"
            value={projectData.loanTenureYears}
            onChange={handleInputChange('loanTenureYears')}
            error={errors.loanTenureYears}
            placeholder="e.g., 7"
            min="0"
            required
          />
          
          <InputField
            label="Moratorium Period (Months)"
            id="moratoriumPeriodMonths"
            type="number"
            value={projectData.moratoriumPeriodMonths}
            onChange={handleInputChange('moratoriumPeriodMonths')}
            error={errors.moratoriumPeriodMonths}
            placeholder="e.g., 0"
            min="0"
          />
          
          <InputField
            label="Depreciation Rate (% Annual on WDV)"
            id="depreciationRate"
            type="number"
            value={projectData.depreciationRate}
            onChange={handleInputChange('depreciationRate')}
            error={errors.depreciationRate}
            placeholder="e.g., 10"
            min="0"
            required
          />
        </div>
      </div>

      {/* Projections Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-orange-100 rounded-lg mr-3">
            <BarChart3 className="h-5 w-5 text-orange-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Financial Projections</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Projected Annual Revenue (Year 1)"
            id="projectedAnnualRevenue"
            type="number"
            value={projectData.projectedAnnualRevenue}
            onChange={handleInputChange('projectedAnnualRevenue')}
            error={errors.projectedAnnualRevenue}
            placeholder="e.g., 1200000"
            required
          />
          
          <InputField
            label="Projected Annual Expenses (Year 1)"
            id="projectedAnnualExpenses"
            type="number"
            value={projectData.projectedAnnualExpenses}
            onChange={handleInputChange('projectedAnnualExpenses')}
            error={errors.projectedAnnualExpenses}
            placeholder="e.g., 826000"
            required
          />
          
          <InputField
            label="Annual Revenue Growth Rate (%)"
            id="revenueGrowthRate"
            type="number"
            value={projectData.revenueGrowthRate}
            onChange={handleInputChange('revenueGrowthRate')}
            error={errors.revenueGrowthRate}
            placeholder="e.g., 10"
            min="0"
            required
          />
          
          <InputField
            label="Annual Expense Growth Rate (%)"
            id="expenseGrowthRate"
            type="number"
            value={projectData.expenseGrowthRate}
            onChange={handleInputChange('expenseGrowthRate')}
            error={errors.expenseGrowthRate}
            placeholder="e.g., 11.4"
            min="0"
            required
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onExportCSV}
            className="flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
          
          <label className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 cursor-pointer">
            <Upload className="h-4 w-4 mr-2" />
            {isImporting ? 'Importing...' : 'Import CSV'}
            <input
              type="file"
              accept=".csv"
              onChange={onImportCSV}
              disabled={isImporting}
              className="hidden"
            />
          </label>
        </div>
        
        <button
          type="button"
          onClick={onLoadSampleData}
          className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Load Sample Data
        </button>
        
        <button
          type="button"
          onClick={onReset}
          className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl shadow-md transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
        >
          Reset Form
        </button>
        
        <button
          type="submit"
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Generate Report
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;