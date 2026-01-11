
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Globe, 
  Key, 
  Loader2, 
  TrendingUp, 
  MousePointer2, 
  Eye, 
  Hash, 
  Sparkles, 
  Code2, 
  Copy, 
  Check, 
  Zap, 
  Target, 
  FileText, 
  Info, 
  Users, 
  Lightbulb, 
  Link, 
  X,
  Layers,
  ChevronRight,
  LayoutGrid,
  List as ListIcon,
  BarChart3,
  Dna,
  FileJson,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { geminiService } from '../services/geminiService';
import { SitePage, KeywordSuggestion, ContentBrief, SearchMetric, TopQuery } from '../types';
import SitemapGenerator from './SitemapGenerator';

interface PerformanceData {
  metrics: SearchMetric[];
  topQueries: TopQuery[];
  summary: {
    totalClicks: number;
    totalImpressions: number;
    avgCtr: number;
    avgPosition: number;
  };
}

const SERPPreview: React.FC<{ title: string; url: string; description: string }> = ({ title, url, description }) => {
  return (
    <div className="bg-ash border border-ash-border rounded-xl p-6 shadow-sm max-w-2xl">
      <div className="flex items-center space-x-2 mb-1">
        <div className="w-6 h-6 rounded-full bg-ash-light flex items-center justify-center">
          <Globe className="w-3.5 h-3.5 text-azure/40" />
        </div>
        <div className="flex flex-col">
          <span className="text-[12px] text-azure leading-tight font-sans">techpulse.io</span>
          <span className="text-[12px] text-azure/40 leading-tight font-sans truncate max-w-[300px]">{url}</span>
        </div>
      </div>
      <h3 className="text-[20px] text-azure hover:underline cursor-pointer mb-1 leading-tight font-sans font-normal">
        {title || 'Page Title Placeholder'}
      </h3>
      <p className="text-[14px] text-azure/60 leading-normal font-sans line-clamp-2">
        {description || 'Please enter a meta description to see how it looks in search results...'}
      </p>
    </div>
  );
};

const SEOTools: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'sitemap' | 'analysis' | 'keywords' | 'performance' | 'schema'>('keywords');
  const [keywordTopic, setKeywordTopic] = React.useState('');
  const [keywords, setKeywords] = React.useState<any[]>([]);
  const [isSuggesting, setIsSuggesting] = React.useState(false);
  const [activeBrief, setActiveBrief] = React.useState<any | null>(null);
  const [isGeneratingBrief, setIsGeneratingBrief] = React.useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'clusters'>('clusters');

  const [performanceData, setPerformanceData] = React.useState<PerformanceData | null>(null);
  const [isFetchingPerformance, setIsFetchingPerformance] = React.useState(false);

  const [schemaType, setSchemaType] = React.useState('Organization');
  const [schemaDetails, setSchemaDetails] = React.useState('');
  const [generatedSchema, setGeneratedSchema] = React.useState('');
  const [isGeneratingSchema, setIsGeneratingSchema] = React.useState(false);
  const [schemaCopied, setSchemaCopied] = React.useState(false);
  const [validationError, setValidationError] = React.useState<string | null>(null);

  const [pages, setPages] = React.useState<SitePage[]>([
    { id: '1', path: '/', priority: 1.0, lastModified: '2023-11-20', metaDescription: 'Official TechPulse homepage.' },
  ]);

  const clusters = useMemo(() => {
    const map: Record<string, any[]> = {};
    keywords.forEach(kw => {
      const c = kw.cluster || 'General';
      if (!map[c]) map[c] = [];
      map[c].push(kw);
    });
    return map;
  }, [keywords]);

  useEffect(() => {
    if (activeTab === 'performance' && !performanceData) {
      handleFetchPerformance();
    }
  }, [activeTab]);

  const handleFetchPerformance = async () => {
    setIsFetchingPerformance(true);
    try {
      const data = await geminiService.fetchSearchConsoleData('techpulse.io');
      setPerformanceData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetchingPerformance(false);
    }
  };

  const handleKeywordSuggestions = async () => {
    if (!keywordTopic) return;
    setIsSuggesting(true);
    try {
      const data = await geminiService.suggestKeywords(keywordTopic);
      setKeywords(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleGenerateBrief = async (keyword: string) => {
    setIsGeneratingBrief(keyword);
    try {
      const brief = await geminiService.generateContentBrief(keyword);
      setActiveBrief(brief);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingBrief(null);
    }
  };

  const validateSchema = (jsonString: string): string | null => {
    try {
      const parsed = JSON.parse(jsonString);
      if (typeof parsed !== 'object' || parsed === null) return "Schema must be a valid JSON object.";
      if (!parsed['@context']) return "Missing '@context' property (required for JSON-LD).";
      if (!parsed['@type']) return "Missing '@type' property (required for JSON-LD).";
      return null;
    } catch (e) {
      return "Invalid JSON syntax.";
    }
  };

  const handleGenerateSchema = async () => {
    if (!schemaDetails) return;
    setIsGeneratingSchema(true);
    setValidationError(null);
    setGeneratedSchema('');
    
    try {
      const result = await geminiService.generateSchemaMarkup(schemaType, schemaDetails);
      if (result) {
        const cleanJson = result.replace(/```json|```/g, '').trim();
        const error = validateSchema(cleanJson);
        if (error) {
          setValidationError(error);
          setGeneratedSchema(cleanJson);
        } else {
          setGeneratedSchema(cleanJson);
        }
      }
    } catch (err) {
      console.error(err);
      setValidationError("Failed to communicate with the AI engine.");
    } finally {
      setIsGeneratingSchema(false);
    }
  };

  const schemaTemplates: Record<string, string> = {
    'Organization': 'Name: TechPulse\nURL: https://techpulse.io\nLogo: https://techpulse.io/logo.png\nFounding Date: 2023\nSocial: https://twitter.com/techpulse, https://linkedin.com/company/techpulse',
    'LocalBusiness': 'Name: Urban Brew Coffee\nAddress: 123 Main St, New York, NY\nPhone: (555) 123-4567\nHours: Mon-Fri 7am-7pm, Sat-Sun 8am-5pm\nCuisine: Specialty Coffee',
    'Article': 'Headline: The Evolution of AI in Web Development\nAuthor: Alex Designer\nDate Published: 2023-11-20\nDescription: A deep dive into how large language models are transforming the way we build sites.',
    'Product': 'Name: Pro Keyboard X1\nPrice: $149.99\nCurrency: USD\nAvailability: In Stock\nDescription: High-performance mechanical keyboard for developers.\nRating: 4.8 (120 reviews)',
    'Event': 'Name: WebConf 2024\nDate: 2024-05-15 09:00 AM\nLocation: Moscone Center, San Francisco\nDescription: The premier conference for frontend and backend engineers.\nPrice: $299',
    'Recipe': 'Name: Classic Espresso Brownies\nAuthor: Chef Julian\nYield: 12 brownies\nPrep Time: 15 mins\nCook Time: 25 mins\nIngredients: Flour, sugar, cocoa, butter, espresso powder, eggs, chocolate chips'
  };

  const loadTemplate = () => {
    setSchemaDetails(schemaTemplates[schemaType] || '');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      {/* Side Panel for Content Brief */}
      {activeBrief && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-ash-medium shadow-2xl z-[60] border-l border-ash-border flex flex-col animate-in slide-in-from-right duration-300">
          <div className="p-6 border-b border-ash-border flex items-center justify-between btn-metallic text-azure font-bold">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-6 h-6" />
              <div>
                <h3 className="font-bold">AI Content Strategy Brief</h3>
                <p className="text-[10px] text-azure/40 uppercase tracking-widest">Advanced Roadmap</p>
              </div>
            </div>
            <button onClick={() => setActiveBrief(null)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-azure">
                <Target className="w-4 h-4" />
                <h4 className="text-[11px] font-bold uppercase tracking-wider">Target Keyword</h4>
              </div>
              <p className="text-2xl font-bold text-azure-bright">{activeBrief.keyword}</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-3 bg-ash p-6 rounded-2xl border border-ash-border">
                <div className="flex items-center space-x-2 text-azure">
                  <Users className="w-4 h-4 text-azure-dim" />
                  <h4 className="text-[11px] font-bold uppercase tracking-wider">Target Audience</h4>
                </div>
                <p className="text-azure/60 text-sm leading-relaxed">{activeBrief.audience}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-azure">
                  <FileText className="w-4 h-4" />
                  <h4 className="text-[11px] font-bold uppercase tracking-wider">Proposed Headline</h4>
                </div>
                <p className="text-azure font-semibold border-l-4 border-azure/40 pl-4 py-1 italic text-lg leading-relaxed">"{activeBrief.proposedHeadline}"</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-azure">
                <Lightbulb className="w-4 h-4" />
                <h4 className="text-[11px] font-bold uppercase tracking-wider">Key Talking Points</h4>
              </div>
              <ul className="space-y-3">
                {activeBrief.talkingPoints.map((point: string, i: number) => (
                  <li key={i} className="flex items-start space-x-3 text-sm text-azure/70 group">
                    <span className="w-6 h-6 rounded-full bg-ash-light text-azure flex items-center justify-center text-[10px] font-bold shrink-0 border border-azure/20">
                      {i + 1}
                    </span>
                    <span className="pt-0.5">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3 pt-4 border-t border-ash-border">
              <div className="flex items-center space-x-2 text-azure">
                <Dna className="w-4 h-4" />
                <h4 className="text-[11px] font-bold uppercase tracking-wider">Semantic Keywords (LSI)</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {activeBrief.semanticKeywords?.map((kw: string, i: number) => (
                  <span key={i} className="px-3 py-1.5 bg-ash-light border border-ash-border text-azure/60 text-[11px] font-medium rounded-lg">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="p-6 bg-ash border-t border-ash-border">
            <button className="w-full py-4 btn-metallic text-azure-light font-bold rounded-xl shadow-lg shadow-azure/5 transition-all flex items-center justify-center space-x-2 border border-azure/10">
              <Copy className="w-4 h-4" />
              <span>Copy Full Strategy</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Tab Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-azure">SEO Suite</h2>
          <p className="text-azure/40">Optimize your visibility and site authority.</p>
        </div>
        <div className="flex bg-ash-medium p-1 rounded-xl border border-ash-border shadow-sm overflow-x-auto">
          {['performance', 'keywords', 'schema', 'sitemap'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab ? 'btn-metallic text-white shadow-sm font-bold border border-azure/10' : 'text-azure/40 hover:text-azure'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'sitemap' && <SitemapGenerator />}

      {activeTab === 'keywords' && (
        <div className="space-y-8 animate-in slide-in-from-right-4">
          <div className="bg-ash-medium p-10 rounded-3xl border border-ash-border shadow-sm text-center space-y-8 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-azure">Keyword Pillar Explorer</h3>
              <p className="text-azure/40 max-w-lg mx-auto mb-8">Analyze your niche, cluster keywords by intent, and build a cohesive content pillar strategy.</p>
              <div className="flex max-w-2xl mx-auto space-x-2">
                <div className="relative flex-1">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-azure/20" />
                  <input 
                    type="text" 
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-ash border border-ash-border text-azure focus:outline-none focus:ring-2 focus:ring-azure/20 focus:border-azure transition-all" 
                    placeholder="Enter a topic" 
                    value={keywordTopic} 
                    onChange={(e) => setKeywordTopic(e.target.value)} 
                  />
                </div>
                <button 
                  onClick={handleKeywordSuggestions} 
                  disabled={isSuggesting || !keywordTopic} 
                  className="px-10 py-4 btn-metallic text-azure-light rounded-2xl font-bold hover:text-white transition-all flex items-center space-x-2 shadow-xl shadow-azure/5 border border-azure/10"
                >
                  {isSuggesting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Search className="w-5 h-5" /><span>Analyze Topic</span></>}
                </button>
              </div>
            </div>
            <Sparkles className="absolute -right-12 -top-12 w-48 h-48 text-azure/5 pointer-events-none" />
          </div>

          {keywords.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h4 className="text-lg font-bold text-azure flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-azure" />
                    Keyword Analysis Results
                  </h4>
                  <div className="flex bg-ash-medium p-1 rounded-lg border border-ash-border">
                    <button 
                      onClick={() => setViewMode('clusters')}
                      className={`p-1.5 rounded transition-all ${viewMode === 'clusters' ? 'btn-metallic text-white shadow' : 'text-azure/40 hover:text-azure'}`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 rounded transition-all ${viewMode === 'list' ? 'btn-metallic text-white shadow' : 'text-azure/40 hover:text-azure'}`}
                    >
                      <ListIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {viewMode === 'clusters' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(clusters).map(([name, kws]) => (
                    <div key={name} className="bg-ash-medium p-6 rounded-2xl border border-ash-border shadow-sm hover:border-azure/20 transition-all">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-2">
                          <Layers className="w-4 h-4 text-azure" />
                          <h5 className="font-bold text-azure">{name} Pillar</h5>
                        </div>
                        <span className="text-[10px] font-bold bg-ash-light text-azure/40 px-2 py-0.5 rounded-full border border-ash-border">{(kws as any[]).length}</span>
                      </div>
                      <div className="space-y-4">
                        {(kws as any[]).map((kw, idx) => (
                          <div key={idx} className="group p-3 rounded-xl bg-ash hover:bg-ash-light border border-ash-border transition-all cursor-pointer" onClick={() => handleGenerateBrief(kw.keyword)}>
                            <div className="flex justify-between items-start mb-2">
                              <p className="text-sm font-semibold text-azure group-hover:text-azure-bright transition-colors">{kw.keyword}</p>
                              <ChevronRight className="w-4 h-4 text-azure/20 group-hover:text-azure transition-all translate-x-0 group-hover:translate-x-1" />
                            </div>
                            <div className="space-y-1.5">
                              <div className="flex h-1.5 w-full bg-ash-light rounded-full overflow-hidden border border-ash-border">
                                <div className="bg-azure h-full" style={{ width: `${kw.value}%` }} />
                                <div className="bg-ash-light border-l border-ash-border h-full" style={{ width: `${kw.difficulty}%`, opacity: 0.5 }} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-ash-medium rounded-2xl border border-ash-border overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-ash-light/30 text-[10px] font-bold text-azure/40 uppercase tracking-widest border-b border-ash-border">
                        <th className="px-6 py-4">Keyword</th>
                        <th className="px-6 py-4">Search Stats</th>
                        <th className="px-6 py-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ash-border">
                      {keywords.map((kw, i) => (
                        <tr key={i} className="hover:bg-ash-light/20 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-bold text-azure">{kw.keyword}</p>
                              <p className="text-[10px] text-azure-bright uppercase font-bold mt-0.5">{kw.intent}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-azure font-mono">{kw.volume}</span>
                          </td>
                          <td className="px-6 py-4">
                            <button 
                              onClick={() => handleGenerateBrief(kw.keyword)}
                              disabled={isGeneratingBrief === kw.keyword}
                              className="px-4 py-2 btn-metallic text-azure-light rounded-lg text-xs font-bold hover:text-white transition-all border border-azure/10"
                            >
                              {isGeneratingBrief === kw.keyword ? <Loader2 className="w-3 h-3 animate-spin" /> : <span>Brief</span>}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4">
          {isFetchingPerformance ? (
            <div className="bg-ash-medium p-20 rounded-3xl border border-ash-border flex flex-col items-center justify-center text-center">
              <Loader2 className="w-12 h-12 text-azure animate-spin mb-4" />
              <p className="text-azure/60 font-medium">Connecting...</p>
            </div>
          ) : performanceData ? (
            <div className="bg-ash-medium p-8 rounded-3xl border border-ash-border shadow-sm">
              <h3 className="font-bold text-azure text-lg mb-8">Performance Trends</h3>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData.metrics}>
                    <defs>
                      <linearGradient id="colorAzure" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#60a5fa', opacity: 0.4, fontSize: 10}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#60a5fa', opacity: 0.4, fontSize: 10}} />
                    <Tooltip contentStyle={{backgroundColor: '#1e1e1e', border: '1px solid #333', borderRadius: '12px'}} />
                    <Area type="monotone" dataKey="clicks" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAzure)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {activeTab === 'schema' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4">
          <div className="bg-ash-medium p-8 rounded-3xl border border-ash-border shadow-sm space-y-6">
            <h3 className="font-bold text-azure flex items-center justify-between">
              <div className="flex items-center">
                <Code2 className="w-5 h-5 mr-2 text-azure" />
                Schema Generator
              </div>
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-azure/30 uppercase tracking-wider">Type</label>
                <select className="w-full px-4 py-3 rounded-xl bg-ash border border-ash-border text-azure text-sm focus:outline-none focus:ring-1 focus:ring-azure/40" value={schemaType} onChange={(e) => setSchemaType(e.target.value)}>
                  <option>Organization</option>
                  <option>LocalBusiness</option>
                  <option>Article</option>
                  <option>Product</option>
                </select>
              </div>
              <textarea className="w-full h-40 p-4 rounded-xl bg-ash border border-ash-border text-azure text-sm resize-none focus:outline-none focus:ring-1 focus:ring-azure/40" value={schemaDetails} onChange={(e) => setSchemaDetails(e.target.value)} placeholder="Enter details..." />
            </div>
            <button onClick={handleGenerateSchema} disabled={isGeneratingSchema || !schemaDetails} className="w-full py-4 btn-metallic text-white rounded-xl font-bold transition-colors border border-azure/10 shadow-lg shadow-azure/5">
              {isGeneratingSchema ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Generate JSON-LD</span>}
            </button>
          </div>
          <div className="space-y-4">
            {generatedSchema && (
              <div className="bg-ash rounded-3xl p-8 shadow-2xl border border-ash-border">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-green-400">Validated Schema</span>
                </div>
                <pre className="font-mono text-[10px] overflow-y-auto max-h-[400px] p-4 bg-black/20 rounded-xl border border-ash-border text-azure-light leading-relaxed">
                  {generatedSchema}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SEOTools;
