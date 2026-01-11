
import React, { useState, useEffect, useRef } from 'react';
import { Search, Download, Copy, CheckCircle, RefreshCw, Globe, ArrowUpRight, Check, Type as TypeIcon, Save, Loader2, FileText, Info, Wand2, Trash2 } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { SitePage } from '../types';

const SitemapGenerator: React.FC = () => {
  const [pages, setPages] = React.useState<SitePage[]>([]);
  const [discoveryUrl, setDiscoveryUrl] = React.useState('');
  const [isDiscovering, setIsDiscovering] = React.useState(false);
  const [isRegenerating, setIsRegenerating] = React.useState(false);
  const [isCopied, setIsCopied] = React.useState(false);
  const [saveStatus, setSaveStatus] = React.useState<'idle' | 'saving' | 'saved'>('idle');
  const saveTimeoutRef = useRef<number | null>(null);

  // Initial data with persistence
  useEffect(() => {
    const savedPages = localStorage.getItem('webmaster_sitemap_pages');
    if (savedPages) {
      setPages(JSON.parse(savedPages));
    } else {
      setPages([
        { id: '1', path: '/', priority: 1.0, lastModified: '2023-11-20', titleTag: 'Home | TechPulse', metaDescription: 'Official TechPulse homepage for high-performance web solutions.' },
        { id: '2', path: '/blog', priority: 0.8, lastModified: '2023-11-19', titleTag: 'Blog | Insights and Updates', metaDescription: 'Stay updated with the latest in AI and web development.' },
        { id: '3', path: '/services', priority: 0.8, lastModified: '2023-11-18', titleTag: 'Our Services | Professional Solutions', metaDescription: 'Comprehensive digital strategy and technical implementation.' },
        { id: '4', path: '/about', priority: 0.6, lastModified: '2023-11-15', titleTag: 'About Us | The TechPulse Story', metaDescription: 'Learn about our mission to democratize enterprise web tools.' },
        { id: '5', path: '/contact', priority: 0.5, lastModified: '2023-11-10', titleTag: 'Contact Us | Get in Touch', metaDescription: 'Connect with our engineering and support teams today.' },
      ]);
    }
  }, []);

  const persistPages = (updatedPages: SitePage[]) => {
    setPages(updatedPages);
    localStorage.setItem('webmaster_sitemap_pages', JSON.stringify(updatedPages));
    
    // Visual "Saving..." feedback
    setSaveStatus('saving');
    if (saveTimeoutRef.current) window.clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = window.setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 800);
  };

  const handleDiscovery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!discoveryUrl) return;
    setIsDiscovering(true);
    try {
      const discovered = await geminiService.crawlSiteStructure(discoveryUrl);
      const newPages = discovered.map((p: any, i: number) => ({
        ...p,
        id: (pages.length + i + 1).toString(),
        titleTag: '',
        metaDescription: ''
      }));
      persistPages([...pages, ...newPages]);
      setDiscoveryUrl('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsDiscovering(false);
    }
  };

  const regenerateSitemap = async () => {
    setIsRegenerating(true);
    try {
      const paths = pages.map(p => p.path);
      const updated = await geminiService.generateSitemapMetadata(paths);
      const merged = updated.map((u, i) => {
        const existing = pages.find(p => p.path === u.path);
        return { 
          ...u, 
          id: (i + 1).toString(),
          titleTag: existing?.titleTag || u.titleTag,
          metaDescription: existing?.metaDescription || u.metaDescription
        };
      });
      persistPages(merged);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleTitleChange = (id: string, newTitle: string) => {
    const updated = pages.map(p => p.id === id ? { ...p, titleTag: newTitle } : p);
    persistPages(updated);
  };

  const handleMetaDescriptionChange = (id: string, newDesc: string) => {
    const updated = pages.map(p => p.id === id ? { ...p, metaDescription: newDesc } : p);
    persistPages(updated);
  };

  const removePage = (id: string) => {
    persistPages(pages.filter(p => p.id !== id));
  };

  const clearAll = () => {
    if (window.confirm('Are you sure you want to clear the entire sitemap structure?')) {
      persistPages([]);
    }
  };

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url>
    <loc>https://techpulse.io${p.path}</loc>
    <lastmod>${p.lastModified}</lastmod>
    <priority>${p.priority.toFixed(1)}</priority>
  </url>`).join('\n')}
</urlset>`;

  const handleExport = () => {
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sitemap.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(xmlContent);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-azure flex items-center">
            SEO & Sitemap Management
            {saveStatus === 'saving' && (
              <span className="ml-4 flex items-center text-[10px] font-bold text-azure/40 uppercase tracking-widest animate-pulse">
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Auto-saving...
              </span>
            )}
            {saveStatus === 'saved' && (
              <span className="ml-4 flex items-center text-[10px] font-bold text-green-400 uppercase tracking-widest">
                <Check className="w-3 h-3 mr-1" />
                Synced
              </span>
            )}
          </h2>
          <p className="text-azure/40 mt-1">Automatically discover structure and manage metadata for maximum visibility.</p>
        </div>
        <div className="flex space-x-3 w-full md:w-auto">
          <button 
            onClick={clearAll}
            className="px-4 py-2.5 bg-red-900/20 border border-red-500/20 rounded-xl text-red-400 hover:bg-red-900/40 transition-colors text-sm font-medium flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Clear All</span>
          </button>
          <button 
            onClick={handleExport}
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-2.5 btn-metallic text-azure-light rounded-xl font-bold hover:text-white transition-all shadow-lg shadow-azure/5 border border-azure/10 text-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export XML</span>
          </button>
        </div>
      </div>

      {/* URL Discovery Bar */}
      <div className="bg-ash-medium rounded-3xl border border-ash-border p-6 shadow-sm">
        <form onSubmit={handleDiscovery} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-azure/20 group-focus-within:text-azure transition-colors">
              <Globe className="w-5 h-5" />
            </div>
            <input 
              type="text"
              value={discoveryUrl}
              onChange={(e) => setDiscoveryUrl(e.target.value)}
              placeholder="Enter homepage URL to discover sub-pages... (e.g., https://acme.io)"
              className="w-full pl-12 pr-4 py-4 bg-ash border border-ash-border rounded-2xl text-azure text-sm focus:outline-none focus:ring-2 focus:ring-azure/20 focus:border-azure/40 transition-all font-medium placeholder:text-azure/10"
            />
          </div>
          <button 
            type="submit"
            disabled={isDiscovering || !discoveryUrl}
            className="px-8 py-4 btn-metallic text-azure-light rounded-2xl font-bold hover:text-white transition-all flex items-center justify-center space-x-3 shadow-lg shadow-azure/5 border border-azure/10"
          >
            {isDiscovering ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                <span>Discover Pages</span>
              </>
            )}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-ash-medium rounded-3xl border border-ash-border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-ash-border bg-ash-light flex justify-between items-center">
              <h3 className="text-xs font-bold text-azure/40 uppercase tracking-wider">Site Map Explorer</h3>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={regenerateSitemap}
                  disabled={isRegenerating || pages.length === 0}
                  className="text-[10px] font-bold text-azure hover:text-azure-bright flex items-center space-x-1.5 transition-colors disabled:opacity-30"
                >
                  <RefreshCw className={`w-3 h-3 ${isRegenerating ? 'animate-spin' : ''}`} />
                  <span>AI Optimize All</span>
                </button>
                <span className="text-[10px] font-bold bg-azure/10 text-azure px-2 py-0.5 rounded border border-azure/20 uppercase">
                  {pages.length} Pages
                </span>
              </div>
            </div>
            <div className="divide-y divide-ash-border">
              {pages.length === 0 ? (
                <div className="p-20 text-center flex flex-col items-center justify-center space-y-4 opacity-20">
                  <Search className="w-12 h-12" />
                  <p className="text-sm font-medium">Use the discovery tool above to map your site.</p>
                </div>
              ) : (
                pages.map((page) => (
                  <div key={page.id} className="p-6 flex flex-col sm:flex-row sm:items-start justify-between hover:bg-ash-light/20 transition-colors group">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="p-2.5 bg-ash rounded-xl border border-ash-border shrink-0 mt-1">
                        <Globe className="w-5 h-5 text-azure" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-3">
                          <p className="font-bold text-azure truncate text-lg tracking-tight">{page.path}</p>
                          <span className="text-[9px] font-bold bg-ash px-1.5 py-0.5 rounded text-azure/20 border border-ash-border uppercase">Path</span>
                        </div>
                        
                        <div className="flex flex-col space-y-3">
                          {/* Title Tag Input */}
                          <div className="relative max-w-full sm:max-w-md group/input">
                             <div className="absolute left-3 top-1/2 -translate-y-1/2 text-azure/20 group-focus-within/input:text-azure transition-colors">
                               <TypeIcon className="w-4 h-4" />
                             </div>
                             <input 
                               type="text"
                               value={page.titleTag || ''}
                               onChange={(e) => handleTitleChange(page.id, e.target.value)}
                               placeholder="SEO Title Tag..."
                               className="w-full pl-10 pr-3 py-2.5 bg-ash border border-ash-border rounded-xl text-sm text-azure-light focus:outline-none focus:ring-2 focus:ring-azure/10 focus:border-azure/30 placeholder:text-azure/10 transition-all font-medium"
                             />
                          </div>

                          {/* Meta Description Input */}
                          <div className="relative max-w-full sm:max-w-md group/input">
                             <div className="absolute left-3 top-1/2 -translate-y-1/2 text-azure/20 group-focus-within/input:text-azure transition-colors">
                               <FileText className="w-4 h-4" />
                             </div>
                             <input 
                               type="text"
                               value={page.metaDescription || ''}
                               onChange={(e) => handleMetaDescriptionChange(page.id, e.target.value)}
                               placeholder="Meta Description..."
                               className="w-full pl-10 pr-3 py-2.5 bg-ash border border-ash-border rounded-xl text-[11px] text-azure-light focus:outline-none focus:ring-2 focus:ring-azure/10 focus:border-azure/30 placeholder:text-azure/10 transition-all italic"
                             />
                          </div>
                          
                          <div className="flex items-center space-x-4 pt-1">
                            <p className="text-[10px] text-azure/30 flex items-center font-medium">
                              <RefreshCw className="w-2.5 h-2.5 mr-1.5 text-azure/20" />
                              Modified: {page.lastModified}
                            </p>
                            <div className="h-1 w-1 bg-ash-border rounded-full" />
                            <p className="text-[10px] text-azure/30 flex items-center font-medium">
                              <Search className="w-2.5 h-2.5 mr-1.5 text-azure/20" />
                              Active
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-start space-x-8 sm:space-x-0 sm:space-y-4 mt-6 sm:mt-0 sm:ml-4">
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-azure/20 uppercase tracking-widest mb-1">Priority</p>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 h-1.5 bg-ash rounded-full overflow-hidden border border-ash-border">
                            <div className="h-full bg-azure" style={{ width: `${page.priority * 100}%` }} />
                          </div>
                          <span className="font-mono text-azure font-bold text-sm">{page.priority.toFixed(1)}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => removePage(page.id)}
                          className="p-2.5 bg-ash hover:bg-red-900/10 border border-ash-border text-azure/20 hover:text-red-500 rounded-xl transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-2.5 bg-ash hover:bg-ash-light border border-ash-border text-azure/30 hover:text-azure rounded-xl transition-all">
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
            {pages.length > 0 && (
              <div className="p-4 bg-ash-light/30 border-t border-ash-border text-center">
                 <button 
                  className="text-xs font-bold text-azure/40 hover:text-azure transition-colors flex items-center justify-center mx-auto"
                  onClick={() => persistPages(pages)}
                 >
                   <Save className="w-3 h-3 mr-2" />
                   Manually Sync Structure
                 </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-ash-medium rounded-3xl border border-ash-border p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-azure text-lg">Sitemap Preview</h3>
              <button 
                onClick={handleCopy}
                className={`p-2 rounded-xl transition-all ${isCopied ? 'text-green-400 bg-green-400/10' : 'text-azure/30 hover:text-azure bg-ash border border-ash-border'}`}
                title="Copy XML"
              >
                {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="bg-ash rounded-2xl p-5 font-mono text-[11px] text-azure-dim overflow-hidden h-[340px] relative border border-ash-border leading-relaxed shadow-inner">
              <pre className="overflow-y-auto h-full scrollbar-hide">
                {xmlContent}
              </pre>
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-ash to-transparent pointer-events-none" />
            </div>
            <p className="text-[9px] text-center text-azure/20 uppercase tracking-[0.3em] mt-6">standard sitemap protocol v0.9</p>
          </div>

          <div className="bg-ash-medium rounded-3xl p-8 border border-ash-border shadow-inner relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-5">
                <div className="p-2 bg-green-400/10 rounded-xl border border-green-400/20">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="font-bold text-azure text-lg">SEO Readiness</h3>
              </div>
              <p className="text-sm text-azure/40 leading-relaxed font-medium">
                Your sitemap and manual metadata are synchronized. Use the URL Discovery tool periodically to find new content.
              </p>
              <div className="mt-6 p-4 bg-ash/40 rounded-2xl border border-ash-border flex items-start space-x-3">
                <Info className="w-4 h-4 text-azure/40 mt-0.5 shrink-0" />
                <p className="text-[10px] text-azure/40 leading-normal">
                  AI Optimization will suggest missing titles and descriptions based on your site's target industry.
                </p>
              </div>
              <button className="mt-4 w-full py-4 btn-metallic text-azure-light rounded-2xl font-bold text-sm transition-all border border-azure/10 shadow-lg shadow-azure/5">
                Run Final Audit
              </button>
            </div>
            <CheckCircle className="absolute -right-8 -bottom-8 w-32 h-32 text-azure/5 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SitemapGenerator;
