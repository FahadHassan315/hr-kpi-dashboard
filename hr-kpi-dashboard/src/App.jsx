import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Target, Award, BookOpen, Briefcase, X, Download, FileSpreadsheet, Upload, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

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
      currentValue: calculatedKPIs.timeToFill !== undefined ? calculatedKPIs.timeToFill : -14,
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

      // Parse dates safely
      const parseDate = (dateStr) => {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? null : date;
      };

      // Step 1: Count exits
      const exits = data.filter(row => {
        const exitDate = parseDate(row['Exit Date']);
        return exitDate && exitDate >= startDate && exitDate <= endDate;
      }).length;

      // Step 2: Headcount at start
      const headcountStart = data.filter(row => {
        const joiningDate = parseDate(row['Joining Date']);
        const exitDate = parseDate(row['Exit Date']);
        return joiningDate && joiningDate <= startDate && 
               (!exitDate || exitDate >= startDate);
      }).length;

      // Step 3: Headcount at end
      const headcountEnd = data.filter(row => {
        const joiningDate = parseDate(row['Joining Date']);
        const exitDate = parseDate(row['Exit Date']);
        return joiningDate && joiningDate <= endDate && 
               (!exitDate || exitDate > endDate);
      }).length;

      // Step 4: Average headcount
      const avgHeadcount = (headcountStart + headcountEnd) / 2;

      // Step 5: Turnover rate
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

      const parseDate = (dateStr) => {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? null : date;
      };

      // Create adjusted time to fill values
      const validValues = data
        .filter(row => {
          const erfDate = parseDate(row['ERF Received On']);
          const joiningDate = parseDate(row['Joining Date']);
          const status = row['Status'];
          
          return erfDate && 
                 erfDate >= startDate && 
                 erfDate <= today &&
                 joiningDate && 
                 status === 'Hired';
        })
        .map(row => {
          let ttf = parseFloat(row['Time To Fill']);
          if (isNaN(ttf) || ttf < 0) {
            ttf = 0;
          }
          return ttf;
        })
        .filter(val => !isNaN(val) && val >= 0);

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

      // Step 1: Classify ENPS responses
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

      // Step 2: Calculate ENPS
      const enps = ((promoters / totalResponses) - (detractors / totalResponses)) * 100;

      // Step 3: Normalize ENPS
      const enpsPercentage = (enps + 100) / 2;

      // Step 4: Calculate culture score
      const cultureScores = data
        .map(row => {
          const rating = parseFloat(row[cultureColumn]);
          return isNaN(rating) ? null : (rating / 10) * 100;
        })
        .filter(score => score !== null);

      if (cultureScores.length === 0) return null;

      const avgCultureScore = cultureScores.reduce((sum, score) => sum + score, 0) / cultureScores.length;

      // Step 5: Final engagement score
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

      // Helper function to calculate diversity score
      const calculateDiversity = (counts) => {
        const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
        if (total === 0) return 0;
        
        const proportions = Object.values(counts).map(count => count / total);
        const sumOfSquares = proportions.reduce((sum, p) => sum + (p * p), 0);
        return 1 - sumOfSquares;
      };

      // A) Gender Diversity
      const genderCounts = {};
      data.forEach(row => {
        const gender = row['Gender'];
        if (gender) {
          genderCounts[gender] = (genderCounts[gender] || 0) + 1;
        }
      });
      const genderDiversity = calculateDiversity(genderCounts);

      // B) Age Diversity
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

      // C) Religion Diversity
      const religionCounts = {};
      data.forEach(row => {
        const religion = row['Religion'];
        if (religion) {
          religionCounts[religion] = (religionCounts[religion] || 0) + 1;
        }
      });
      const religionDiversity = calculateDiversity(religionCounts);

      // Final diversity index (as percentage)
      const diversityIndex = ((genderDiversity + ageDiversity + religionDiversity) / 3) * 100;

      return parseFloat(diversityIndex.toFixed(1));
    } catch (error) {
      console.error('Error calculating diversity index:', error);
      return null;
    }
  };

  // File upload handler
  const handleFileUpload = async (fileType, file) => {
    if (!file) return;

    setUploadStatus(prev => ({ ...prev, [fileType]: 'processing' }));

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Store the uploaded file data
      setUploadedFiles(prev => ({ ...prev, [fileType]: jsonData }));

      // Calculate KPIs based on file type
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

  const pillarSummary = Object.keys(pillarColors).map(pillar => ({
    name: pillar,
    kpiCount: kpiData.filter(item => item.companyPillar === pillar).length,
    avgTarget: Math.round(
      kpiData
        .filter(item => item.companyPillar === pillar)
        .reduce((acc, item) => acc + Math.abs(item.targetValue), 0) / 
      kpiData.filter(item => item.companyPillar === pillar).length
    )
  }));

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

  const KPICard = ({ kpi, index }) => (
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
            <span className="font-bold text-slate-800">{kpi.currentValue}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width: `${Math.min((Math.abs(kpi.currentValue) / Math.abs(kpi.targetValue)) * 100, 100)}%`,
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
