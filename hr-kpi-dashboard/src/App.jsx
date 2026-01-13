import React, { useState } from "react";

const handleFileUpload = async (file) => {
  const XLSX = await import("xlsx");
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data);
  console.log(workbook);
};

import { Users, BookOpen, Briefcase, X, Upload, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

const HRKPIDashboard = () => {
  const [selectedPillar, setSelectedPillar] = useState('all');
  const [selectedKPI, setSelectedKPI] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({});
  const [calculatedKPIs, setCalculatedKPIs] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({
    edmReport: null,
    recruitmentTracker: null,
    enpsSurvey: null
  });

  // Utility: convert Excel serial date to JS Date (handles numbers produced by some XLSX exports)
  const excelSerialToDate = (serial) => {
    if (serial == null || serial === '') return null;
    if (serial instanceof Date) return serial;
    if (typeof serial !== 'number') return null;
    // Convert Excel serial date (days since 1899-12-31) to JS Date
    const utcDays = serial - 25569;
    const utcValue = utcDays * 86400; // seconds
    const date = new Date(utcValue * 1000);
    return isNaN(date.getTime()) ? null : date;
  };

  // Robust parser that accepts Date objects, ISO strings, or Excel serial numbers
  const parseMaybeDate = (val) => {
    if (!val && val !== 0) return null;
    if (val instanceof Date) return val;
    if (typeof val === 'number') {
      return excelSerialToDate(val);
    }
    const dt = new Date(val);
    return isNaN(dt.getTime()) ? null : dt;
  };

  // Parse Excel file using local xlsx package
  const parseExcelFile = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          // Ask sheet_to_json to return Dates when possible and not return undefined cells
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: null, raw: false, cellDates: true, dateNF: 'yyyy-mm-dd' });
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  };

  // Default KPI data structure
  const getKPIData = () => [
    {
      companyPillar: 'Talent Acquisition',
      hrPillar: 'P&C Organization',
      kpi: 'Hiring Quality',
      target: '20% of hires meeting or exceeding performance expectations',
      currentValue: 0,
      targetValue: 20,
      status: 'Start Tracking',
      icon: '👥',
      calculable: false,
      details: {
        description: 'This KPI measures the quality of new hires based on performance reviews and manager feedback.',
        dataSource: null,
        formula: null
      }
    },
    {
      companyPillar: 'Talent Acquisition',
      hrPillar: 'P&C Organization',
      kpi: 'People Turnover Rate',
      target: 'Reduce turnover rate by 5%',
      currentValue: calculatedKPIs.turnoverRate !== undefined ? calculatedKPIs.turnoverRate : 34.4,
      targetValue: 5,
      status: 'In Progress',
      icon: '📉',
      calculable: true,
      dataFile: 'edmReport',
      details: {
        description: 'The turnover rate for the year 2025 is calculated from the EDM Report, which tracks employee exits and headcount data throughout the year.',
        dataSource: '/data/EDM_Report.xlsx',
        formula: 'Turnover Rate (%) = (Number of Exits / Average Headcount) × 100',
        additionalInfo: 'This metric helps identify retention challenges and measure the effectiveness of employee engagement initiatives.'
      }
    },
    {
      companyPillar: 'Talent Acquisition',
      hrPillar: 'P&C Organization',
      kpi: 'Time to Fill',
      target: 'Reduce average time to fill critical positions by 5%',
      // Use null as default to indicate not available (avoids negative placeholder)
      currentValue: calculatedKPIs.timeToFill !== undefined ? calculatedKPIs.timeToFill : null,
      targetValue: 5,
      status: 'In Progress',
      icon: '⏱️',
      calculable: true,
      dataFile: 'recruitmentTracker',
      details: {
        description: 'Measures the efficiency of the recruitment process by tracking days from job posting to offer acceptance.',
        dataSource: '/data/Recruitment_Tracker.xlsx',
        formula: 'This KPI tracks the average Time to Fill using system-recorded values. The 2024 average serves as the baseline, while 2025 performance is measured against a 5% reduction target.',
        additionalInfo: 'Average Time to Fill increased by 14% in 2025 compared to the 2024 baseline, indicating a slower hiring cycle.'
      }
    },
    {
      companyPillar: 'Talent Acquisition',
      hrPillar: 'Leadership & Culture',
      kpi: 'Diversity & Inclusion Index',
      target: 'Ensure an average of 10% workplace diversity (including age, gender and minority groups)',
      currentValue: calculatedKPIs.diversityIndex !== undefined ? calculatedKPIs.diversityIndex : 27.9,
      targetValue: 10,
      status: 'In Progress',
      icon: '🤝',
      calculable: true,
      dataFile: 'edmReport',
      details: {
        description: 'Tracks workplace diversity across multiple dimensions including age, gender, and minority representation.',
        dataSource: '/data/EDM_Report.xlsx',
        formula: 'Diversity Index = Average of (Gender Diversity + Age Diversity + Religious Diversity)',
        additionalInfo: 'The current diversity index indicates the organization has exceeded its 10% target, showing strong representation across gender, age groups, and religious backgrounds.'
      }
    },
    {
      companyPillar: 'Talent Management',
      hrPillar: 'Talent & Skills',
      kpi: 'Employee Development Index',
      target: 'Increase by 5% from baseline',
      currentValue: 0,
      targetValue: 5,
      status: 'Start Tracking',
      icon: '📈',
      calculable: false,
      details: {
        description: 'Measures overall employee skill growth and development through training completion and skill assessments.',
        dataSource: null,
        formula: null
      }
    },
    {
      companyPillar: 'Talent Management',
      hrPillar: 'P&C Organization',
      kpi: 'AI-Driven P&C Processes',
      target: 'Implement AI in 25% of P&C processes',
      currentValue: 0,
      targetValue: 25,
      status: 'Planning',
      icon: '🤖',
      calculable: false,
      details: {
        description: 'Tracks the adoption of AI technology in HR processes to improve efficiency and decision-making.',
        dataSource: null,
        formula: null
      }
    },
    {
      companyPillar: 'Talent Management',
      hrPillar: 'Leadership & Culture',
      kpi: 'Employee Engagement Score',
      target: 'Achieve at least 20% engagement',
      currentValue: calculatedKPIs.engagementScore !== undefined ? calculatedKPIs.engagementScore : 69,
      targetValue: 20,
      status: 'In Progress',
      icon: '💪',
      calculable: true,
      dataFile: 'enpsSurvey',
      details: {
        description: 'Measures employee satisfaction, advocacy, and cultural alignment using employee survey responses.',
        dataSource: '/data/ENPS_CNPS_Survey.xlsx',
        formula: 'Employee Engagement Score (%) = Average of (eNPS Percentage + Culture Score Percentage)',
        additionalInfo: 'The current engagement score reflects employee willingness to recommend the organization and their perception of company culture.'
      }
    },
    {
      companyPillar: 'Learning',
      hrPillar: 'Talent & Skills',
      kpi: 'AI Training',
      target: '35% of permanent employees trained in AI tools',
      currentValue: 75,
      targetValue: 35,
      status: 'In Progress',
      icon: '🎓',
      calculable: false,
      details: {
        description: 'Tracks the percentage of employees who have participated in AI tools training programs.',
        dataSource: null,
        formula: 'AI Learning Participation represents the number of unique employees who engaged in learning content related to Artificial Intelligence.',
        additionalInfo: 'A 75% AI training participation rate demonstrates widespread employee engagement in AI skill development.'
      }
    },
    {
      companyPillar: 'Learning',
      hrPillar: 'Talent & Skills',
      kpi: 'Talent Development',
      target: '60% completion rate of skill development',
      currentValue: 6.7,
      targetValue: 60,
      status: 'In Progress',
      icon: '📚',
      calculable: false,
      details: {
        description: 'Measures the completion rate of assigned learning and development programs across the organization.',
        dataSource: '/data/Linkedinlearning.xlsx',
        formula: 'Employees completing target/total Employee * 100',
        additionalInfo: 'The target is considered complete once employees fulfill their assigned LinkedIn Learning hours.'
      }
    }
  ];

  const kpiData = getKPIData();

  // KPI Calculation Functions
  const calculateTurnoverRate = (data) => {
    try {
      const startDate = new Date('2025-07-01');
      const endDate = new Date('2025-12-31');

      const exits = data.filter(row => {
        const exitDate = parseMaybeDate(row['Exit Date']);
        return exitDate && exitDate >= startDate && exitDate <= endDate;
      }).length;

      const headcountStart = data.filter(row => {
        const joiningDate = parseMaybeDate(row['Joining Date']);
        const exitDate = parseMaybeDate(row['Exit Date']);
        return joiningDate && joiningDate <= startDate &&
               (!exitDate || exitDate >= startDate);
      }).length;

      const headcountEnd = data.filter(row => {
        const joiningDate = parseMaybeDate(row['Joining Date']);
        const exitDate = parseMaybeDate(row['Exit Date']);
        return joiningDate && joiningDate <= endDate &&
               (!exitDate || exitDate > endDate);
      }).length;

      const avgHeadcount = (headcountStart + headcountEnd) / 2;
      const turnoverRate = avgHeadcount > 0 ? (exits / avgHeadcount) * 100 : 0;

      return parseFloat(turnoverRate.toFixed(1));
    } catch (error) {
      console.error('Error calculating turnover rate:', error);
      return null;
    }
  };

  const calculateTimeToFill = (data) => {
    try {
      const startDate = new Date('2025-07-01');
      const today = new Date();

      const validValues = data
        .filter(row => {
          const erfDate = parseMaybeDate(row['ERF Received On']);
          const joiningDate = parseMaybeDate(row['Joining Date']);
          const status = row['Status'];
          // require valid erfDate, joiningDate, and hired status (and erf within range)
          return erfDate && erfDate >= startDate && erfDate <= today && joiningDate && status === 'Hired';
        })
        .map(row => {
          // prefer explicit 'Time To Fill' column if present
          let ttfRaw = row['Time To Fill'];
          if (ttfRaw == null || ttfRaw === '') {
            // fallback: compute difference in days between joining and erf
            const erfDate = parseMaybeDate(row['ERF Received On']);
            const joiningDate = parseMaybeDate(row['Joining Date']);
            if (erfDate && joiningDate) {
              return (joiningDate - erfDate) / (1000 * 60 * 60 * 24);
            }
            return null;
          }
          const ttf = parseFloat(ttfRaw);
          if (isNaN(ttf) || ttf < 0) return null; // exclude invalid/negative
          return ttf;
        })
        .filter(val => val !== null && !isNaN(val));

      if (validValues.length === 0) return null;

      const average = validValues.reduce((sum, val) => sum + val, 0) / validValues.length;
      return parseFloat(average.toFixed(1));
    } catch (error) {
      console.error('Error calculating time to fill:', error);
      return null;
    }
  };

  const calculateEngagementScore = (data) => {
    try {
      const enpsColumn = 'How likely are you to recommend JBS to a friend or colleague?';
      const cultureColumn = 'How would you rate the company culture?';

      let promoters = 0, passives = 0, detractors = 0;

      data.forEach(row => {
        const score = parseFloat(row[enpsColumn]);
        if (!isNaN(score)) {
          if (score >= 9) promoters++;
          else if (score >= 7) passives++;
          else detractors++;
        }
      });

      const totalResponses = promoters + passives + detractors;
      if (totalResponses === 0) return null;

      const enps = ((promoters / totalResponses) - (detractors / totalResponses)) * 100;
      // Keep the previous behavior but it's safe to compute without causing runtime errors
      const enpsPercentage = (enps + 100) / 2;

      const cultureScores = data
        .map(row => {
          const rating = parseFloat(row[cultureColumn]);
          return isNaN(rating) ? null : (rating / 10) * 100;
        })
        .filter(score => score !== null);

      if (cultureScores.length === 0) return null;

      const avgCultureScore = cultureScores.reduce((sum, score) => sum + score, 0) / cultureScores.length;
      const engagementScore = (enpsPercentage * 0.5) + (avgCultureScore * 0.5);

      return parseFloat(engagementScore.toFixed(1));
    } catch (error) {
      console.error('Error calculating engagement score:', error);
      return null;
    }
  };

  const calculateDiversityIndex = (data) => {
    try {
      const totalEmployees = data.length;
      if (totalEmployees === 0) return null;

      const calculateDiversity = (counts) => {
        const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
        if (total === 0) return 0;

        const proportions = Object.values(counts).map(count => count / total);
        const sumOfSquares = proportions.reduce((sum, p) => sum + (p * p), 0);
        return 1 - sumOfSquares;
      };

      const genderCounts = {};
      data.forEach(row => {
        const gender = row['Gender'];
        if (gender) {
          genderCounts[gender] = (genderCounts[gender] || 0) + 1;
        }
      });
      const genderDiversity = calculateDiversity(genderCounts);

      const ageCounts = { 'under30': 0, '30to50': 0, 'over50': 0 };
      data.forEach(row => {
        const age = parseFloat(row["Employee's Age"]);
        if (!isNaN(age)) {
          if (age < 30) ageCounts.under30++;
          else if (age <= 50) ageCounts['30to50']++;
          else ageCounts.over50++;
        }
      });
      const ageDiversity = calculateDiversity(ageCounts);

      const religionCounts = {};
      data.forEach(row => {
        const religion = row['Religion'];
        if (religion) {
          religionCounts[religion] = (religionCounts[religion] || 0) + 1;
        }
      });
      const religionDiversity = calculateDiversity(religionCounts);

      const diversityIndex = ((genderDiversity + ageDiversity + religionDiversity) / 3) * 100;

      return parseFloat(diversityIndex.toFixed(1));
    } catch (error) {
      console.error('Error calculating diversity index:', error);
      return null;
    }
  };

  const handleFileUpload = async (fileType, file) => {
    if (!file) return;

    setUploadStatus(prev => ({ ...prev, [fileType]: 'processing' }));

    try {
      const jsonData = await parseExcelFile(file);
      setUploadedFiles(prev => ({ ...prev, [fileType]: jsonData }));

      let newCalculations = { ...calculatedKPIs };

      if (fileType === 'edmReport') {
        const turnoverRate = calculateTurnoverRate(jsonData);
        const diversityIndex = calculateDiversityIndex(jsonData);

        if (turnoverRate !== null) newCalculations.turnoverRate = turnoverRate;
        if (diversityIndex !== null) newCalculations.diversityIndex = diversityIndex;
      } else if (fileType === 'recruitmentTracker') {
        const timeToFill = calculateTimeToFill(jsonData);
        if (timeToFill !== null) newCalculations.timeToFill = timeToFill;
      } else if (fileType === 'enpsSurvey') {
        const engagementScore = calculateEngagementScore(jsonData);
        if (engagementScore !== null) newCalculations.engagementScore = engagementScore;
      }

      setCalculatedKPIs(newCalculations);
      setUploadStatus(prev => ({ ...prev, [fileType]: 'success' }));

      setTimeout(() => {
        setUploadStatus(prev => ({ ...prev, [fileType]: null }));
      }, 3000);

    } catch (error) {
      console.error('Error processing file:', error);
      setUploadStatus(prev => ({ ...prev, [fileType]: 'error' }));
    }
  };

  const pillarColors = {
    'Talent Acquisition': '#3498DB',
    'Talent Management': '#9B59B6',
    'Learning': '#E67E22'
  };

  const pillarIcons = {
    'Talent Acquisition': Users,
    'Talent Management': Briefcase,
    'Learning': BookOpen
  };

  const filteredData = selectedPillar === 'all'
    ? kpiData
    : kpiData.filter(item => item.companyPillar === selectedPillar);

  const pillarSummary = Object.keys(pillarColors).map(pillar => {
    const items = kpiData.filter(item => item.companyPillar === pillar);
    const kpiCount = items.length;
    const sumAbsTargets = items.reduce((acc, item) => acc + (Math.abs(item.targetValue) || 0), 0);
    const avgTarget = kpiCount > 0 ? Math.round(sumAbsTargets / kpiCount) : 0;
    return { name: pillar, kpiCount, avgTarget };
  });

  const hrPillarData = [
    { name: 'P&C Organization', value: kpiData.filter(k => k.hrPillar === 'P&C Organization').length },
    { name: 'Talent & Skills', value: kpiData.filter(k => k.hrPillar === 'Talent & Skills').length },
    { name: 'Leadership & Culture', value: kpiData.filter(k => k.hrPillar === 'Leadership & Culture').length }
  ];

  const COLORS = ['#3498DB', '#9B59B6', '#E74C3C'];

  const handleKPIClick = (kpi) => {
    setSelectedKPI(kpi);
    setShowModal(true);
  };

  const KPICard = ({ kpi, index }) => {
    // compute progress percent safely (guard against zero/undefined targets and null currentValue)
    const safeCurrent = kpi.currentValue != null ? Number(kpi.currentValue) : null;
    const safeTarget = kpi.targetValue != null ? Number(kpi.targetValue) : null;
    const progressPct = safeTarget && safeTarget !== 0 && safeCurrent !== null
      ? Math.min((Math.abs(safeCurrent) / Math.abs(safeTarget)) * 100, 100)
      : 0;

    return (
      <div
        key={index}
        onClick={() => handleKPIClick(kpi)}
        className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer border-t-4 transform hover:-translate-y-1"
        style={{ borderTopColor: pillarColors[kpi.companyPillar] }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="text-3xl mb-2">{kpi.icon}</div>
            <h3 className="font-bold text-slate-800 text-lg mb-1">{kpi.kpi}</h3>
            <p className="text-sm text-slate-500 mb-2">{kpi.hrPillar}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              kpi.status === 'Start Tracking'
                ? 'bg-yellow-100 text-yellow-800'
                : kpi.status === 'Planning'
                ? 'bg-purple-100 text-purple-800'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            {kpi.status}
          </span>
        </div>

        <div className="space-y-3">
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-sm font-medium text-slate-700 mb-2">2025 Target:</p>
            <p className="text-sm text-slate-600">{kpi.target}</p>
          </div>

          <div className="pt-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-600">Current Progress:</span>
              <span className="font-bold text-slate-800">{safeCurrent !== null ? `${safeCurrent}%` : 'N/A'}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all"
                style={{
                  width: `${progressPct}%`,
                  backgroundColor: pillarColors[kpi.companyPillar]
                }}
              />
            </div>
          </div>
        </div>

        {kpi.calculable && (
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-green-600 font-medium">
            <RefreshCw className="w-3 h-3" />
            Auto-calculated from data
          </div>
        )}
      </div>
    );
  };

  const FileUploadSection = ({ fileType, label, description }) => {
    const status = uploadStatus[fileType];
    const hasFile = uploadedFiles[fileType] !== null;

    return (
      <div className="bg-white rounded-lg border-2 border-dashed border-slate-300 p-6 hover:border-blue-400 transition-colors">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-slate-800 mb-1">{label}</h3>
            <p className="text-sm text-slate-600">{description}</p>
          </div>
          {hasFile && (
            <CheckCircle className="w-6 h-6 text-green-500" />
          )}
        </div>

        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => handleFileUpload(fileType, e.target.files[0])}
          className="hidden"
          id={`upload-${fileType}`}
        />

        <label
          htmlFor={`upload-${fileType}`}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium cursor-pointer transition-all ${
            status === 'processing'
              ? 'bg-blue-100 text-blue-700'
              : status === 'success'
              ? 'bg-green-100 text-green-700'
              : status === 'error'
              ? 'bg-red-100 text-red-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {status === 'processing' ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : status === 'success' ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Uploaded Successfully
            </>
          ) : status === 'error' ? (
            <>
              <AlertCircle className="w-5 h-5" />
              Upload Failed
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              {hasFile ? 'Replace File' : 'Upload File'}
            </>
          )}
        </label>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                HR Strategic KPI Dashboard 2025
              </h1>
              <p className="text-slate-600">
                Track and monitor your strategic HR objectives aligned with company goals
              </p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <Upload className="w-5 h-5" />
              Upload Data
            </button>
          </div>
        </div>

        {/* Pillar Filter */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedPillar('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedPillar === 'all'
                  ? 'bg-slate-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Pillars
            </button>
            {Object.keys(pillarColors).map(pillar => {
              const Icon = pillarIcons[pillar];
              return (
                <button
                  key={pillar}
                  onClick={() => setSelectedPillar(pillar)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    selectedPillar === pillar
                      ? 'text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                  style={selectedPillar === pillar ? { backgroundColor: pillarColors[pillar] } : {}}
                >
                  <Icon className="w-4 h-4" />
                  {pillar}
                </button>
              );
            })}
          </div>
        </div>

        {/* Summary Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">KPIs by Strategic Pillar</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pillarSummary}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-15} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="kpiCount" fill="#3498DB" name="Number of KPIs" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">KPIs by HR Strategic Pillar</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={hrPillarData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {hrPillarData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* KPI Cards */}
        <div>
          {selectedPillar === 'all' ? (
            Object.keys(pillarColors).map((pillar) => {
              const pillarKPIs = kpiData.filter(item => item.companyPillar === pillar);
              const Icon = pillarIcons[pillar];
              return (
                <div key={pillar} className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: pillarColors[pillar] + '20' }}
                    >
                      <Icon className="w-6 h-6" style={{ color: pillarColors[pillar] }} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">{pillar}</h2>
                    <span className="text-sm text-slate-500">({pillarKPIs.length} KPIs)</span>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pillarKPIs.map((kpi, index) => (
                      <KPICard key={index} kpi={kpi} index={index} />
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: pillarColors[selectedPillar] + '20' }}
                >
                  {React.createElement(pillarIcons[selectedPillar], {
                    className: "w-6 h-6",
                    style: { color: pillarColors[selectedPillar] }
                  })}
                </div>
                <h2 className="text-2xl font-bold text-slate-800">{selectedPillar}</h2>
                <span className="text-sm text-slate-500">({filteredData.length} KPIs)</span>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredData.map((kpi, index) => (
                  <KPICard key={index} kpi={kpi} index={index} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Implementation Guide */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Implementation Roadmap</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-bold text-blue-900 mb-2">Q1 2025: Foundation</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Establish baseline metrics</li>
                <li>• Set up tracking systems</li>
                <li>• Launch "Start Tracking" KPIs</li>
                <li>• Train stakeholders</li>
              </ul>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-bold text-green-900 mb-2">Q2-Q3 2025: Execution</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Implement initiatives</li>
                <li>• Monitor progress monthly</li>
                <li>• Adjust strategies as needed</li>
                <li>• Report to leadership</li>
              </ul>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-bold text-purple-900 mb-2">Q4 2025: Review</h3>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• Evaluate performance</li>
                <li>• Identify gaps</li>
                <li>• Plan for 2026</li>
                <li>• Celebrate successes</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Upload Data Files</h2>
                  <p className="text-sm text-slate-600 mt-1">Upload Excel files to automatically calculate KPIs</p>
                </div>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-slate-600" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <FileUploadSection
                  fileType="edmReport"
                  label="EDM Report"
                  description="Employee Data Management report containing joining dates, exit dates, demographics"
                />

                <FileUploadSection
                  fileType="recruitmentTracker"
                  label="Recruitment Tracker"
                  description="Recruitment data with ERF dates, joining dates, and time to fill metrics"
                />

                <FileUploadSection
                  fileType="enpsSurvey"
                  label="eNPS & cNPS Survey"
                  description="Employee Net Promoter Score and company culture survey responses"
                />

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2">📊 Auto-Calculated KPIs</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• <strong>Turnover Rate</strong> - Calculated from EDM Report</li>
                    <li>• <strong>Time to Fill</strong> - Calculated from Recruitment Tracker</li>
                    <li>• <strong>Employee Engagement Score</strong> - Calculated from eNPS Survey</li>
                    <li>• <strong>Diversity Index</strong> - Calculated from EDM Report</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* KPI Details Modal */}
        {showModal && selectedKPI && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{selectedKPI.icon}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">{selectedKPI.kpi}</h2>
                    <p className="text-sm text-slate-500">{selectedKPI.companyPillar} • {selectedKPI.hrPillar}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-slate-600" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Current Value</span>
                    <span className="text-4xl font-bold text-slate-800">
                      {selectedKPI.currentValue != null ? `${selectedKPI.currentValue}%` : 'N/A'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 mt-3">
                    <div
                      className="h-3 rounded-full transition-all"
                      style={{
                        width: `${(selectedKPI.targetValue && selectedKPI.currentValue != null)
                          ? Math.min((Math.abs(selectedKPI.currentValue) / Math.abs(selectedKPI.targetValue)) * 100, 100)
                          : 0
                        }%`,
                        backgroundColor: pillarColors[selectedKPI.companyPillar]
                      }}
                    />
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">2025 Target</p>
                  <p className="text-slate-800">{selectedKPI.target}</p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">Description</p>
                  <p className="text-slate-700">{selectedKPI.details.description}</p>
                </div>

                {selectedKPI.details.formula && (
                  <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                    <p className="text-sm font-semibold text-blue-800 uppercase tracking-wide mb-3">Calculation Formula</p>
                    <div className="bg-white rounded-lg p-4 font-mono text-sm text-slate-800 border border-blue-300">
                      {selectedKPI.details.formula}
                    </div>
                  </div>
                )}

                {selectedKPI.details.additionalInfo && (
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                    <p className="text-sm font-semibold text-amber-800 uppercase tracking-wide mb-2">Additional Information</p>
                    <p className="text-slate-700">{selectedKPI.details.additionalInfo}</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <span className="text-sm text-slate-600 font-medium">Status:</span>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-bold ${
                      selectedKPI.status === 'Start Tracking'
                        ? 'bg-yellow-100 text-yellow-800'
                        : selectedKPI.status === 'Planning'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {selectedKPI.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HRKPIDashboard;
