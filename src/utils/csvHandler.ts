import { ProjectData } from '../types';

// Define the CSV headers in a specific order
const CSV_HEADERS = [
  'beneficiaryName',
  'fatherName',
  'address',
  'mobileNumber',
  'aboutBeneficiary',
  'age',
  'gender',
  'maritalStatus',
  'educationalQualification',
  'experience',
  'caste',
  'familyMembers',
  'annualIncome',
  'panNumber',
  'aadharNumber',
  'location',
  'district',
  'state',
  'pinCode',
  'landOwnership',
  'bankName',
  'branchName',
  'accountNumber',
  'ifscCode',
  'projectName',
  'category',
  'capacity',
  'unitOfMeasurement',
  'projectImplementationPeriod',
  'powerRequirement',
  'projectObjective',
  'marketAnalysis',
  'competitiveAdvantage',
  'riskAnalysis',
  'mitigationMeasures',
  'totalProjectCost',
  'promotersContribution',
  'subsidy',
  'rateOfInterest',
  'loanTenureYears',
  'moratoriumPeriodMonths',
  'projectedAnnualRevenue',
  'projectedAnnualExpenses',
  'depreciationRate',
  'revenueGrowthRate',
  'expenseGrowthRate',
  'machineryEquipmentCost',
  'shedBuildingCost',
  'landCost',
  'furnitureFittingsCost',
  'vehicleCost',
  'workingCapitalCost',
  'otherAssetsCost',
  'projectReportCost',
  'technicalKnowHowCost',
  'licensingCost',
  'trainingCost',
  'interestDuringConstructionCost',
  'otherPreOperativeCost'
];

// Helper function to escape CSV values
const escapeCSVValue = (value: string): string => {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

// Helper function to parse CSV values
const parseCSVValue = (value: string): string => {
  if (value.startsWith('"') && value.endsWith('"')) {
    return value.slice(1, -1).replace(/""/g, '"');
  }
  return value;
};

// Export project data to CSV format
export const exportToCSV = (projectData: ProjectData): void => {
  try {
    // Create CSV header row
    const headerRow = CSV_HEADERS.join(',');
    
    // Create data row
    const dataRow = CSV_HEADERS.map(header => {
      const value = projectData[header as keyof ProjectData] || '';
      return escapeCSVValue(value);
    }).join(',');
    
    // Combine header and data
    const csvContent = `${headerRow}\n${dataRow}`;
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${projectData.projectName || 'project_data'}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error('Error exporting CSV:', error);
    throw new Error('Failed to export CSV file');
  }
};

// Import project data from CSV format
export const importFromCSV = (file: File): Promise<ProjectData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const csvContent = e.target?.result as string;
        const lines = csvContent.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          throw new Error('Invalid CSV format: File must contain header and data rows');
        }
        
        // Parse header row
        const headers = lines[0].split(',').map(header => header.trim());
        
        // Parse data row
        const dataValues: string[] = [];
        let currentValue = '';
        let insideQuotes = false;
        
        for (let i = 0; i < lines[1].length; i++) {
          const char = lines[1][i];
          
          if (char === '"') {
            if (insideQuotes && lines[1][i + 1] === '"') {
              // Escaped quote
              currentValue += '"';
              i++; // Skip next quote
            } else {
              // Toggle quote state
              insideQuotes = !insideQuotes;
            }
          } else if (char === ',' && !insideQuotes) {
            // End of field
            dataValues.push(parseCSVValue(currentValue.trim()));
            currentValue = '';
          } else {
            currentValue += char;
          }
        }
        
        // Add the last value
        if (currentValue) {
          dataValues.push(parseCSVValue(currentValue.trim()));
        }
        
        // Create project data object
        const projectData: Partial<ProjectData> = {};
        
        headers.forEach((header, index) => {
          const cleanHeader = header.replace(/"/g, '').trim();
          if (CSV_HEADERS.includes(cleanHeader) && index < dataValues.length) {
            projectData[cleanHeader as keyof ProjectData] = dataValues[index] || '';
          }
        });
        
        // Validate required fields
        const requiredFields = ['beneficiaryName', 'projectName'];
        const missingFields = requiredFields.filter(field => !projectData[field as keyof ProjectData]);
        
        if (missingFields.length > 0) {
          throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }
        
        // Fill in any missing fields with empty strings
        CSV_HEADERS.forEach(header => {
          if (!(header in projectData)) {
            projectData[header as keyof ProjectData] = '';
          }
        });
        
        resolve(projectData as ProjectData);
      } catch (error) {
        console.error('Error parsing CSV:', error);
        reject(new Error(`Failed to parse CSV file: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read CSV file'));
    };
    
    reader.readAsText(file);
  });
};

// Validate CSV file format
export const validateCSVFile = (file: File): boolean => {
  const validExtensions = ['.csv'];
  const fileName = file.name.toLowerCase();
  const isValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
  const isValidSize = file.size > 0 && file.size < 5 * 1024 * 1024; // Max 5MB
  
  return isValidExtension && isValidSize;
};