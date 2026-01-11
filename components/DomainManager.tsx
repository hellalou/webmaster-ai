
import React from 'react';
import { Search, Plus, Globe, ShieldCheck, Loader2 } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { Domain } from '../types';

const DomainManager: React.FC = () => {
  const [query, setQuery] = React.useState('');
  const [isSearching, setIsSearching] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [registeredDomains, setRegisteredDomains] = React.useState<Domain[]>([
    { id: '1', name: 'techpulse.io', status: 'active', expiryDate: '2025-06-12', autoRenew: true },
    { id: '2', name: 'creativedesign.co', status: 'active', expiryDate: '2024-12-01', autoRenew: false },
  ]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setIsSearching(true);
    try {
      const results = await geminiService.suggestDomains(query);
      setSuggestions(results);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  const registerDomain = (name: string) => {
    const newDomain: Domain = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      status: 'active',
      expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      autoRenew: true
    };
    setRegisteredDomains([...registeredDomains, newDomain]);
    setSuggestions(suggestions.filter(s => s !== name));
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-ash-medium rounded-3xl p-10 text-azure-light relative overflow-hidden shadow-2xl border border-ash-border">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-4 text-azure">Find your perfect identity.</h2>
          <p className="text-azure/60 mb-8 max-w-lg font-medium">
            Register new domains instantly with AI-powered suggestions and secure SSL hosting.
          </p>
          <form onSubmit={handleSearch} className="flex max-w-xl group">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-azure/30 group-focus-within:text-azure transition-colors" />
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for a domain name..."
                className="w-full pl-12 pr-4 py-4 rounded-l-2xl bg-ash border border-ash-border text-azure focus:outline-none focus:ring-2 focus:ring-azure/20 focus:border-azure transition-all"
              />
            </div>
            <button 
              type="submit"
              disabled={isSearching}
              className="btn-metallic px-8 rounded-r-2xl font-bold text-azure-light hover:text-white transition-colors flex items-center space-x-2 border border-azure/10 shadow-lg shadow-azure/5"
            >
              {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Search</span>}
            </button>
          </form>
        </div>
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-5 pointer-events-none">
          <Globe className="w-full h-full scale-150 rotate-12 text-azure" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Domains */}
        <div className="bg-ash-medium rounded-2xl border border-ash-border p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center text-azure">
            <ShieldCheck className="w-5 h-5 mr-2 text-azure" />
            My Active Domains
          </h3>
          <div className="space-y-4">
            {registeredDomains.map((domain) => (
              <div key={domain.id} className="flex items-center justify-between p-4 bg-ash rounded-xl border border-ash-border group hover:border-azure/30 transition-all">
                <div>
                  <p className="font-bold text-azure text-lg">{domain.name}</p>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-green-400/10 text-green-400 rounded-full border border-green-400/20 uppercase">Active</span>
                    <span className="text-xs text-azure/40">Renews: {domain.expiryDate}</span>
                  </div>
                </div>
                <button className="text-sm font-medium text-azure hover:text-azure-bright transition-colors">
                  Manage
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Suggestions */}
        <div className="bg-ash-medium rounded-2xl border border-ash-border p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-6 text-azure">AI Recommended</h3>
          <div className="space-y-4">
            {isSearching ? (
              <div className="py-12 flex flex-col items-center justify-center text-azure/20">
                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                <p className="text-sm">Gemini is finding the best extensions...</p>
              </div>
            ) : suggestions.length > 0 ? (
              suggestions.map((name, i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-ash-light rounded-xl transition-colors border border-transparent hover:border-ash-border">
                  <p className="font-semibold text-azure-light">{name}</p>
                  <div className="flex items-center space-x-4">
                    <span className="text-azure-bright font-bold">$12.99<span className="text-[10px] font-normal text-azure/30">/yr</span></span>
                    <button 
                      onClick={() => registerDomain(name)}
                      className="p-2 btn-metallic text-azure-light hover:text-white rounded-lg transition-all border border-ash-border"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-azure/20">
                <p>Search above to see AI suggestions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DomainManager;
