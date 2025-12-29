import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Target, Award, BookOpen, Briefcase, X, Download, FileSpreadsheet } from 'lucide-react';

const HRKPIDashboard = () => {
  const [selectedPillar, setSelectedPillar] = useState('all');
  const [selectedKPI, setSelectedKPI] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const kpiData = [
    // Talent Acquisition Pillar
    {
      companyPillar: 'Talent Acquisition',
      hrPillar: 'P&C Organization',
      kpi: 'Hiring Quality',
      target: '20% of hires meeting or exceeding performance expectations',
      currentValue: 0,
      targetValue: 20,
      status: 'Start Tracking',
      icon: '👥',
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
      currentValue: 34.4,
      targetValue: 5,
      status: 'In Progress',
      icon: '📉',
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
      currentValue: 0,
      targetValue: 5,
      status: 'In Progress',
      icon: '⏱️',
      details: {
        description: 'Measures the efficiency of the recruitment process by tracking days from job posting to offer acceptance.',
        dataSource: null,
        formula: null
      }
    },
    {
      companyPillar: 'Talent Acquisition',
      hrPillar: 'Leadership & Culture',
      kpi: 'Diversity & Inclusion Index',
      target: 'Ensure an average of 10% workplace diversity (including age, gender and minority groups)',
      currentValue: 0,
      targetValue: 10,
      status: 'In Progress',
      icon: '🤝',
      details: {
        description: 'Tracks workplace diversity across multiple dimensions including age, gender, and minority representation.',
        dataSource: null,
        formula: null
      }
    },
    // Talent Management Pillar
    {
      companyPillar: 'Talent Management',
      hrPillar: 'Talent & Skills',
      kpi: 'Employee Development Index',
      target: 'Increase by 5% from baseline',
      currentValue: 0,
      targetValue: 5,
      status: 'Start Tracking',
      icon: '📈',
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
      currentValue: 0,
      targetValue: 20,
      status: 'In Progress',
      icon: '💪',
      details: {
        description: 'Measures employee satisfaction, commitment, and motivation through regular surveys and feedback.',
        dataSource: null,
        formula: null
      }
    },
    // Learning Pillar
    {
      companyPillar: 'Learning',
      hrPillar: 'Talent & Skills',
      kpi: 'AI Training',
      target: '35% of permanent employees trained in AI tools',
      currentValue: 0,
      targetValue: 35,
      status: 'In Progress',
      icon: '🎓',
      details: {
        description: 'Tracks the percentage of employees who have completed AI tools training programs.',
        dataSource: null,
        formula: null
      }
    },
    {
      companyPillar: 'Learning',
      hrPillar: 'Talent & Skills',
      kpi: 'Talent Development',
      target: '60% completion rate of skill development',
      currentValue: 0,
      targetValue: 60,
      status: 'In Progress',
      icon: '📚',
      details: {
        description: 'Measures the completion rate of assigned learning and development programs across the organization.',
        dataSource: null,
        formula: null
      }
    }
  ];

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

  const handleDownload = (filePath) => {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = filePath.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

      <div className="mt-4 text-center">
        <span className="text-xs text-blue-600 font-medium">Click for details</span>
      </div>
    </div>
  );

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
            <Target className="w-12 h-12 text-blue-600" />
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

        {/* KPI Cards grouped by Pillar */}
        <div>
        {selectedPillar === 'all' ? (
          // Show all pillars with their KPIs
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
          // Show only selected pillar
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

        {/* Modal for KPI Details */}
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
                {/* Current Value */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Current Value</span>
                    <span className="text-4xl font-bold text-slate-800">{selectedKPI.currentValue}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 mt-3">
                    <div
                      className="h-3 rounded-full transition-all"
                      style={{
                        width: `${Math.min((Math.abs(selectedKPI.currentValue) / Math.abs(selectedKPI.targetValue)) * 100, 100)}%`,
                        backgroundColor: pillarColors[selectedKPI.companyPillar]
                      }}
                    />
                  </div>
                </div>

                {/* Target */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">2025 Target</p>
                  <p className="text-slate-800">{selectedKPI.target}</p>
                </div>

                {/* Description */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">Description</p>
                  <p className="text-slate-700">{selectedKPI.details.description}</p>
                </div>

                {/* Formula */}
                {selectedKPI.details.formula && (
                  <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                    <p className="text-sm font-semibold text-blue-800 uppercase tracking-wide mb-3">Calculation Formula</p>
                    <div className="bg-white rounded-lg p-4 font-mono text-sm text-slate-800 border border-blue-300">
                      {selectedKPI.details.formula}
                    </div>
                  </div>
                )}

                {/* Additional Info */}
                {selectedKPI.details.additionalInfo && (
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                    <p className="text-sm font-semibold text-amber-800 uppercase tracking-wide mb-2">Additional Information</p>
                    <p className="text-slate-700">{selectedKPI.details.additionalInfo}</p>
                  </div>
                )}

                {/* Data Source & Download */}
                {selectedKPI.details.dataSource && (
                  <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                    <div className="flex items-center gap-2 mb-3">
                      <FileSpreadsheet className="w-5 h-5 text-green-700" />
                      <p className="text-sm font-semibold text-green-800 uppercase tracking-wide">Data Source</p>
                    </div>
                    <p className="text-slate-700 mb-4">
                      The data for this KPI is sourced from the EDM Report, which contains detailed employee movement and headcount information.
                    </p>
                    <button
                      onClick={() => handleDownload(selectedKPI.details.dataSource)}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                    >
                      <Download className="w-5 h-5" />
                      Download EDM Report
                    </button>
                  </div>
                )}

                {/* Status Badge */}
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
