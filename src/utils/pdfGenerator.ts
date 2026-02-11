import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ProjectData, CalculatedResults } from '../types';

// Helper function to format currency without symbol
const formatCurrencyNumber = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Helper function to generate monthly repayment schedule
const generateMonthlyRepaymentSchedule = (
  loanAmount: number,
  rateOfInterest: string,
  loanTenureYears: string,
  emi: number
) => {
  const schedule = [];
  let outstandingPrincipal = loanAmount;
  const monthlyRate = parseFloat(rateOfInterest || '0') / 12 / 100;
  const totalMonths = parseInt(loanTenureYears || '0') * 12;

  for (let month = 1; month <= totalMonths && outstandingPrincipal > 0; month++) {
    const interestComponent = outstandingPrincipal * monthlyRate;
    let principalComponent = emi - interestComponent;

    if (principalComponent > outstandingPrincipal) {
      principalComponent = outstandingPrincipal;
    }

    const year = Math.ceil(month / 12);
    const monthInYear = ((month - 1) % 12) + 1;

    schedule.push({
      month,
      year,
      monthInYear,
      outstandingPrincipalStart: outstandingPrincipal,
      principal: principalComponent,
      interest: interestComponent,
      emi: principalComponent + interestComponent,
      outstandingPrincipalEnd: outstandingPrincipal - principalComponent
    });

    outstandingPrincipal -= principalComponent;
  }

  return schedule;
};

export const generatePDFReport = async (
  projectData: ProjectData,
  calculatedResults: CalculatedResults
): Promise<void> => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    // Helper function to add new page if needed
    const checkPageBreak = (requiredHeight: number) => {
      if (yPosition + requiredHeight > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
    };

    // Helper function to add text with word wrap
    const addText = (text: string, x: number, y: number, options: any = {}) => {
      const lines = pdf.splitTextToSize(text, options.maxWidth || pageWidth - 2 * margin);
      pdf.text(lines, x, y);
      return lines.length * (options.lineHeight || 7);
    };

    // Helper function to add section heading (ensures heading stays on same page as content)
    const addSectionHeading = (title: string, requiredContentHeight: number = 50) => {
      checkPageBreak(requiredContentHeight);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(title, margin, yPosition);
      yPosition += 20; // Increased line spacing
    };

    // Title Page
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PROJECT REPORT', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;

    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'normal');
    pdf.text(projectData.projectName, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 25;

    // Project Summary Box - One line format
    pdf.setDrawColor(0, 123, 255);
    pdf.setFillColor(240, 248, 255);
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 50, 'FD');
    
    yPosition += 12;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PROJECT SUMMARY', margin + 5, yPosition);
    yPosition += 10;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    
    // Single line format for project summary
    const summaryLine1 = `Beneficiary: ${projectData.beneficiaryName} | Location: ${projectData.location}, ${projectData.district}`;
    const summaryLine2 = `Total Cost: Rs. ${formatCurrencyNumber(parseFloat(projectData.totalProjectCost || '0'))} | Bank Loan: Rs. ${formatCurrencyNumber(calculatedResults.loanAmount)}`;
    const summaryLine3 = `Monthly EMI: Rs. ${formatCurrencyNumber(calculatedResults.emi)} | Average DSCR: ${calculatedResults.dscrCalculation.average.toFixed(2)}`;

    pdf.text(summaryLine1, margin + 5, yPosition);
    yPosition += 8;
    pdf.text(summaryLine2, margin + 5, yPosition);
    yPosition += 8;
    pdf.text(summaryLine3, margin + 5, yPosition);
    yPosition += 25;

    // 1. BENEFICIARY INFORMATION
    addSectionHeading('1. BENEFICIARY INFORMATION', 80);

    // Personal Information Table
    const personalInfoData = [
      ['Name', projectData.beneficiaryName],
      ['Father\'s Name', projectData.fatherName],
      ['Address', projectData.address],
      ['Age', projectData.age || 'N/A'],
      ['Gender', projectData.gender || 'N/A'],
      ['Education', projectData.educationalQualification || 'N/A'],
      ['Experience', projectData.experience || 'N/A'],
      ['Mobile', projectData.mobileNumber],
      ['Annual Income', `Rs. ${formatCurrencyNumber(parseFloat(projectData.annualIncome || '0'))}`],
      ['Family Members', projectData.familyMembers || 'N/A'],
      ['Caste', projectData.caste || 'N/A']
    ];

    autoTable(pdf, {
      startY: yPosition,
      head: [['Field', 'Details']],
      body: personalInfoData,
      theme: 'grid',
      headStyles: { fillColor: [66, 139, 202] },
      margin: { left: margin, right: margin },
      styles: { fontSize: 10, cellPadding: 4 },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 'auto', overflow: 'linebreak' }
      }
    });

    yPosition = (pdf as any).lastAutoTable.finalY + 15;

    // About Beneficiary
    checkPageBreak(30);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('About the Beneficiary:', margin, yPosition);
    yPosition += 8;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    yPosition += addText(projectData.aboutBeneficiary, margin, yPosition, { maxWidth: pageWidth - 2 * margin });
    yPosition += 20;

    // 2. PROJECT DETAILS
    addSectionHeading('2. PROJECT DETAILS', 80);

    const projectDetailsData = [
      ['Project Name', projectData.projectName],
      ['Category', projectData.category || 'N/A'],
      ['Capacity', projectData.capacity || 'N/A'],
      ['Implementation Period', projectData.projectImplementationPeriod],
      ['Power Requirement', projectData.powerRequirement || 'N/A'],
      ['Location', `${projectData.location}, ${projectData.district}, ${projectData.state}`]
    ];

    autoTable(pdf, {
      startY: yPosition,
      head: [['Field', 'Details']],
      body: projectDetailsData,
      theme: 'grid',
      headStyles: { fillColor: [66, 139, 202] },
      margin: { left: margin, right: margin },
      styles: { fontSize: 10, cellPadding: 4 },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 'auto', overflow: 'linebreak' }
      }
    });

    yPosition = (pdf as any).lastAutoTable.finalY + 15;

    // Project Objective
    if (projectData.projectObjective) {
      checkPageBreak(25);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('2.1 Project Objective:', margin, yPosition);
      yPosition += 8;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      yPosition += addText(projectData.projectObjective, margin, yPosition, { maxWidth: pageWidth - 2 * margin });
      yPosition += 10;
    }

    // Market Analysis
    if (projectData.marketAnalysis) {
      checkPageBreak(25);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('2.2 Market Analysis:', margin, yPosition);
      yPosition += 8;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      yPosition += addText(projectData.marketAnalysis, margin, yPosition, { maxWidth: pageWidth - 2 * margin });
      yPosition += 20;
    }

    // 3. FINANCIAL STRUCTURE
    addSectionHeading('3. FINANCIAL STRUCTURE', 80);

    const grandTotalCost = parseFloat(projectData.totalProjectCost || '0');
    const financialStructureData = [
      ['Total Project Cost', `Rs. ${formatCurrencyNumber(grandTotalCost)}`, '100.0%'],
      ['Promoter\'s Contribution', `Rs. ${formatCurrencyNumber(parseFloat(projectData.promotersContribution || '0'))}`, 
       `${((parseFloat(projectData.promotersContribution || '0') / grandTotalCost) * 100).toFixed(1)}%`],
      ['Subsidy', `Rs. ${formatCurrencyNumber(parseFloat(projectData.subsidy || '0'))}`, 
       `${((parseFloat(projectData.subsidy || '0') / grandTotalCost) * 100).toFixed(1)}%`],
      ['Bank Loan', `Rs. ${formatCurrencyNumber(calculatedResults.loanAmount)}`, 
       `${((calculatedResults.loanAmount / grandTotalCost) * 100).toFixed(1)}%`]
    ];

    autoTable(pdf, {
      startY: yPosition,
      head: [['Component', 'Amount (Rs.)', 'Percentage']],
      body: financialStructureData,
      theme: 'grid',
      headStyles: { fillColor: [66, 139, 202] },
      margin: { left: margin, right: margin },
      styles: { fontSize: 10, cellPadding: 4 }
    });

    yPosition = (pdf as any).lastAutoTable.finalY + 20;

    // Loan Terms
    checkPageBreak(30);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('3.1 Loan Terms:', margin, yPosition);
    yPosition += 12;

    const loanTermsData = [
      ['Interest Rate', `${projectData.rateOfInterest}% per annum`],
      ['Loan Tenure', `${projectData.loanTenureYears} years`],
      ['Monthly EMI', `Rs. ${formatCurrencyNumber(calculatedResults.emi)}`]
    ];

    autoTable(pdf, {
      startY: yPosition,
      body: loanTermsData,
      theme: 'plain',
      margin: { left: margin + 10, right: margin },
      styles: { fontSize: 10, cellPadding: 4 },
      columnStyles: { 0: { fontStyle: 'bold' } }
    });

    yPosition = (pdf as any).lastAutoTable.finalY + 20;

    // 4. COST BREAKDOWN
    addSectionHeading('4. COST BREAKDOWN', 60);

    // Main Cost Components
    checkPageBreak(20);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('4.1 Main Cost Components:', margin, yPosition);
    yPosition += 12;

    const costBreakdownData = calculatedResults.costBreakdown.map(item => [
      item.category,
      `Rs. ${formatCurrencyNumber(item.amount)}`,
      `${item.percentage.toFixed(1)}%`
    ]);

    autoTable(pdf, {
      startY: yPosition,
      head: [['Category', 'Amount (Rs.)', 'Percentage']],
      body: costBreakdownData,
      theme: 'grid',
      headStyles: { fillColor: [66, 139, 202] },
      margin: { left: margin, right: margin },
      styles: { fontSize: 10, cellPadding: 4 }
    });

    yPosition = (pdf as any).lastAutoTable.finalY + 20;

    // 5. PROFITABILITY STATEMENT
    addSectionHeading('5. PROFITABILITY STATEMENT (7 YEARS)', 80);

    const profitabilityData = calculatedResults.profitabilityStatement.slice(0, 7).map(item => [
      `Year ${item.year}`,
      formatCurrencyNumber(item.income),
      formatCurrencyNumber(item.totalExpenses),
      formatCurrencyNumber(item.netIncomeBeforeID),
      formatCurrencyNumber(item.interest),
      formatCurrencyNumber(item.depreciation),
      formatCurrencyNumber(item.netProfitBeforeTax)
    ]);

    autoTable(pdf, {
      startY: yPosition,
      head: [['Year', 'Revenue', 'Expenses', 'EBITDA', 'Interest', 'Depreciation', 'Net Profit']],
      body: profitabilityData,
      theme: 'grid',
      headStyles: { fillColor: [66, 139, 202] },
      margin: { left: margin, right: margin },
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: {
        1: { halign: 'right' },
        2: { halign: 'right' },
        3: { halign: 'right' },
        4: { halign: 'right' },
        5: { halign: 'right' },
        6: { halign: 'right' }
      }
    });

    yPosition = (pdf as any).lastAutoTable.finalY + 20;

    // 6. CASH FLOW STATEMENT
    addSectionHeading('6. CASH FLOW STATEMENT (7 YEARS)', 80);

    const cashFlowData = calculatedResults.cashFlowStatement.slice(0, 7).map(item => [
      `Year ${item.year}`,
      formatCurrencyNumber(item.netProfit),
      formatCurrencyNumber(item.addDepreciation),
      formatCurrencyNumber(item.addInterest),
      formatCurrencyNumber(item.netCashAccruals)
    ]);

    autoTable(pdf, {
      startY: yPosition,
      head: [['Year', 'Net Profit', 'Add: Depreciation', 'Add: Interest', 'Net Cash Accruals']],
      body: cashFlowData,
      theme: 'grid',
      headStyles: { fillColor: [66, 139, 202] },
      margin: { left: margin, right: margin },
      styles: { fontSize: 10, cellPadding: 4 },
      columnStyles: {
        1: { halign: 'right' },
        2: { halign: 'right' },
        3: { halign: 'right' },
        4: { halign: 'right' }
      }
    });

    yPosition = (pdf as any).lastAutoTable.finalY + 20;

    // 7. BALANCE SHEET
    addSectionHeading('7. BALANCE SHEET (7 YEARS)', 80);

    const balanceSheetData = calculatedResults.balanceSheet.slice(0, 7).map(item => [
      `Year ${item.year}`,
      formatCurrencyNumber(item.fixedAssets),
      formatCurrencyNumber(item.currentAssets),
      formatCurrencyNumber(item.totalAssets),
      formatCurrencyNumber(item.ownersEquity),
      formatCurrencyNumber(item.longTermLiabilities),
      formatCurrencyNumber(item.currentLiabilities),
      formatCurrencyNumber(item.totalLiabilities)
    ]);

    autoTable(pdf, {
      startY: yPosition,
      head: [['Year', 'Fixed Assets', 'Current Assets', 'Total Assets', 'Owners Equity', 'Long Term Liab.', 'Current Liab.', 'Total Liab.']],
      body: balanceSheetData,
      theme: 'grid',
      headStyles: { fillColor: [66, 139, 202] },
      margin: { left: margin, right: margin },
      styles: { fontSize: 8, cellPadding: 3 },
      columnStyles: {
        1: { halign: 'right' },
        2: { halign: 'right' },
        3: { halign: 'right' },
        4: { halign: 'right' },
        5: { halign: 'right' },
        6: { halign: 'right' },
        7: { halign: 'right' }
      }
    });

    yPosition = (pdf as any).lastAutoTable.finalY + 20;

    // 8. LOAN REPAYMENT SCHEDULE (YEARLY)
    addSectionHeading('8. LOAN REPAYMENT SCHEDULE (YEARLY)', 80);

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Loan Amount: Rs. ${formatCurrencyNumber(calculatedResults.loanAmount)}`, margin, yPosition);
    yPosition += 8;
    pdf.text(`Interest Rate: ${projectData.rateOfInterest}% per annum`, margin, yPosition);
    yPosition += 8;
    pdf.text(`Tenure: ${projectData.loanTenureYears} years`, margin, yPosition);
    yPosition += 8;
    pdf.text(`Monthly EMI: Rs. ${formatCurrencyNumber(calculatedResults.emi)}`, margin, yPosition);
    yPosition += 15;

    const repaymentData = calculatedResults.loanRepaymentSchedule.map(item => [
      `Year ${item.year}`,
      formatCurrencyNumber(item.outstandingPrincipalStart),
      formatCurrencyNumber(item.principal),
      formatCurrencyNumber(item.interest),
      formatCurrencyNumber(item.principal + item.interest),
      formatCurrencyNumber(item.outstandingPrincipalStart - item.principal)
    ]);

    autoTable(pdf, {
      startY: yPosition,
      head: [['Year', 'Opening Balance', 'Principal', 'Interest', 'Total Payment', 'Closing Balance']],
      body: repaymentData,
      theme: 'grid',
      headStyles: { fillColor: [66, 139, 202] },
      margin: { left: margin, right: margin },
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: {
        1: { halign: 'right' },
        2: { halign: 'right' },
        3: { halign: 'right' },
        4: { halign: 'right' },
        5: { halign: 'right' }
      }
    });

    yPosition = (pdf as any).lastAutoTable.finalY + 20;

    // 9. DETAILED MONTHLY REPAYMENT SCHEDULE
    addSectionHeading('9. DETAILED MONTHLY REPAYMENT SCHEDULE', 80);

    const monthlySchedule = generateMonthlyRepaymentSchedule(
      calculatedResults.loanAmount,
      projectData.rateOfInterest,
      projectData.loanTenureYears,
      calculatedResults.emi
    );

    // Group by year for better presentation
    const yearlyGroups = monthlySchedule.reduce((groups, payment) => {
      const year = payment.year;
      if (!groups[year]) groups[year] = [];
      groups[year].push(payment);
      return groups;
    }, {} as any);

    Object.keys(yearlyGroups).forEach((year, yearIndex) => {
      if (yearIndex > 0) {
        checkPageBreak(60);
      }
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Year ${year} - Monthly Breakdown:`, margin, yPosition);
      yPosition += 12;

      const yearData = yearlyGroups[year].map((payment: any) => [
        `Month ${payment.monthInYear}`,
        formatCurrencyNumber(payment.outstandingPrincipalStart),
        formatCurrencyNumber(payment.principal),
        formatCurrencyNumber(payment.interest),
        formatCurrencyNumber(payment.emi),
        formatCurrencyNumber(payment.outstandingPrincipalEnd)
      ]);

      autoTable(pdf, {
        startY: yPosition,
        head: [['Month', 'Opening Balance', 'Principal', 'Interest', 'EMI', 'Closing Balance']],
        body: yearData,
        theme: 'grid',
        headStyles: { fillColor: [66, 139, 202] },
        margin: { left: margin, right: margin },
        styles: { fontSize: 8, cellPadding: 2 },
        columnStyles: {
          1: { halign: 'right' },
          2: { halign: 'right' },
          3: { halign: 'right' },
          4: { halign: 'right' },
          5: { halign: 'right' }
        }
      });

      yPosition = (pdf as any).lastAutoTable.finalY + 15;
    });

    // Summary of loan repayment
    const totalPrincipal = calculatedResults.loanRepaymentSchedule.reduce((sum, item) => sum + item.principal, 0);
    const totalInterest = calculatedResults.loanRepaymentSchedule.reduce((sum, item) => sum + item.interest, 0);
    const totalPayment = totalPrincipal + totalInterest;

    checkPageBreak(35);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('9.1 Loan Repayment Summary:', margin, yPosition);
    yPosition += 12;

    const repaymentSummaryData = [
      ['Total Principal Amount', `Rs. ${formatCurrencyNumber(totalPrincipal)}`],
      ['Total Interest Amount', `Rs. ${formatCurrencyNumber(totalInterest)}`],
      ['Total Amount Payable', `Rs. ${formatCurrencyNumber(totalPayment)}`],
      ['Interest as % of Principal', `${((totalInterest / totalPrincipal) * 100).toFixed(1)}%`]
    ];

    autoTable(pdf, {
      startY: yPosition,
      body: repaymentSummaryData,
      theme: 'plain',
      margin: { left: margin + 10, right: margin },
      styles: { fontSize: 10, cellPadding: 4 },
      columnStyles: { 0: { fontStyle: 'bold' } }
    });

    yPosition = (pdf as any).lastAutoTable.finalY + 20;

    // 10. DEBT SERVICE COVERAGE RATIO (DSCR)
    addSectionHeading('10. DEBT SERVICE COVERAGE RATIO (DSCR)', 60);

    checkPageBreak(25);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Average DSCR: ${calculatedResults.dscrCalculation.average.toFixed(2)}`, margin, yPosition);
    yPosition += 10;

    const dscrStatus = calculatedResults.dscrCalculation.average >= 1.25 ? 
      'Excellent - Strong repayment capacity' :
      calculatedResults.dscrCalculation.average >= 1.0 ?
      'Adequate - Monitor closely' :
      'Risk - Potential repayment issues';
    
    pdf.text(`Status: ${dscrStatus}`, margin, yPosition);
    yPosition += 15;

    const dscrData = calculatedResults.dscrCalculation.data.map(item => [
      `Year ${item.year}`,
      formatCurrencyNumber(item.netCashAccrual),
      formatCurrencyNumber(item.debtObligation),
      item.dscr.toFixed(2)
    ]);

    autoTable(pdf, {
      startY: yPosition,
      head: [['Year', 'Net Cash Accrual', 'Debt Obligation', 'DSCR']],
      body: dscrData,
      theme: 'grid',
      headStyles: { fillColor: [66, 139, 202] },
      margin: { left: margin, right: margin },
      styles: { fontSize: 10, cellPadding: 4 },
      columnStyles: {
        1: { halign: 'right' },
        2: { halign: 'right' },
        3: { halign: 'right' }
      }
    });

    yPosition = (pdf as any).lastAutoTable.finalY + 20;

    // 11. PROJECT VIABILITY
    addSectionHeading('11. PROJECT VIABILITY', 60);

    const viabilityData = [
      ['Net Present Value (NPV)', `Rs. ${formatCurrencyNumber(calculatedResults.projectViability.npv)}`],
      ['Internal Rate of Return (IRR)', `${(calculatedResults.projectViability.irr * 100).toFixed(2)}%`],
      ['Payback Period', `${calculatedResults.projectViability.paybackPeriod} years`],
      ['Profitability Index', calculatedResults.projectViability.profitabilityIndex.toFixed(2)]
    ];

    autoTable(pdf, {
      startY: yPosition,
      body: viabilityData,
      theme: 'plain',
      margin: { left: margin, right: margin },
      styles: { fontSize: 11, cellPadding: 4 },
      columnStyles: { 0: { fontStyle: 'bold' } }
    });

    yPosition = (pdf as any).lastAutoTable.finalY + 20;

    // 12. CONCLUSION
    addSectionHeading('12. CONCLUSION', 40);

    checkPageBreak(20);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const conclusion = calculatedResults.projectViability.npv > 0 && calculatedResults.dscrCalculation.average >= 1.25 ? 
      'The project shows strong financial viability with positive NPV and healthy DSCR. Recommended for approval.' :
      calculatedResults.projectViability.npv > 0 && calculatedResults.dscrCalculation.average >= 1.0 ?
      'The project is viable but requires careful monitoring. Consider additional security measures.' :
      'The project requires detailed review and risk mitigation before approval.';

    yPosition += addText(conclusion, margin, yPosition, { maxWidth: pageWidth - 2 * margin });

    // Risk Analysis (if provided)
    if (projectData.riskAnalysis || projectData.mitigationMeasures) {
      yPosition += 20;
      addSectionHeading('13. RISK ANALYSIS', 40);

      if (projectData.riskAnalysis) {
        checkPageBreak(25);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('13.1 Identified Risks:', margin, yPosition);
        yPosition += 10;
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        yPosition += addText(projectData.riskAnalysis, margin, yPosition, { maxWidth: pageWidth - 2 * margin });
        yPosition += 15;
      }

      if (projectData.mitigationMeasures) {
        checkPageBreak(25);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('13.2 Mitigation Measures:', margin, yPosition);
        yPosition += 10;
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        yPosition += addText(projectData.mitigationMeasures, margin, yPosition, { maxWidth: pageWidth - 2 * margin });
      }
    }

    // Ensure footer is on a new page if content is too close to bottom
    checkPageBreak(25);
    
    // Footer on last page
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'italic');
    pdf.text('Generated by Project Report Generator', pageWidth / 2, pageHeight - 10, { align: 'center' });
    pdf.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, pageWidth / 2, pageHeight - 5, { align: 'center' });

    // Save the PDF
    const fileName = `${projectData.projectName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_project_report.pdf`;
    pdf.save(fileName);

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF report');
  }
};