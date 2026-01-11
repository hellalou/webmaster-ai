
import React from 'react';
import { Eye, Check, Sparkles } from 'lucide-react';
import { SiteTemplate } from '../types';

const templates: SiteTemplate[] = [
  { id: '1', name: 'Minimalist Portfolio', category: 'Portfolio', description: 'Clean and elegant design for creative professionals.', image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&auto=format&fit=crop&q=60' },
  { id: '2', name: 'SaaS Launchpad', category: 'Business', description: 'Modern landing page optimized for high conversions.', image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&auto=format&fit=crop&q=60' },
  { id: '3', name: 'Gourmet Blog', category: 'Blog', description: 'Rich typography and large imagery for food lovers.', image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=60' },
  { id: '4', name: 'Urban Store', category: 'E-commerce', description: 'Stylish storefront for fashion and lifestyle brands.', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=60' },
  { id: '5', name: 'Corporate Pro', category: 'Business', description: 'Trustworthy and professional layout for firms.', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60' },
  { id: '6', name: 'Artistic Space', category: 'Portfolio', description: 'Bold and unique design to showcase your art.', image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&auto=format&fit=crop&q=60' },
];

const TemplateLibrary: React.FC = () => {
  const [filter, setFilter] = React.useState<string>('All');
  const [selected, setSelected] = React.useState<string | null>('1');

  const filteredTemplates = filter === 'All' ? templates : templates.filter(t => t.category === filter);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-azure">Site Templates</h2>
          <p className="text-azure/40">Pick a starting point and customize it with AI.</p>
        </div>
        
        <div className="flex items-center space-x-2 bg-ash-medium p-1 rounded-xl border border-ash-border shadow-sm overflow-x-auto">
          {['All', 'Portfolio', 'Business', 'Blog', 'E-commerce'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all shrink-0 ${
                filter === cat ? 'btn-metallic text-white' : 'text-azure/40 hover:text-azure'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTemplates.map((template) => (
          <div 
            key={template.id} 
            className={`group bg-ash-medium rounded-2xl overflow-hidden border transition-all duration-300 ${
              selected === template.id ? 'ring-2 ring-azure border-transparent shadow-xl' : 'border-ash-border shadow-sm hover:border-azure/30'
            }`}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img 
                src={template.image} 
                alt={template.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-ash/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
                <button className="p-3 bg-ash-medium rounded-full text-azure hover:bg-ash-light transition-colors shadow-lg border border-ash-border">
                  <Eye className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setSelected(template.id)}
                  className="p-3 btn-metallic rounded-full text-white hover:opacity-90 transition-colors shadow-lg border border-azure/20"
                >
                  <Check className="w-5 h-5" />
                </button>
              </div>
              {selected === template.id && (
                <div className="absolute top-4 right-4 bg-azure text-white p-1.5 rounded-full shadow-lg">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-azure bg-azure/10 px-2 py-0.5 rounded border border-azure/20">
                  {template.category}
                </span>
              </div>
              <h3 className="font-bold text-azure text-lg mb-1">{template.name}</h3>
              <p className="text-azure/40 text-sm leading-relaxed">{template.description}</p>
              
              <div className="mt-6 flex items-center justify-between">
                <button 
                  onClick={() => setSelected(template.id)}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    selected === template.id 
                      ? 'btn-metallic text-white shadow-lg border border-azure/20' 
                      : 'bg-ash-light text-azure/60 hover:text-azure border border-ash-border'
                  }`}
                >
                  {selected === template.id ? 'Active Theme' : 'Select Template'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-ash-medium rounded-3xl p-10 text-azure flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl border border-ash-border">
        <div className="z-10 relative space-y-4">
          <h3 className="text-3xl font-bold text-azure">Customize with AI</h3>
          <p className="text-azure/40 max-w-md">
            Once you select a template, use our AI Content Assistant to generate brand-aligned copy and imagery automatically.
          </p>
          <div className="flex space-x-4 pt-2">
            <button className="px-6 py-3 btn-metallic text-white font-bold rounded-xl shadow-lg border border-azure/20">
              Open Editor
            </button>
            <button className="px-6 py-3 bg-ash-light text-azure font-bold rounded-xl hover:bg-ash-border transition-colors border border-ash-border">
              Watch Tutorial
            </button>
          </div>
        </div>
        <div className="z-10 bg-ash/50 backdrop-blur-md p-6 rounded-2xl border border-ash-border w-full md:w-80 shadow-inner">
          <div className="space-y-3">
            <div className="h-4 w-3/4 bg-azure/20 rounded-full animate-pulse" />
            <div className="h-4 w-full bg-azure/10 rounded-full animate-pulse delay-75" />
            <div className="h-4 w-1/2 bg-azure/10 rounded-full animate-pulse delay-150" />
            <div className="pt-4 flex justify-end">
              <div className="h-8 w-24 bg-azure rounded-lg animate-bounce" />
            </div>
          </div>
        </div>
        <Sparkles className="absolute -right-20 -bottom-20 w-80 h-80 text-azure/5 pointer-events-none" />
      </div>
    </div>
  );
};

export default TemplateLibrary;
