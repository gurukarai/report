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

// Helper function to parse CSV line with proper quote handling
const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let currentValue = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (insideQuotes && line[i + 1] === '"') {
        currentValue += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      result.push(currentValue.trim());
      currentValue = '';
    } else {
      currentValue += char;
    }
  }

  result.push(currentValue.trim());
  return result.map(val => parseCSVValue(val));
};

// Import project data from CSV format
export const importFromCSV = (file: File): Promise<ProjectData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const csvContent = e.target?.result as string;
        if (!csvContent || csvContent.trim().length === 0) {
          throw new Error('CSV file is empty');
        }

        const lines = csvContent.split('\n').filter(line => line.trim());

        if (lines.length < 2) {
          throw new Error('Invalid CSV format: File must contain header and data rows');
        }

        let headers: string[] = [];
        let dataValues: string[] = [];

        try {
          headers = parseCSVLine(lines[0]).map(h => h.replace(/"/g, '').trim());
        } catch (error) {
          console.warn('Error parsing headers, using default headers:', error);
          headers = [...CSV_HEADERS];
        }

        try {
          dataValues = parseCSVLine(lines[1]);
        } catch (error) {
          console.error('Error parsing data row:', error);
          throw new Error('Failed to parse data row. Please check CSV format.');
        }

        const projectData: Partial<ProjectData> = {};
        let importedFieldsCount = 0;

        headers.forEach((header, index) => {
          try {
            const cleanHeader = header.replace(/"/g, '').trim();

            if (CSV_HEADERS.includes(cleanHeader)) {
              const value = index < dataValues.length ? dataValues[index] : '';

              if (value && value.trim() !== '') {
                projectData[cleanHeader as keyof ProjectData] = value.trim();
                importedFieldsCount++;
              } else {
                projectData[cleanHeader as keyof ProjectData] = '';
              }
            }
          } catch (error) {
            console.warn(`Skipping field ${header} due to error:`, error);
          }
        });

        if (importedFieldsCount === 0) {
          throw new Error('No valid data found in CSV file');
        }

        const hasMinimumData =
          projectData.beneficiaryName ||
          projectData.projectName ||
          projectData.fatherName;

        if (!hasMinimumData) {
          throw new Error('CSV must contain at least one of: beneficiaryName, projectName, or fatherName');
        }

        CSV_HEADERS.forEach(header => {
          if (!(header in projectData)) {
            projectData[header as keyof ProjectData] = '';
          }
        });

        console.log(`Successfully imported ${importedFieldsCount} fields from CSV`);
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