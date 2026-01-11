
import React, { useState } from 'react';
import { Server, Cpu, Database, Cloud, RefreshCw, Terminal, CheckCircle2, Clock, Code, FileSearch } from 'lucide-react';
import { HostingDeployment } from '../types';
import CodeEditor from './CodeEditor';

const HostingDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'editor'>('overview');
  const deployments: HostingDeployment[] = [
    { id: 'dep-1', environment: 'production', status: 'success', timestamp: '2023-11-15 14:30', commit: 'a4f32e1' },
    { id: 'dep-2', environment: 'production', status: 'success', timestamp: '2023-11-14 10:15', commit: '9c2d1b4' },
    { id: 'dep-3', environment: 'staging', status: 'building', timestamp: 'Just now', commit: '8e5f7a2' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-azure">Hosting & Infrastructure</h2>
          <p className="text-azure/40">Manage your server, deployments, and files.</p>
        </div>
        <div className="flex bg-ash-medium p-1 rounded-xl border border-ash-border shadow-sm overflow-x-auto">
          <button 
            onClick={() => setActiveSection('overview')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeSection === 'overview' ? 'btn-metallic text-white shadow-sm font-bold' : 'text-azure/40 hover:text-azure'
            }`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveSection('editor')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center space-x-2 ${
              activeSection === 'editor' ? 'btn-metallic text-white shadow-sm font-bold' : 'text-azure/40 hover:text-azure'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Code Editor & FTP</span>
          </button>
        </div>
      </div>

      {activeSection === 'overview' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'CPU Usage', value: '24%', icon: Cpu, color: 'bg-azure text-white' },
              { label: 'Memory', value: '1.2 GB / 2 GB', icon: Database, color: 'bg-azure-dim text-white' },
              { label: 'Disk Space', value: '45 GB / 100 GB', icon: Cloud, color: 'bg-ash-light text-azure border border-azure/20' },
            ].map((stat, i) => (
              <div key={i} className="bg-ash-medium p-6 rounded-2xl border border-ash-border shadow-sm">
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`p-3 rounded-xl ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-azure/40 font-medium">{stat.label}</h3>
                </div>
                <p className="text-2xl font-bold text-azure">{stat.value}</p>
                <div className="w-full bg-ash h-2 rounded-full mt-4 overflow-hidden border border-ash-border">
                  <div 
                    className={`h-full ${stat.color.includes('bg-azure') ? 'bg-azure' : 'bg-azure-dim'}`} 
                    style={{ width: stat.value.includes('%') ? stat.value : '45%' }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-ash rounded-2xl overflow-hidden shadow-xl border border-ash-border">
            <div className="px-6 py-4 bg-ash-medium flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-azure/40" />
                <span className="text-sm font-semibold text-azure-light">Deployment Logs</span>
              </div>
              <button className="text-xs btn-metallic text-white px-3 py-1.5 rounded-md hover:opacity-90 transition-all flex items-center space-x-1 font-bold border border-azure/20">
                <RefreshCw className="w-3 h-3" />
                <span>Rollback</span>
              </button>
            </div>
            <div className="p-6 font-mono text-xs space-y-2 text-azure/60">
              <p><span className="text-azure/20">[14:30:01]</span> Fetching latest changes from main branch...</p>
              <p><span className="text-azure/20">[14:30:05]</span> Building production assets...</p>
              <p><span className="text-green-400">[14:30:12] Optimized 45 images successfully.</span></p>
              <p><span className="text-azure/20">[14:30:15]</span> Deploying to global edge network...</p>
              <p><span className="text-azure font-bold">[14:30:20] Site is LIVE at techpulse.io</span></p>
            </div>
          </div>

          <div className="bg-ash-medium rounded-2xl border border-ash-border p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-6 text-azure">Recent Deployments</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-azure/20 text-sm border-b border-ash-border">
                    <th className="pb-4 font-medium">Deployment ID</th>
                    <th className="pb-4 font-medium">Environment</th>
                    <th className="pb-4 font-medium">Status</th>
                    <th className="pb-4 font-medium">Commit</th>
                    <th className="pb-4 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ash-border">
                  {deployments.map((dep) => (
                    <tr key={dep.id} className="group hover:bg-ash-light transition-colors">
                      <td className="py-4 font-semibold text-azure-light">{dep.id}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold border ${
                          dep.environment === 'production' ? 'bg-azure/10 text-azure border-azure/20' : 'bg-ash-light text-azure/40 border-ash-border'
                        }`}>
                          {dep.environment}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center space-x-1">
                          {dep.status === 'success' ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : (
                            <RefreshCw className="w-4 h-4 text-azure animate-spin" />
                          )}
                          <span className="text-sm font-medium capitalize text-azure/60">{dep.status}</span>
                        </div>
                      </td>
                      <td className="py-4 text-azure/40 text-sm">{dep.commit}</td>
                      <td className="py-4 text-azure/20 text-sm flex items-center">
                        <Clock className="w-3 h-3 mr-1.5" />
                        {dep.timestamp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <CodeEditor />
      )}
    </div>
  );
};

export default HostingDashboard;
