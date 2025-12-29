import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Users, Target, Award, Globe, Brain, BookOpen, Briefcase } from 'lucide-react';

const HRKPIDashboard = () => {
  const [selectedPillar, setSelectedPillar] = useState('all');
  const [selectedHRPillar, setSelectedHRPillar] = useState('all');
  
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
      description: 'Measure quality of new hires based on performance reviews'
    },
    {
      companyPillar: 'Talent Acquisition',
      hrPillar: 'P&C Organization',
      kpi: 'People Turnover Rate',
      target: 'Reduce turnover rate by 5%',
      currentValue: 0,
      targetValue: 5,
      status: 'In Progress',
      icon: '📉',
      description: 'Track and reduce employee attrition rates'
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
      description: 'Optimize recruitment process efficiency'
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
      description: 'Measure overall employee skill growth and development'
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
      description: 'Automate HR processes using AI technology'
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
      description: 'Measure and improve employee satisfaction and engagement'
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
      description: 'Upskill workforce in AI technologies'
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
      description: 'Track completion of learning and development programs'
    }
  ];

  const pillarColors = {
    'Talent Acquisition': '#3498DB',
    'Talent Management': '#9B59B6',
    'Learning': '#E67E22'
  };

  const hrPillarColors = {
    'P&C Organization': '#16A085',
    'Talent & Skills': '#E74C3C',
    'Leadership & Culture': '#F39C12'
  };

  const pillarIcons = {
    'Talent Acquisition': Users,
    'Talent Management': Briefcase,
    'Learning': BookOpen
  };

  // Filter data based on selections
  let filteredData = kpiData;
  if (selectedPillar !== 'all') {
    filteredData = filteredData.filter(item => item.companyPillar === selectedPillar);
  }
  if (selectedHRPillar !== 'all') {
    filteredData = filteredData.filter(item => item.hrPillar === selectedHRPillar);
  }

  // Summary data for charts
  const pillarSummary = Object.keys(pillarColors).map(pillar => ({
    name: pillar,
    kpiCount: kpiData.filter(item => item.companyPillar === pillar).length,
    avgTarget: Math.round(
      kpiData
        .filter(item => item.companyPillar === pillar)
        .reduce((acc, item) => acc + Math.abs(item.targetValue), 0) / 
      kpiData.filter(item => item.companyPillar === pillar).length
    ),
    inProgress: kpiData.filter(item => item.companyPillar === pillar && item.status === 'In Progress').length,
    planning: kpiData.filter(item => item.companyPillar === pillar && item.status === 'Planning').length,
    tracking: kpiData.filter(item => item.companyPillar === pillar && item.status === 'Start Tracking').length
  }));

  const hrPillarData = [
    { 
      name: 'P&C Organization', 
      value: kpiData.filter(k => k.hrPillar === 'P&C Organization').length,
      color: hrPillarColors['P&C Organization']
    },
    { 
      name: 'Talent & Skills', 
      value: kpiData.filter(k => k.hrPillar === 'Talent & Skills').length,
      color: hrPillarColors['Talent & Skills']
    },
    { 
      name: 'Leadership & Culture', 
      value: kpiData.filter(k => k.hrPillar === 'Leadership & Culture').length,
      color: hrPillarColors['Leadership & Culture']
    }
  ];

  const statusData = [
    { name: 'In Progress', value: kpiData.filter(k => k.status === 'In Progress').length, color: '#3498DB' },
    { name: 'Start Tracking', value: kpiData.filter(k => k.status === 'Start Tracking').length, color: '#F39C12' },
    { name: 'Planning', value: kpiData.filter(k => k.status === 'Planning').length, color: '#9B59B6' }
  ];

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Start Tracking':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      case 'Planning':
        return 'bg-purple-100 text-purple-800 border border-purple-300';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border-l-8 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-3">
                HR Strategic KPI Dashboard 2025
              </h1>
              <p className="text-lg text-slate-600">
                Monitor 8 strategic KPIs across 3 key pillars aligned with organizational objectives
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl">
              <Target className="w-14 h-14 text-white" />
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
              <div className="text-3xl font-bold text-blue-700">{kpiData.length}</div>
              <div className="text-sm text-blue-600 font-medium">Total KPIs</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
              <div className="text-3xl font-bold text-green-700">
                {kpiData.filter(k => k.status === 'In Progress').length}
              </div>
              <div className="text-sm text-green-600 font-medium">In Progress</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
              <div className="text-3xl font-bold text-purple-700">
                {kpiData.filter(k => k.status === 'Planning').length}
              </div>
              <div className="text-sm text-purple-600 font-medium">Planning</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
              <div className="text-3xl font-bold text-orange-700">
                {kpiData.filter(k => k.status === 'Start Tracking').length}
              </div>
              <div className="text-sm text-orange-600 font-medium">Start Tracking</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="font-semibold text-slate-700 mb-3">Filter by Strategic Pillar</h3>
          <div className="flex flex-wrap gap-3 mb-5">
            <button
              onClick={() => setSelectedPillar('all')}
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                selectedPillar === 'all'
                  ? 'bg-gradient-to-r from-slate-700 to-slate-900 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Pillars ({kpiData.length})
            </button>
            {Object.keys(pillarColors).map(pillar => {
              const Icon = pillarIcons[pillar];
              const count = kpiData.filter(item => item.companyPillar === pillar).length;
              return (
                <button
                  key={pillar}
                  onClick={() => setSelectedPillar(pillar)}
                  className={`px-5 py-2.5 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center gap-2 ${
                    selectedPillar === pillar
                      ? 'text-white shadow-lg'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                  style={selectedPillar === pillar ? { 
                    background: `linear-gradient(135deg, ${pillarColors[pillar]}, ${pillarColors[pillar]}dd)` 
                  } : {}}
                >
                  <Icon className="w-4 h-4" />
                  {pillar} ({count})
                </button>
              );
            })}
          </div>

          <h3 className="font-semibold text-slate-700 mb-3">Filter by HR Strategic Pillar</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedHRPillar('all')}
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                selectedHRPillar === 'all'
                  ? 'bg-gradient-to-r from-slate-700 to-slate-900 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All HR Pillars
            </button>
            {Object.keys(hrPillarColors).map(hrPillar => {
              const count = kpiData.filter(item => item.hrPillar === hrPillar).length;
              return (
                <button
                  key={hrPillar}
                  onClick={() => setSelectedHRPillar(hrPillar)}
                  className={`px-5 py-2.5 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                    selectedHRPillar === hrPillar
                      ? 'text-white shadow-lg'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                  style={selectedHRPillar === hrPillar ? { 
                    backgroundColor: hrPillarColors[hrPillar] 
                  } : {}}
                >
                  {hrPillar} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Analytics Charts */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {/* KPIs by Strategic Pillar */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              KPIs by Strategic Pillar
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={pillarSummary}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  angle={-20} 
                  textAnchor="end" 
                  height={80} 
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="kpiCount" fill="#3498DB" radius={[8, 8, 0, 0]} name="KPIs" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Distribution by HR Pillar */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              HR Strategic Pillars
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={hrPillarData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name.split(' ')[0]}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {hrPillarData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Status Distribution */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              KPI Status Overview
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Results Summary */}
        {filteredData.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-slate-700 mb-2">No KPIs Found</h3>
            <p className="text-slate-500">Try adjusting your filters to see more results</p>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-4 mb-6 text-white">
              <p className="text-center font-semibold">
                Showing {filteredData.length} of {kpiData.length} KPIs
                {selectedPillar !== 'all' && ` in ${selectedPillar}`}
                {selectedHRPillar !== 'all' && ` under ${selectedHRPillar}`}
              </p>
            </div>

            {/* KPI Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredData.map((kpi, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all transform hover:-translate-y-1 border-l-8"
                  style={{ borderLeftColor: pillarColors[kpi.companyPillar] }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="text-4xl">{kpi.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-800 text-xl mb-1">{kpi.kpi}</h3>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span 
                            className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                            style={{ backgroundColor: pillarColors[kpi.companyPillar] }}
                          >
                            {kpi.companyPillar}
                          </span>
                          <span 
                            className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                            style={{ backgroundColor: hrPillarColors[kpi.hrPillar] }}
                          >
                            {kpi.hrPillar}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${getStatusBadgeStyle(kpi.status)}`}>
                      {kpi.status}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                        Description
                      </p>
                      <p className="text-sm text-slate-700">{kpi.description}</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                        2025 Target
                      </p>
                      <p className="text-sm font-medium text-slate-800">{kpi.target}</p>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-slate-600 font-medium">Progress to Target</span>
                        <span className="font-bold text-slate-800 text-lg">
                          {kpi.currentValue}% / {kpi.targetValue}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-3 rounded-full transition-all duration-500 relative overflow-hidden"
                          style={{
                            width: `${Math.min((Math.abs(kpi.currentValue) / Math.abs(kpi.targetValue)) * 100, 100)}%`,
                            background: `linear-gradient(90deg, ${pillarColors[kpi.companyPillar]}, ${pillarColors[kpi.companyPillar]}dd)`
                          }}
                        >
                          <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Implementation Roadmap */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mt-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Brain className="w-7 h-7 text-purple-600" />
            2025 Implementation Roadmap
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
              <div className="text-2xl font-bold text-blue-900 mb-3">Q1 2025</div>
              <h3 className="font-bold text-blue-800 mb-3">Foundation Phase</h3>
              <ul className="text-sm text-blue-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Establish baseline metrics for all KPIs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Deploy tracking systems and dashboards</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Launch "Start Tracking" initiatives</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Train HR team and stakeholders</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
              <div className="text-2xl font-bold text-green-900 mb-3">Q2 2025</div>
              <h3 className="font-bold text-green-800 mb-3">Execution Phase</h3>
              <ul className="text-sm text-green-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">•</span>
                  <span>Roll out talent acquisition improvements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">•</span>
                  <span>Launch learning & development programs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">•</span>
                  <span>Monitor KPI progress monthly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">•</span>
                  <span>Adjust strategies based on data</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200">
              <div className="text-2xl font-bold text-purple-900 mb-3">Q3 2025</div>
              <h3 className="font-bold text-purple-800 mb-3">Optimization Phase</h3>
              <ul className="text-sm text-purple-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold">•</span>
                  <span>Scale successful initiatives</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold">•</span>
                  <span>Implement AI-driven processes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold">•</span>
                  <span>Mid-year performance reviews</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold">•</span>
                  <span>Report progress to leadership</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border-2 border-orange-200">
              <div className="text-2xl font-bold text-orange-900 mb-3">Q4 2025</div>
              <h3 className="font-bold text-orange-800 mb-3">Review Phase</h3>
              <ul className="text-sm text-orange-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 font-bold">•</span>
                  <span>Comprehensive year-end evaluation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 font-bold">•</span>
                  <span>Identify gaps and opportunities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 font-bold">•</span>
                  <span>Strategic planning for 2026</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 font-bold">•</span>
                  <span>Celebrate achievements and learnings</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-slate-500 text-sm">
          <p>HR Strategic KPI Dashboard • Last Updated: December 2024 • Next Review: Q1 2025</p>
        </div>
      </div>
    </div>
  );
};

export default HRKPIDashboard;
