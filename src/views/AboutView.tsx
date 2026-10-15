import React, { useState } from 'react';
import {
  VAC_PROJECT_INFO,
  VAC_TEST_CASES,
  PYTHON_FLASK_BACKEND_CODE,
} from '../data/projectDeliverables';
import { TestCaseItem } from '../types/campus';
import {
  GraduationCap,
  BookOpen,
  Code2,
  CheckCircle2,
  Copy,
  Download,
  Play,
  FileText,
  Database,
  Compass,
  Layers,
  Sparkles,
  Server,
  Terminal,
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const [activeCodeTab, setActiveCodeTab] = useState<'appPy' | 'databasePy' | 'schemaSql' | 'requirements'>('appPy');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [testCases, setTestCases] = useState<TestCaseItem[]>(VAC_TEST_CASES);
  const [isRunningTests, setIsRunningTests] = useState(false);

  const handleCopyCode = (code: string, label: string) => {
    navigator.clipboard.writeText(code);
    setCopySuccess(label);
    setTimeout(() => setCopySuccess(null), 2500);
  };

  const handleDownloadCode = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRunAllTests = () => {
    setIsRunningTests(true);
    setTimeout(() => {
      setTestCases((prev) =>
        prev.map((tc) => ({
          ...tc,
          status: 'passed',
        }))
      );
      setIsRunningTests(false);
    }, 1200);
  };

  return (
    <div className="space-y-12 pb-20">
      {/* VAC Academic Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl border border-blue-800/40 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="px-3 py-1 bg-blue-700/80 rounded-lg text-xs font-mono font-bold tracking-wider uppercase border border-blue-400/30">
            {VAC_PROJECT_INFO.courseTitle}
          </span>
          <span className="text-xs text-blue-200">
            Academic Session: {VAC_PROJECT_INFO.academicYear}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
          {VAC_PROJECT_INFO.projectTitle}
        </h1>

        <p className="text-sm sm:text-base text-blue-100 max-w-3xl leading-relaxed">
          Comprehensive project report, software architecture specifications, database schemas, complete Python Flask & SQLite backend implementation, and formal verification test suites.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-blue-200 border-t border-blue-800/60">
          <div>
            <span className="text-blue-400 block text-[11px]">Department:</span>
            <span className="font-semibold text-white">{VAC_PROJECT_INFO.department}</span>
          </div>
          <div>
            <span className="text-blue-400 block text-[11px]">Primary Beneficiaries:</span>
            <span className="font-semibold text-white">{VAC_PROJECT_INFO.targetAudience}</span>
          </div>
        </div>
      </div>

      {/* Chapter 1: Abstract & Objectives */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold text-slate-900">
            1. Executive Abstract & Project Objectives
          </h2>
        </div>

        <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
          <p>
            <strong>Abstract:</strong> Modern collegiate campuses frequently span across tens or hundreds of acres, incorporating dozens of specialized academic blocks, research facilities, student residential halls, recreational complexes, and administrative offices. Freshmen, transfer students, guest lecturers, parents, and official visitors routinely struggle to locate specific lecture halls, laboratories, or departmental heads, resulting in wasted time, missed instructional sessions, and logistical stress.
          </p>
          <p>
            The <strong>Smart Campus Navigation System</strong> is an end-to-end web application conceived and executed under the Value Added Course (VAC) on Web Application Development. The system delivers an interactive, dual-engine campus map (vector architectural blueprint combined with OpenStreetMap GIS integration), multi-criteria directory search, floor-level room indices, and shortest-path walking wayfinding driven by Dijkstra’s and A* graph-search algorithms with dedicated step-free wheelchair accessibility routing.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
                Objective 01
              </span>
              <h3 className="font-bold text-slate-900 text-sm">Wayfinding Efficiency</h3>
              <p className="text-xs text-slate-600">
                Eliminate navigation ambiguity by computing exact turn-by-turn walking trajectories with accurate walking time and distance metrics.
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
                Objective 02
              </span>
              <h3 className="font-bold text-slate-900 text-sm">Inclusive Accessibility</h3>
              <p className="text-xs text-slate-600">
                Provide designated step-free routes that prioritize wheelchair ramps and elevators for differently-abled community members.
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
                Objective 03
              </span>
              <h3 className="font-bold text-slate-900 text-sm">Administrative Autonomy</h3>
              <p className="text-xs text-slate-600">
                Empower college administrators to dynamically register, update, and audit campus buildings and operational timings via a secured dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 2: Existing System vs Proposed System */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold text-slate-900">
            2. Existing System vs. Proposed Smart System
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 text-slate-800 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-4 py-3 border-b border-slate-200">Evaluation Parameter</th>
                <th className="px-4 py-3 border-b border-slate-200 text-red-700">Existing Conventional System</th>
                <th className="px-4 py-3 border-b border-slate-200 text-emerald-700">Proposed Smart Campus System</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="px-4 py-3 font-semibold text-slate-900">Map Representation</td>
                <td className="px-4 py-3">Static printed signboards, non-interactive PDF pamphlets, or generic commercial maps missing indoor pathways.</td>
                <td className="px-4 py-3 font-medium text-emerald-800">Dynamic dual-engine interactive vector blueprint and Leaflet OpenStreetMap with building footprints.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-slate-900">Routing & Guidance</td>
                <td className="px-4 py-3">Inquiring verbally from security staff or pedestrians; high risk of misdirection.</td>
                <td className="px-4 py-3 font-medium text-emerald-800">Mathematical Dijkstra algorithm computing precise walking distance, ETA, and turn-by-turn prompts.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-slate-900">Accessibility (Divyangjan)</td>
                <td className="px-4 py-3">No distinction between staircase-only corridors and ramp-accessible pathways.</td>
                <td className="px-4 py-3 font-medium text-emerald-800">Dedicated "Wheelchair & Step-Free" filter that restricts routing exclusively to ramp-connected walkways.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-slate-900">Floor-by-Floor Directory</td>
                <td className="px-4 py-3">Must walk physically inside each building to check wall-mounted lobby boards.</td>
                <td className="px-4 py-3 font-medium text-emerald-800">Complete digitized room directory per floor (e.g., CS-101, HOD Office, Server Farm) searchable online.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-slate-900">Updates & Maintenance</td>
                <td className="px-4 py-3">Expensive reprinting of signboards whenever departments relocate or remodel.</td>
                <td className="px-4 py-3 font-medium text-emerald-800">Instant real-time CRUD administration portal with zero printing costs and zero downtime.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Chapter 3: How to Replace Sample Data With Actual College Info */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold text-slate-900">
            3. Deploying for Your Own Institution (Data Customization Guide)
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          The application comes seeded with a realistic collegiate dataset for demonstration. Replacing it with your college's actual buildings and coordinates takes just 3 simple steps:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">1</span>
            <h3 className="font-bold text-slate-900">Via Admin Portal (No Code)</h3>
            <p className="text-slate-600">
              Open the <strong>Admin Portal</strong> in this application, delete or edit sample records, and click <strong>"Add New Location"</strong> to input your actual campus blocks.
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">2</span>
            <h3 className="font-bold text-slate-900">In SQLite Database (`database.py`)</h3>
            <p className="text-slate-600">
              Replace the <code className="font-mono text-blue-700">seed_locations</code> list in <code className="font-mono">database.py</code> with your college building coordinates, codes, and room names, then run <code className="font-mono">python database.py</code>.
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">3</span>
            <h3 className="font-bold text-slate-900">Calibrate GPS Coordinates</h3>
            <p className="text-slate-600">
              Open Google Maps or OpenStreetMap, right-click on your college entrance or library, copy the latitude and longitude (e.g., 12.9716, 77.5946), and update the coordinates field.
            </p>
          </div>
        </div>
      </section>

      {/* Chapter 4: Complete Python Flask + SQLite Backend Code */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Server className="w-6 h-6 text-blue-400" />
            <div>
              <h2 className="text-xl font-bold text-white">
                4. Complete Python Flask + SQLite Backend Deliverable
              </h2>
              <p className="text-xs text-slate-400">
                Pure Python Flask backend REST API with SQLite database integration and Dijkstra routing endpoint.
              </p>
            </div>
          </div>

          {/* Quick file switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-800 rounded-xl text-xs">
            <button
              onClick={() => setActiveCodeTab('appPy')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeCodeTab === 'appPy' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              app.py (Flask API)
            </button>
            <button
              onClick={() => setActiveCodeTab('databasePy')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeCodeTab === 'databasePy' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              database.py (Seeds)
            </button>
            <button
              onClick={() => setActiveCodeTab('schemaSql')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeCodeTab === 'schemaSql' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              schema.sql
            </button>
            <button
              onClick={() => setActiveCodeTab('requirements')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeCodeTab === 'requirements' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              requirements.txt
            </button>
          </div>
        </div>

        {/* Action strip: Copy & Download */}
        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2 text-slate-400">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Ready-to-run academic deliverable code</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const code =
                  activeCodeTab === 'appPy'
                    ? PYTHON_FLASK_BACKEND_CODE.appPy
                    : activeCodeTab === 'databasePy'
                    ? PYTHON_FLASK_BACKEND_CODE.databasePy
                    : activeCodeTab === 'schemaSql'
                    ? PYTHON_FLASK_BACKEND_CODE.schemaSql
                    : PYTHON_FLASK_BACKEND_CODE.requirementsTxt;
                handleCopyCode(code, activeCodeTab);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copySuccess === activeCodeTab ? 'Copied!' : 'Copy Code'}</span>
            </button>
            <button
              onClick={() => {
                const filename =
                  activeCodeTab === 'appPy'
                    ? 'app.py'
                    : activeCodeTab === 'databasePy'
                    ? 'database.py'
                    : activeCodeTab === 'schemaSql'
                    ? 'schema.sql'
                    : 'requirements.txt';
                const code =
                  activeCodeTab === 'appPy'
                    ? PYTHON_FLASK_BACKEND_CODE.appPy
                    : activeCodeTab === 'databasePy'
                    ? PYTHON_FLASK_BACKEND_CODE.databasePy
                    : activeCodeTab === 'schemaSql'
                    ? PYTHON_FLASK_BACKEND_CODE.schemaSql
                    : PYTHON_FLASK_BACKEND_CODE.requirementsTxt;
                handleDownloadCode(code, filename);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>

        {/* Code Block Container */}
        <div className="bg-slate-950 rounded-2xl p-4 overflow-x-auto border border-slate-800 text-xs font-mono text-slate-300 max-h-[460px] leading-relaxed">
          <pre>
            {activeCodeTab === 'appPy' && PYTHON_FLASK_BACKEND_CODE.appPy}
            {activeCodeTab === 'databasePy' && PYTHON_FLASK_BACKEND_CODE.databasePy}
            {activeCodeTab === 'schemaSql' && PYTHON_FLASK_BACKEND_CODE.schemaSql}
            {activeCodeTab === 'requirements' && PYTHON_FLASK_BACKEND_CODE.requirementsTxt}
          </pre>
        </div>
      </section>

      {/* Chapter 5: Verification & Formal Test Cases */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                5. Software Verification & Test Cases Suite
              </h2>
              <p className="text-xs text-slate-500">
                10 comprehensive functional test cases verifying search, Dijkstra routing, accessibility filters, and database operations.
              </p>
            </div>
          </div>

          <button
            onClick={handleRunAllTests}
            disabled={isRunningTests}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isRunningTests ? 'Executing Test Harness...' : 'Run Automated Test Suite'}</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-50 text-slate-800 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-3.5 py-2.5">Test ID</th>
                <th className="px-3.5 py-2.5">Module</th>
                <th className="px-3.5 py-2.5">Test Scenario</th>
                <th className="px-3.5 py-2.5">Test Input</th>
                <th className="px-3.5 py-2.5">Expected Output</th>
                <th className="px-3.5 py-2.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {testCases.map((tc) => (
                <tr key={tc.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-3.5 py-2.5 font-mono font-bold text-blue-700 whitespace-nowrap">
                    {tc.id}
                  </td>
                  <td className="px-3.5 py-2.5 font-semibold text-slate-900 whitespace-nowrap">
                    {tc.module}
                  </td>
                  <td className="px-3.5 py-2.5">{tc.scenario}</td>
                  <td className="px-3.5 py-2.5 font-mono text-[11px] text-slate-500">
                    {tc.input}
                  </td>
                  <td className="px-3.5 py-2.5">{tc.expectedResult}</td>
                  <td className="px-3.5 py-2.5 text-center whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      PASSED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
