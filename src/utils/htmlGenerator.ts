import { ProjectData, CalculatedResults } from '../types';

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(2)}%`;
};

export const generateHTMLReport = (
  projectData: ProjectData,
  calculatedResults: CalculatedResults
): void => {
  const grandTotalCost = parseFloat(projectData.totalProjectCost || '0');

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectData.projectName} - Project Report</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 20px;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      border-radius: 16px;
      overflow: hidden;
    }

    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 60px 40px;
      text-align: center;
    }

    .header h1 {
      font-family: 'Playfair Display', serif;
      font-size: 48px;
      font-weight: 700;
      margin-bottom: 10px;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    }

    .header h2 {
      font-size: 32px;
      font-weight: 300;
      margin-bottom: 30px;
      opacity: 0.95;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-top: 30px;
    }

    .summary-card {
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      padding: 20px;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .summary-card h3 {
      font-size: 14px;
      font-weight: 400;
      opacity: 0.9;
      margin-bottom: 8px;
    }

    .summary-card p {
      font-size: 24px;
      font-weight: 700;
    }

    .content {
      padding: 40px;
    }

    .section {
      margin-bottom: 50px;
      page-break-inside: avoid;
    }

    .section-header {
      display: flex;
      align-items: center;
      margin-bottom: 30px;
      padding-bottom: 15px;
      border-bottom: 3px solid #667eea;
    }

    .section-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 15px;
      color: white;
      font-size: 20px;
      font-weight: 700;
    }

    .section-title {
      font-family: 'Playfair Display', serif;
      font-size: 28px;
      font-weight: 700;
      color: #1f2937;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 25px;
      margin-bottom: 25px;
    }

    .info-item {
      background: #f9fafb;
      padding: 20px;
      border-radius: 10px;
      border-left: 4px solid #667eea;
    }

    .info-label {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      color: #6b7280;
      margin-bottom: 8px;
      letter-spacing: 0.5px;
    }

    .info-value {
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
    }

    .metric-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .metric-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 25px;
      border-radius: 12px;
      color: white;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .metric-card h3 {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 10px;
      opacity: 0.9;
    }

    .metric-card p {
      font-size: 28px;
      font-weight: 700;
    }

    .metric-card small {
      font-size: 14px;
      opacity: 0.85;
      display: block;
      margin-top: 5px;
    }

    .table-wrapper {
      width: 100%;
      overflow-x: auto;
      margin: 20px 0;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      min-width: 600px;
    }

    thead {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    th {
      padding: 14px 10px;
      text-align: left;
      font-weight: 600;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      white-space: nowrap;
    }

    td {
      padding: 14px 10px;
      border-bottom: 1px solid #e5e7eb;
      font-size: 14px;
    }

    tbody tr:hover {
      background: #f9fafb;
    }

    tbody tr:last-child td {
      border-bottom: none;
    }

    .text-right {
      text-align: right;
    }

    .text-center {
      text-align: center;
    }

    .highlight-box {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border-left: 4px solid #0ea5e9;
      padding: 25px;
      border-radius: 8px;
      margin: 25px 0;
    }

    .highlight-box h3 {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 15px;
      color: #0c4a6e;
    }

    .highlight-box p {
      font-size: 16px;
      color: #0c4a6e;
      line-height: 1.8;
    }

    .viability-badge {
      display: inline-block;
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: 600;
      font-size: 14px;
      margin-top: 10px;
    }

    .badge-success {
      background: #dcfce7;
      color: #166534;
    }

    .badge-warning {
      background: #fef3c7;
      color: #92400e;
    }

    .badge-danger {
      background: #fee2e2;
      color: #991b1b;
    }

    .conclusion-box {
      background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
      border-left: 4px solid #16a34a;
      padding: 30px;
      border-radius: 12px;
      margin: 30px 0;
    }

    .conclusion-box h3 {
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 15px;
      color: #14532d;
    }

    .conclusion-box p {
      font-size: 16px;
      color: #14532d;
      line-height: 1.8;
    }

    .footer {
      background: #f9fafb;
      padding: 30px 40px;
      text-align: center;
      border-top: 3px solid #667eea;
    }

    .footer p {
      color: #6b7280;
      font-size: 14px;
    }

    @media print {
      body {
        background: white;
        padding: 0;
      }

      .container {
        box-shadow: none;
        border-radius: 0;
      }

      .section {
        page-break-inside: avoid;
      }

      table {
        font-size: 10px;
        min-width: auto;
      }

      th {
        padding: 8px 6px;
        font-size: 10px;
      }

      td {
        padding: 8px 6px;
        font-size: 10px;
      }

      .table-wrapper {
        overflow-x: visible;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>PROJECT REPORT</h1>
      <h2>${projectData.projectName}</h2>
      <div class="summary-grid">
        <div class="summary-card">
          <h3>Beneficiary</h3>
          <p>${projectData.beneficiaryName}</p>
        </div>
        <div class="summary-card">
          <h3>Location</h3>
          <p>${projectData.location}, ${projectData.district}</p>
        </div>
        <div class="summary-card">
          <h3>Total Project Cost</h3>
          <p>${formatCurrency(grandTotalCost)}</p>
        </div>
        <div class="summary-card">
          <h3>Average DSCR</h3>
          <p>${calculatedResults.dscrCalculation.average.toFixed(2)}</p>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="section">
        <div class="section-header">
          <div class="section-icon">📊</div>
          <h2 class="section-title">Executive Summary</h2>
        </div>
        <div class="metric-cards">
          <div class="metric-card">
            <h3>Project Investment</h3>
            <p>${formatCurrency(grandTotalCost)}</p>
          </div>
          <div class="metric-card">
            <h3>Bank Loan</h3>
            <p>${formatCurrency(calculatedResults.loanAmount)}</p>
            <small>${((calculatedResults.loanAmount / grandTotalCost) * 100).toFixed(1)}% of total</small>
          </div>
          <div class="metric-card">
            <h3>Monthly EMI</h3>
            <p>${formatCurrency(calculatedResults.emi)}</p>
          </div>
          <div class="metric-card">
            <h3>Net Present Value</h3>
            <p>${formatCurrency(calculatedResults.projectViability.npv)}</p>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <div class="section-icon">👤</div>
          <h2 class="section-title">Beneficiary Information</h2>
        </div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Name</div>
            <div class="info-value">${projectData.beneficiaryName}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Father's Name</div>
            <div class="info-value">${projectData.fatherName}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Age</div>
            <div class="info-value">${projectData.age || 'N/A'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Gender</div>
            <div class="info-value">${projectData.gender || 'N/A'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Education</div>
            <div class="info-value">${projectData.educationalQualification || 'N/A'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Experience</div>
            <div class="info-value">${projectData.experience || 'N/A'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Mobile Number</div>
            <div class="info-value">${projectData.mobileNumber}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Annual Income</div>
            <div class="info-value">${formatCurrency(parseFloat(projectData.annualIncome || '0'))}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Family Members</div>
            <div class="info-value">${projectData.familyMembers || 'N/A'}</div>
          </div>
        </div>
        <div class="highlight-box">
          <h3>About the Beneficiary</h3>
          <p>${projectData.aboutBeneficiary}</p>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <div class="section-icon">🏢</div>
          <h2 class="section-title">Project Details</h2>
        </div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Project Name</div>
            <div class="info-value">${projectData.projectName}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Category</div>
            <div class="info-value">${projectData.category || 'N/A'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Capacity</div>
            <div class="info-value">${projectData.capacity || 'N/A'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Implementation Period</div>
            <div class="info-value">${projectData.projectImplementationPeriod}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Power Requirement</div>
            <div class="info-value">${projectData.powerRequirement || 'N/A'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Location</div>
            <div class="info-value">${projectData.location},<br/>${projectData.district}, ${projectData.state}</div>
          </div>
        </div>
        ${projectData.projectObjective ? `
        <div class="highlight-box">
          <h3>Project Objective</h3>
          <p>${projectData.projectObjective}</p>
        </div>` : ''}
        ${projectData.marketAnalysis ? `
        <div class="highlight-box">
          <h3>Market Analysis</h3>
          <p>${projectData.marketAnalysis}</p>
        </div>` : ''}
      </div>

      <div class="section">
        <div class="section-header">
          <div class="section-icon">💰</div>
          <h2 class="section-title">Financial Structure</h2>
        </div>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Component</th>
                <th class="text-right">Amount</th>
                <th class="text-right">Percentage</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Total Project Cost</td>
                <td class="text-right">${formatCurrency(grandTotalCost)}</td>
                <td class="text-right">100.0%</td>
              </tr>
              <tr>
                <td>Promoter's Contribution</td>
                <td class="text-right">${formatCurrency(parseFloat(projectData.promotersContribution || '0'))}</td>
                <td class="text-right">${((parseFloat(projectData.promotersContribution || '0') / grandTotalCost) * 100).toFixed(1)}%</td>
              </tr>
              <tr>
                <td>Subsidy</td>
                <td class="text-right">${formatCurrency(parseFloat(projectData.subsidy || '0'))}</td>
                <td class="text-right">${((parseFloat(projectData.subsidy || '0') / grandTotalCost) * 100).toFixed(1)}%</td>
              </tr>
              <tr>
                <td>Bank Loan</td>
                <td class="text-right">${formatCurrency(calculatedResults.loanAmount)}</td>
                <td class="text-right">${((calculatedResults.loanAmount / grandTotalCost) * 100).toFixed(1)}%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Interest Rate</div>
            <div class="info-value">${projectData.rateOfInterest}% per annum</div>
          </div>
          <div class="info-item">
            <div class="info-label">Loan Tenure</div>
            <div class="info-value">${projectData.loanTenureYears} years</div>
          </div>
          <div class="info-item">
            <div class="info-label">Monthly EMI</div>
            <div class="info-value">${formatCurrency(calculatedResults.emi)}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <div class="section-icon">📈</div>
          <h2 class="section-title">Cost Breakdown</h2>
        </div>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th class="text-right">Amount</th>
                <th class="text-right">Percentage</th>
              </tr>
            </thead>
            <tbody>
              ${calculatedResults.costBreakdown.map(item => `
              <tr>
                <td>${item.category}</td>
                <td class="text-right">${formatCurrency(item.amount)}</td>
                <td class="text-right">${item.percentage.toFixed(1)}%</td>
              </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <div class="section-icon">🏦</div>
          <h2 class="section-title">Loan Repayment Schedule</h2>
        </div>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Year</th>
                <th class="text-right">Opening Balance</th>
                <th class="text-right">Principal Payment</th>
                <th class="text-right">Interest Payment</th>
                <th class="text-right">Total EMI</th>
                <th class="text-right">Closing Balance</th>
              </tr>
            </thead>
            <tbody>
              ${calculatedResults.loanRepaymentSchedule.map((item, index, array) => {
                const totalEMI = item.principal + item.interest;
                const closingBalance = item.outstandingPrincipalStart - item.principal;
                return `
              <tr>
                <td>Year ${item.year}</td>
                <td class="text-right">${formatCurrency(item.outstandingPrincipalStart)}</td>
                <td class="text-right">${formatCurrency(item.principal)}</td>
                <td class="text-right">${formatCurrency(item.interest)}</td>
                <td class="text-right">${formatCurrency(totalEMI)}</td>
                <td class="text-right">${formatCurrency(closingBalance)}</td>
              </tr>
              `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <div class="section-icon">📊</div>
          <h2 class="section-title">Profitability Statement (7 Years)</h2>
        </div>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Year</th>
                <th class="text-right">Revenue</th>
                <th class="text-right">Expenses</th>
                <th class="text-right">EBITDA</th>
                <th class="text-right">Interest</th>
                <th class="text-right">Depreciation</th>
                <th class="text-right">Net Profit</th>
              </tr>
            </thead>
            <tbody>
              ${calculatedResults.profitabilityStatement.slice(0, 7).map(item => `
              <tr>
                <td>Year ${item.year}</td>
                <td class="text-right">${formatCurrency(item.income)}</td>
                <td class="text-right">${formatCurrency(item.totalExpenses)}</td>
                <td class="text-right">${formatCurrency(item.netIncomeBeforeID)}</td>
                <td class="text-right">${formatCurrency(item.interest)}</td>
                <td class="text-right">${formatCurrency(item.depreciation)}</td>
                <td class="text-right">${formatCurrency(item.netProfitBeforeTax)}</td>
              </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <div class="section-icon">💵</div>
          <h2 class="section-title">Cash Flow Statement (7 Years)</h2>
        </div>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Year</th>
                <th class="text-right">Net Profit</th>
                <th class="text-right">Add: Depreciation</th>
                <th class="text-right">Add: Interest</th>
                <th class="text-right">Net Cash Accruals</th>
              </tr>
            </thead>
            <tbody>
              ${calculatedResults.cashFlowStatement.slice(0, 7).map(item => `
              <tr>
                <td>Year ${item.year}</td>
                <td class="text-right">${formatCurrency(item.netProfit)}</td>
                <td class="text-right">${formatCurrency(item.addDepreciation)}</td>
                <td class="text-right">${formatCurrency(item.addInterest)}</td>
                <td class="text-right">${formatCurrency(item.netCashAccruals)}</td>
              </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <div class="section-icon">📉</div>
          <h2 class="section-title">Debt Service Coverage Ratio (DSCR)</h2>
        </div>
        <div class="highlight-box">
          <h3>Average DSCR: ${calculatedResults.dscrCalculation.average.toFixed(2)}</h3>
          <p>
            ${calculatedResults.dscrCalculation.average >= 1.25 ?
              '✓ Excellent - DSCR above 1.25 indicates strong repayment capacity' :
              calculatedResults.dscrCalculation.average >= 1.0 ?
              '⚠ Adequate - DSCR above 1.0 but monitor closely' :
              '⚠ Risk - DSCR below 1.0 indicates potential repayment issues'
            }
          </p>
        </div>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Year</th>
                <th class="text-right">Net Cash Accrual</th>
                <th class="text-right">Debt Obligation</th>
                <th class="text-right">DSCR</th>
              </tr>
            </thead>
            <tbody>
              ${calculatedResults.dscrCalculation.data.map(item => `
              <tr>
                <td>Year ${item.year}</td>
                <td class="text-right">${formatCurrency(item.netCashAccrual)}</td>
                <td class="text-right">${formatCurrency(item.debtObligation)}</td>
                <td class="text-right">${item.dscr.toFixed(2)}</td>
              </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <div class="section-icon">🎯</div>
          <h2 class="section-title">Project Viability</h2>
        </div>
        <div class="metric-cards">
          <div class="metric-card">
            <h3>Net Present Value (NPV)</h3>
            <p>${formatCurrency(calculatedResults.projectViability.npv)}</p>
          </div>
          <div class="metric-card">
            <h3>Internal Rate of Return (IRR)</h3>
            <p>${formatPercentage(calculatedResults.projectViability.irr)}</p>
          </div>
          <div class="metric-card">
            <h3>Payback Period</h3>
            <p>${calculatedResults.projectViability.paybackPeriod} years</p>
          </div>
          <div class="metric-card">
            <h3>Profitability Index</h3>
            <p>${calculatedResults.projectViability.profitabilityIndex.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <div class="section-icon">✅</div>
          <h2 class="section-title">Conclusion</h2>
        </div>
        <div class="conclusion-box">
          <h3>Project Viability Assessment</h3>
          <p>
            ${calculatedResults.projectViability.npv > 0 && calculatedResults.dscrCalculation.average >= 1.25 ?
              'The project shows strong financial viability with positive NPV and healthy DSCR. Recommended for approval.' :
              calculatedResults.projectViability.npv > 0 && calculatedResults.dscrCalculation.average >= 1.0 ?
              'The project is viable but requires careful monitoring. Consider additional security measures.' :
              'The project requires detailed review and risk mitigation before approval.'
            }
          </p>
          <span class="viability-badge ${calculatedResults.projectViability.npv > 0 && calculatedResults.dscrCalculation.average >= 1.25 ? 'badge-success' : calculatedResults.projectViability.npv > 0 ? 'badge-warning' : 'badge-danger'}">
            ${calculatedResults.projectViability.npv > 0 && calculatedResults.dscrCalculation.average >= 1.25 ? 'RECOMMENDED' : calculatedResults.projectViability.npv > 0 ? 'MONITOR CLOSELY' : 'REQUIRES REVIEW'}
          </span>
        </div>
      </div>

      ${projectData.riskAnalysis || projectData.mitigationMeasures ? `
      <div class="section">
        <div class="section-header">
          <div class="section-icon">⚠️</div>
          <h2 class="section-title">Risk Analysis</h2>
        </div>
        ${projectData.riskAnalysis ? `
        <div class="highlight-box">
          <h3>Identified Risks</h3>
          <p>${projectData.riskAnalysis}</p>
        </div>` : ''}
        ${projectData.mitigationMeasures ? `
        <div class="highlight-box">
          <h3>Mitigation Measures</h3>
          <p>${projectData.mitigationMeasures}</p>
        </div>` : ''}
      </div>` : ''}
    </div>

    <div class="footer">
      <p>Generated on: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${projectData.projectName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_project_report.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
