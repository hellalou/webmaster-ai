
import React from 'react';
import { Sparkles, Wand2, Copy, Check, MessageSquare, List, RefreshCcw, Loader2 } from 'lucide-react';
import { geminiService } from '../services/geminiService';

const ContentAI: React.FC = () => {
  const [prompt, setPrompt] = React.useState('');
  const [section, setSection] = React.useState('Hero Section');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [result, setResult] = React.useState<{ headline?: string, body?: string } | null>(null);
  const [copied, setCopied] = React.useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    try {
      const data = await geminiService.generateSiteCopy(section, prompt);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    const text = `${result.headline}\n\n${result.body}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center p-3 bg-azure/10 text-azure rounded-2xl mb-4">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold text-azure">AI Content Assistant</h2>
        <p className="text-azure/40">Generate professional copy for any section of your website instantly.</p>
      </div>

      <div className="bg-ash-medium p-8 rounded-3xl border border-ash-border shadow-xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-azure-light">Target Section</label>
            <select 
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-ash-border bg-ash text-azure focus:ring-2 focus:ring-azure outline-none transition-all"
            >
              <option className="bg-ash">Hero Section</option>
              <option className="bg-ash">Features/Benefits</option>
              <option className="bg-ash">About Us</option>
              <option className="bg-ash">Product Description</option>
              <option className="bg-ash">Call to Action (CTA)</option>
              <option className="bg-ash">Testimonial Placeholder</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-azure-light">Brand/Context</label>
            <input 
              type="text"
              placeholder="e.g. A sustainable coffee brand for eco-conscious urbanites"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-ash-border bg-ash text-azure focus:ring-2 focus:ring-azure outline-none transition-all placeholder:text-azure/20"
            />
          </div>
        </div>

        <button 
          onClick={handleGenerate}
          disabled={isGenerating || !prompt}
          className="w-full py-4 btn-metallic text-azure-light hover:text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-azure/10 flex items-center justify-center space-x-2 disabled:opacity-50 border border-azure/10"
        >
          {isGenerating ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              <span>Generate Site Copy</span>
            </>
          )}
        </button>
      </div>

      {result && (
        <div className="bg-ash-medium rounded-3xl border border-azure/20 shadow-xl overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="px-8 py-4 bg-azure/10 border-b border-azure/20 flex justify-between items-center">
            <span className="text-sm font-bold text-azure uppercase tracking-widest">{section} Result</span>
            <button 
              onClick={copyToClipboard}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-ash rounded-lg text-xs font-bold text-azure hover:text-azure-bright transition-colors shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
            </button>
          </div>
          <div className="p-8 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-azure/20 uppercase tracking-wider mb-2">Headline</h3>
              <p className="text-2xl font-bold text-azure-bright">{result.headline}</p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-azure/20 uppercase tracking-wider mb-2">Body Copy</h3>
              <p className="text-azure-light leading-relaxed text-lg whitespace-pre-wrap">{result.body}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-ash-medium p-6 rounded-2xl border border-ash-border shadow-sm flex items-center space-x-4 hover:border-azure/30 transition-all">
          <div className="p-3 bg-azure/10 text-azure rounded-xl">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-azure">Blog Idea Generator</h4>
            <p className="text-xs text-azure/40">Stuck for topics? Get 5 trending titles.</p>
          </div>
          <button className="p-2 text-azure/40 hover:text-azure transition-colors">
            <RefreshCcw className="w-5 h-5" />
          </button>
        </div>
        <div className="bg-ash-medium p-6 rounded-2xl border border-ash-border shadow-sm flex items-center space-x-4 hover:border-azure/30 transition-all">
          <div className="p-3 bg-azure/10 text-azure rounded-xl">
            <List className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-azure">SEO Outline Tool</h4>
            <p className="text-xs text-azure/40">Structure your posts for search engine success.</p>
          </div>
          <button className="p-2 text-azure/40 hover:text-azure transition-colors">
            <RefreshCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentAI;
