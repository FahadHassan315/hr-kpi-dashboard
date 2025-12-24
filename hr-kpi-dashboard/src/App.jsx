import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Target } from 'lucide-react';

const HRKPIDashboard = () => {
  const [selectedFunction, setSelectedFunction] = useState('all');
  
  const kpiData = [
    {
      hrFunction: 'Talent Acquisition',
      kpi: 'Hiring Quality',
      companyPillar: 'Financial Performance',
      target: '20% of hires meeting or exceeding performance expectations',
      currentValue: 0,
      targetValue: 20,
      status: 'Start Tracking',
      icon: '👥'
    },
    {
      hrFunction: 'Talent Acquisition',
      kpi: 'People Turnover Rate',
      companyPillar: 'Financial Performance',
      target: 'Reduce turnover rate by 5%',
      currentValue: 0,
      targetValue: 5,
      status: 'In Progress',
      icon: '📉'
    },
    {
      hrFunction: 'Talent Acquisition',
      kpi: 'Time to Fill',
      companyPillar: 'Financial Performance',
      target: 'Reduce average time to fill critical positions by 5%',
      currentValue: 0,
      targetValue: 5,
      status: 'In Progress',
      icon: '⏱️'
    },
    {
      hrFunction: 'Learning',
      kpi: 'Employee Development Index',
      companyPillar: 'Financial Performance',
      target: 'Increase by 5% from baseline',
      currentValue: 0,
      targetValue: 5,
      status: 'Start Tracking',
      icon: '📈'
    },
    {
      hrFunction: 'Learning',
      kpi: 'AI Training for Employees',
      companyPillar: 'AI',
      target: '35% of permanent employees trained in AI tools',
      currentValue: 0,
      targetValue: 35,
      status: 'In Progress',
      icon: '🎓'
    },
    {
      hrFunction: 'Learning',
      kpi: 'Talent Development',
      companyPillar: 'AI',
      target: '60% completion rate of skill development',
      currentValue: 0,
      targetValue: 60,
      status: 'In Progress',
      icon: '📚'
    },
    {
      hrFunction: 'Talent Management',
      kpi: 'Employee Engagement Score',
      companyPillar: 'People',
      target: 'Achieve at least 20% engagement',
      currentValue: 0,
      targetValue: 20,
      status: 'In Progress',
      icon: '💪'
    },
    {
      hrFunction: 'Talent Management',
      kpi: 'Employee Development Index',
      companyPillar: 'Financial Performance',
      target: 'Increase by 5% from baseline',
      currentValue: 0,
      targetValue: 5,
      status: 'Start Tracking',
      icon: '📊'
    },
    {
      hrFunction: 'Talent Management',
      kpi: 'Talent Development',
      companyPillar: 'AI',
      target: '60% completion rate of skill development',
      currentValue: 0,
      targetValue: 60,
      status: 'In Progress',
      icon: '🎯'
    }
  ];

  const functionColors = {
    'Talent Acquisition': '#3498DB',
    'Learning': '#9B59B6',
    'Talent Management': '#E74C3C'
  };

  const filteredData = selectedFunction === 'all' 
    ? kpiData 
    : kpiData.filter(item => item.hrFunction === selectedFunction);

  const functionSummary = [
    {
      name: 'Talent Acquisition',
      kpiCount: kpiData.filter(item => item.hrFunction === 'Talent Acquisition').length
    },
    {
      name: 'Learning',
      kpiCount: kpiData.filter(item => item.hrFunction === 'Learning').length
    },
    {
      name: 'Talent Management',
      kpiCount: kpiData.filter(item => item.hrFunction === 'Talent Management').length
    }
  ];

  const companyPillarData = [
    { 
      name: 'Financial Performance', 
      value: kpiData.filter(k => k.companyPillar === 'Financial Performance').length 
    },
    { 
      name: 'People', 
      value: kpiData.filter(k => k.companyPillar === 'People').length 
    },
    { 
      name: 'AI', 
      value: kpiData.filter(k => k.companyPillar === 'AI').length 
    }
  ];

  const COLORS = ['#E67E22', '#E74C3C', '#9B59B6'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                HR Strategic KPI Dashboard 2025
              </h1>
              <p className="text-slate-600">
                Track and monitor your HR objectives by function
              </p>
            </div>
            <Target className="w-12 h-12 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-slate-600 mb-3">Filter by HR Function:</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedFunction('all')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                selectedFunction === 'all'
                  ? 'bg-slate-700 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Functions ({kpiData.length})
            </button>
            <button
              onClick={() => setSelectedFunction('Talent Acquisition')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                selectedFunction === 'Talent Acquisition'
                  ? 'text-white shadow-lg'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              style={selectedFunction === 'Talent Acquisition' ? { backgroundColor: '#3498DB' } : {}}
            >
              Talent Acquisition (3)
            </button>
            <button
              onClick={() => setSelectedFunction('Learning')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                selectedFunction === 'Learning'
                  ? 'text-white shadow-lg'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              style={selectedFunction === 'Learning' ? { backgroundColor: '#9B59B6' } : {}}
            >
              Learning (3)
            </button>
            <button
              onClick={() => setSelectedFunction('Talent Management')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                selectedFunction === 'Talent Management'
                  ? 'text-white shadow-lg'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              style={selectedFunction === 'Talent Management' ? { backgroundColor: '#E74C3C' } : {}}
            >
              Talent Management (3)
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">KPIs by HR Function</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={functionSummary}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-15} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="kpiCount" fill="#3498DB" name="Number of KPIs" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">KPIs by Company Strategic Pillar</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={companyPillarData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {companyPillarData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-2xl font-bold text-slate-800">
            {selectedFunction === 'all' ? 'All KPIs' : `${selectedFunction} KPIs`}
          </h2>
          <p className="text-slate-600">
            Showing {filteredData.length} KPI{filteredData.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {filteredData.map((kpi, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-t-4"
              style={{ borderTopColor: functionColors[kpi.hrFunction] }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="text-3xl mb-2">{kpi.icon}</div>
                  <h3 className="font-bold text-slate-800 text-lg mb-1">{kpi.kpi}</h3>
                  <div className="inline-block px-2 py-1 rounded-md text-xs font-medium mb-2"
                       style={{ backgroundColor: functionColors[kpi.hrFunction] + '20', color: functionColors[kpi.hrFunction] }}>
                    {kpi.hrFunction}
                  </div>
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
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Company Pillar:</span>
                    <span className="font-medium text-slate-800 text-xs">{kpi.companyPillar}</span>
                  </div>
                </div>

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
                        width: `${(Math.abs(kpi.currentValue) / Math.abs(kpi.targetValue)) * 100}%`,
                        backgroundColor: functionColors[kpi.hrFunction]
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
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
      </div>
    </div>
  );
};

export default HRKPIDashboard;
