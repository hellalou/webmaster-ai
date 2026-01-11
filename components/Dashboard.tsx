
import React from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';
import { Activity, Globe, Zap, Users, BarChart3 } from 'lucide-react';

const data = [
  { name: 'Mon', visits: 400, load: 240 },
  { name: 'Tue', visits: 300, load: 139 },
  { name: 'Wed', visits: 200, load: 980 },
  { name: 'Thu', visits: 278, load: 390 },
  { name: 'Fri', visits: 189, load: 480 },
  { name: 'Sat', visits: 239, load: 380 },
  { name: 'Sun', visits: 349, load: 430 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center space-x-3 mb-2">
        <BarChart3 className="w-6 h-6 text-azure" />
        <h2 className="text-2xl font-bold text-azure">Performance Overview</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Visits', value: '12,450', change: '+12.5%', icon: Users, color: 'text-azure', bg: 'bg-ash-medium' },
          { label: 'Site Health', value: '98.2%', change: '+0.4%', icon: Activity, color: 'text-green-400', bg: 'bg-ash-medium' },
          { label: 'Active Domains', value: '3', change: 'Stable', icon: Globe, color: 'text-azure', bg: 'bg-ash-medium' },
          { label: 'Load Speed', value: '1.2s', change: '-0.2s', icon: Zap, color: 'text-azure', bg: 'bg-ash-medium' },
        ].map((stat, i) => (
          <div key={i} className={`${stat.bg} p-6 rounded-2xl border border-ash-border shadow-sm hover:border-azure/30 transition-all`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-ash-light ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                stat.change.startsWith('+') ? 'bg-green-400/10 text-green-400' : 
                stat.change.startsWith('-') ? 'bg-red-500/10 text-red-500' : 'bg-ash-light text-azure/40'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-azure/40 text-sm font-medium">{stat.label}</h3>
            <p className="text-2xl font-bold text-azure mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-ash-medium p-6 rounded-2xl border border-ash-border shadow-sm">
          <h3 className="text-lg font-bold text-azure mb-6">Traffic Analysis</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#60a5fa', opacity: 0.6, fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#60a5fa', opacity: 0.6, fontSize: 12}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#1e1e1e', borderRadius: '12px', border: '1px solid #333', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', color: '#60a5fa'}}
                  itemStyle={{color: '#93c5fd'}}
                />
                <Area type="monotone" dataKey="visits" stroke="#3b82f6" fillOpacity={1} fill="url(#colorVisits)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-ash-medium p-6 rounded-2xl border border-ash-border shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-azure mb-4">Recent Events</h3>
          <div className="space-y-4 flex-1">
            {[
              { type: 'deployment', msg: 'V1.2.4 deployed to staging', time: '12m ago', color: 'bg-azure' },
              { type: 'domain', msg: 'myawesomesite.io registered', time: '2h ago', color: 'bg-green-500' },
              { type: 'blog', msg: 'Scheduled: "Future of AI"', time: '5h ago', color: 'bg-azure-dim' },
              { type: 'alert', msg: 'SSL Certificate renewed', time: '1d ago', color: 'bg-red-500' },
            ].map((event, i) => (
              <div key={i} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-ash-light transition-colors">
                <div className={`w-2 h-2 mt-2 rounded-full ${event.color}`} />
                <div>
                  <p className="text-sm font-medium text-azure-light">{event.msg}</p>
                  <p className="text-xs text-azure/40">{event.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-6 w-full py-3 text-sm font-semibold text-azure bg-ash-light rounded-xl hover:btn-metallic hover:text-white transition-all border border-azure/20">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
