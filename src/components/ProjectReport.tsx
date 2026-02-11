import React from 'react';
import { ProjectData, CalculatedResults } from '../types';
import { formatCurrency, formatPercentage } from '../utils/formatting';
import { generatePDFReport } from '../utils/pdfGenerator';
import { 
  FileText, 
  User, 
  MapPin, 
  Building, 
  DollarSign, 
  TrendingUp,
  PieChart,
  BarChart3,
  Calculator,
  Target,
  AlertTriangle,
  CheckCircle,
  Download
} from 'lucide-react';

interface ProjectReportProps {
  projectData: ProjectData;
  calculatedResults: CalculatedResults | null;
}

export const ProjectReport: React.FC<ProjectReportProps> = ({
  projectData,
  calculatedResults
}) => {
  if (!calculatedResults) {
    return <div>Loading calculations...</div>;
  }

  const {
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
    projectViability
  } = calculatedResults;

  const grandTotalCost = parseFloat(projectData.totalProjectCost || '0');

  const handleDownloadPDF = async () => {
    try {
      await generatePDFReport(projectData, calculatedResults);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Report Header */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
        <div className="text-center">
          <div className="flex justify-end mb-4">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              <Download className="h-5 w-5 mr-2" />
              Download PDF Report
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            PROJECT REPORT
          </h1>
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">
            {projectData.projectName}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Beneficiary</p>
              <p className="font-semibold text-gray-800">{projectData.beneficiaryName}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Location</p>
              <p className="font-semibold text-gray-800">{projectData.location}, {projectData.district}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Project Cost</p>
              <p className="font-semibold text-blue-600 text-lg">{formatCurrency(grandTotalCost)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-green-100 rounded-lg mr-3">
            <Target className="h-5 w-5 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Executive Summary</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-blue-50 p-4 rounded-xl">
            <h3 className="font-semibold text-blue-800 mb-2">Project Investment</h3>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(grandTotalCost)}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-xl">
            <h3 className="font-semibold text-green-800 mb-2">Bank Loan</h3>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(loanAmount)}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl">
            <h3 className="font-semibold text-purple-800 mb-2">Monthly EMI</h3>
            <p className="text-2xl font-bold text-purple-600">{formatCurrency(emi)}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-xl">
            <h3 className="font-semibold text-orange-800 mb-2">Average DSCR</h3>
            <p className="text-2xl font-bold text-orange-600">{dscrCalculation.average.toFixed(2)}</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <h3 className="font-semibold text-gray-800 mb-2">Project Viability Indicators</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Net Present Value (NPV)</p>
              <p className="font-semibold text-gray-800">{formatCurrency(projectViability.npv)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Internal Rate of Return (IRR)</p>
              <p className="font-semibold text-gray-800">{formatPercentage(projectViability.irr)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Payback Period</p>
              <p className="font-semibold text-gray-800">{projectViability.paybackPeriod} years</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Profitability Index</p>
              <p className="font-semibold text-gray-800">{projectViability.profitabilityIndex.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-blue-100 rounded-lg mr-3">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Beneficiary Information</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600">Name</p>
            <p className="font-semibold text-gray-800">{projectData.beneficiaryName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Father's Name</p>
            <p className="font-semibold text-gray-800">{projectData.fatherName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Age</p>
            <p className="font-semibold text-gray-800">{projectData.age}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Gender</p>
            <p className="font-semibold text-gray-800">{projectData.gender}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Education</p>
            <p className="font-semibold text-gray-800">{projectData.educationalQualification}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Experience</p>
            <p className="font-semibold text-gray-800">{projectData.experience}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Mobile Number</p>
            <p className="font-semibold text-gray-800">{projectData.mobileNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Annual Income</p>
            <p className="font-semibold text-gray-800">{formatCurrency(parseFloat(projectData.annualIncome || '0'))}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Family Members</p>
            <p className="font-semibold text-gray-800">{projectData.familyMembers}</p>
          </div>
        </div>
        
        <div className="mt-6">
          <p className="text-sm text-gray-600 mb-2">Address</p>
          <p className="font-semibold text-gray-800">{projectData.address}</p>
        </div>
        
        <div className="mt-6">
          <p className="text-sm text-gray-600 mb-2">About the Beneficiary</p>
          <p className="text-gray-800">{projectData.aboutBeneficiary}</p>
        </div>
      </div>

      {/* Project Details */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-orange-100 rounded-lg mr-3">
            <Building className="h-5 w-5 text-orange-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Project Details</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600">Project Name</p>
            <p className="font-semibold text-gray-800">{projectData.projectName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Category</p>
            <p className="font-semibold text-gray-800">{projectData.category}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Capacity</p>
            <p className="font-semibold text-gray-800">{projectData.capacity}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Implementation Period</p>
            <p className="font-semibold text-gray-800">{projectData.projectImplementationPeriod}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Power Requirement</p>
            <p className="font-semibold text-gray-800">{projectData.powerRequirement}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Location</p>
            <p className="font-semibold text-gray-800">{projectData.location}, {projectData.district}, {projectData.state}</p>
          </div>
        </div>
        
        {projectData.projectObjective && (
          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-2">Project Objective</p>
            <p className="text-gray-800">{projectData.projectObjective}</p>
          </div>
        )}
        
        {projectData.marketAnalysis && (
          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-2">Market Analysis</p>
            <p className="text-gray-800">{projectData.marketAnalysis}</p>
          </div>
        )}
      </div>

      {/* Cost Breakdown */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-purple-100 rounded-lg mr-3">
            <PieChart className="h-5 w-5 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Cost Breakdown</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Cost Components */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Main Cost Components</h3>
            <div className="space-y-3">
              {costBreakdown.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">{item.category}</span>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{formatCurrency(item.amount)}</p>
                    <p className="text-sm text-gray-600">{item.percentage.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Preliminary Costs */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Preliminary & Pre-operative Costs</h3>
            <div className="space-y-3">
              {preliminaryPreOperativeCosts.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">{item.category}</span>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{formatCurrency(item.amount)}</p>
                    <p className="text-sm text-gray-600">{item.percentage.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="font-semibold text-blue-800">Total Preliminary Cost</span>
                  <span className="font-bold text-blue-600">{formatCurrency(totalPreliminaryPreOperativeCost)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-800">Grand Total Project Cost</span>
            <span className="text-2xl font-bold text-blue-600">{formatCurrency(grandTotalCost)}</span>
          </div>
        </div>
      </div>

      {/* Financial Structure */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-green-100 rounded-lg mr-3">
            <DollarSign className="h-5 w-5 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Financial Structure</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-blue-50 p-4 rounded-xl">
            <h3 className="font-semibold text-blue-800 mb-2">Total Project Cost</h3>
            <p className="text-xl font-bold text-blue-600">{formatCurrency(grandTotalCost)}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-xl">
            <h3 className="font-semibold text-green-800 mb-2">Promoter's Contribution</h3>
            <p className="text-xl font-bold text-green-600">{formatCurrency(parseFloat(projectData.promotersContribution || '0'))}</p>
            <p className="text-sm text-green-700">
              {((parseFloat(projectData.promotersContribution || '0') / grandTotalCost) * 100).toFixed(1)}%
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl">
            <h3 className="font-semibold text-purple-800 mb-2">Subsidy</h3>
            <p className="text-xl font-bold text-purple-600">{formatCurrency(parseFloat(projectData.subsidy || '0'))}</p>
            <p className="text-sm text-purple-700">
              {((parseFloat(projectData.subsidy || '0') / grandTotalCost) * 100).toFixed(1)}%
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded-xl">
            <h3 className="font-semibold text-orange-800 mb-2">Bank Loan</h3>
            <p className="text-xl font-bold text-orange-600">{formatCurrency(loanAmount)}</p>
            <p className="text-sm text-orange-700">
              {((loanAmount / grandTotalCost) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="font-semibold text-gray-800 mb-2">Interest Rate</h3>
            <p className="text-xl font-bold text-gray-600">{projectData.rateOfInterest}% per annum</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="font-semibold text-gray-800 mb-2">Loan Tenure</h3>
            <p className="text-xl font-bold text-gray-600">{projectData.loanTenureYears} years</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="font-semibold text-gray-800 mb-2">Monthly EMI</h3>
            <p className="text-xl font-bold text-gray-600">{formatCurrency(emi)}</p>
          </div>
        </div>
      </div>

      {/* Financial Projections */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-indigo-100 rounded-lg mr-3">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Financial Projections</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-800">Year</th>
                <th className="border border-gray-300 px-4 py-2 text-right font-semibold text-gray-800">Revenue</th>
                <th className="border border-gray-300 px-4 py-2 text-right font-semibold text-gray-800">Expenses</th>
                <th className="border border-gray-300 px-4 py-2 text-right font-semibold text-gray-800">EBITDA</th>
                <th className="border border-gray-300 px-4 py-2 text-right font-semibold text-gray-800">Interest</th>
                <th className="border border-gray-300 px-4 py-2 text-right font-semibold text-gray-800">Depreciation</th>
                <th className="border border-gray-300 px-4 py-2 text-right font-semibold text-gray-800">Net Profit</th>
              </tr>
            </thead>
            <tbody>
              {profitabilityStatement.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-300 px-4 py-2 font-medium">{item.year}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(item.income)}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(item.totalExpenses)}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(item.netIncomeBeforeID)}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(item.interest)}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(item.depreciation)}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right font-semibold">
                    {formatCurrency(item.netProfitBeforeTax)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DSCR Analysis */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-red-100 rounded-lg mr-3">
            <BarChart3 className="h-5 w-5 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Debt Service Coverage Ratio (DSCR)</h2>
        </div>
        
        <div className="mb-4 p-4 bg-blue-50 rounded-xl">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-blue-800">Average DSCR</span>
            <span className="text-2xl font-bold text-blue-600">{dscrCalculation.average.toFixed(2)}</span>
          </div>
          <p className="text-sm text-blue-700 mt-2">
            {dscrCalculation.average >= 1.25 ? 
              "✓ Excellent - DSCR above 1.25 indicates strong repayment capacity" :
              dscrCalculation.average >= 1.0 ?
              "⚠ Adequate - DSCR above 1.0 but monitor closely" :
              "⚠ Risk - DSCR below 1.0 indicates potential repayment issues"
            }
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-800">Year</th>
                <th className="border border-gray-300 px-4 py-2 text-right font-semibold text-gray-800">Net Cash Accrual</th>
                <th className="border border-gray-300 px-4 py-2 text-right font-semibold text-gray-800">Debt Obligation</th>
                <th className="border border-gray-300 px-4 py-2 text-right font-semibold text-gray-800">DSCR</th>
              </tr>
            </thead>
            <tbody>
              {dscrCalculation.data.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-300 px-4 py-2 font-medium">{item.year}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(item.netCashAccrual)}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(item.debtObligation)}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right font-semibold">
                    <span className={item.dscr >= 1.25 ? 'text-green-600' : item.dscr >= 1.0 ? 'text-yellow-600' : 'text-red-600'}>
                      {item.dscr.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Risk Analysis */}
      {(projectData.riskAnalysis || projectData.mitigationMeasures) && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-red-100 rounded-lg mr-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Risk Analysis</h2>
          </div>
          
          {projectData.riskAnalysis && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Identified Risks</h3>
              <p className="text-gray-700">{projectData.riskAnalysis}</p>
            </div>
          )}
          
          {projectData.mitigationMeasures && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Mitigation Measures</h3>
              <p className="text-gray-700">{projectData.mitigationMeasures}</p>
            </div>
          )}
        </div>
      )}

      {/* Conclusion */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-green-100 rounded-lg mr-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Project Viability Conclusion</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Financial Indicators</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Net Present Value (NPV):</span>
                <span className={projectViability.npv > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                  {formatCurrency(projectViability.npv)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Internal Rate of Return (IRR):</span>
                <span className="font-semibold">{formatPercentage(projectViability.irr)}</span>
              </div>
              <div className="flex justify-between">
                <span>Payback Period:</span>
                <span className="font-semibold">{projectViability.paybackPeriod} years</span>
              </div>
              <div className="flex justify-between">
                <span>Average DSCR:</span>
                <span className={dscrCalculation.average >= 1.25 ? 'text-green-600 font-semibold' : 'text-yellow-600 font-semibold'}>
                  {dscrCalculation.average.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Recommendation</h3>
            <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-blue-50">
              <p className="text-gray-800">
                {projectViability.npv > 0 && dscrCalculation.average >= 1.25 ? 
                  "✓ The project shows strong financial viability with positive NPV and healthy DSCR. Recommended for approval." :
                  projectViability.npv > 0 && dscrCalculation.average >= 1.0 ?
                  "⚠ The project is viable but requires careful monitoring. Consider additional security measures." :
                  "⚠ The project requires detailed review and risk mitigation before approval."
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};