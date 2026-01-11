
import React, { useState, useRef } from 'react';
import { 
  Shapes, 
  Type, 
  ImageIcon, 
  LayoutIcon, 
  MousePointer2, 
  Trash2, 
  Settings2, 
  Plus, 
  Wand2, 
  GripVertical,
  ChevronDown,
  Monitor,
  Smartphone,
  Check,
  Loader2,
  Palette,
  Maximize2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Square,
  Sun,
  Moon,
  Sparkle
} from 'lucide-react';
import { BuilderBlock, BlockType } from '../types';
import { geminiService } from '../services/geminiService';

const DEFAULT_BLOCKS: BuilderBlock[] = [
  {
    id: 'block-1',
    type: 'hero',
    content: {
      title: 'Design the Future',
      body: 'Create stunning websites with the power of AI at your fingertips.',
      buttonText: 'Get Started'
    },
    styles: { 
      padding: 'lg', 
      theme: 'azure',
      textAlign: 'center',
      fontSizeTitle: 40,
      fontSizeBody: 18,
      fontWeightTitle: 'bold',
      fontStyleBody: 'normal',
      borderRadius: 0,
      borderWidth: 0
    }
  }
];

const SiteBuilder: React.FC = () => {
  const [blocks, setBlocks] = useState<BuilderBlock[]>(DEFAULT_BLOCKS);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  const addBlock = (type: BlockType) => {
    const newBlock: BuilderBlock = {
      id: `block-${Date.now()}`,
      type,
      content: getDefaults(type),
      styles: { 
        padding: 'md', 
        theme: 'dark',
        textAlign: 'left',
        fontSizeTitle: 24,
        fontSizeBody: 16,
        fontWeightTitle: 'bold',
        fontStyleBody: 'normal',
        borderRadius: 12,
        borderWidth: 0
      }
    };
    setBlocks([...blocks, newBlock]);
    setSelectedBlockId(newBlock.id);
  };

  const getDefaults = (type: BlockType) => {
    switch(type) {
      case 'text': return { title: 'Section Title', body: 'Add your text here...' };
      case 'features': return { items: ['Feature 1', 'Feature 2', 'Feature 3'] };
      case 'cta': return { title: 'Ready to join?', buttonText: 'Sign Up' };
      default: return {};
    }
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
    if (selectedBlockId === id) setSelectedBlockId(null);
  };

  const updateBlock = (id: string, updates: Partial<BuilderBlock>) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const updateStyles = (id: string, styleUpdates: Partial<BuilderBlock['styles']>) => {
    const block = blocks.find(b => b.id === id);
    if (block) {
      updateBlock(id, { styles: { ...block.styles, ...styleUpdates } });
    }
  };

  const generateWithAi = async () => {
    const prompt = window.prompt("What kind of page should I build?");
    if (!prompt) return;

    setIsAiGenerating(true);
    try {
      const suggestedLayout = await geminiService.generateBlockLayout(prompt);
      const newBlocks = suggestedLayout.map((b: any, i: number) => ({
        id: `ai-block-${Date.now()}-${i}`,
        type: b.type as BlockType,
        content: b.content,
        styles: { 
          padding: 'md', 
          theme: i % 2 === 0 ? 'azure' : 'dark',
          textAlign: 'center',
          fontSizeTitle: 32,
          fontSizeBody: 16,
          fontWeightTitle: 'bold',
          fontStyleBody: 'normal',
          borderRadius: 0,
          borderWidth: 0
        }
      }));
      setBlocks(newBlocks);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleDragStart = (index: number) => setDraggedIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newBlocks = [...blocks];
    const item = newBlocks.splice(draggedIndex, 1)[0];
    newBlocks.splice(index, 0, item);
    setBlocks(newBlocks);
    setDraggedIndex(index);
  };

  return (
    <div className="h-[calc(100vh-120px)] flex bg-ash gap-4 animate-in fade-in duration-500">
      {/* Sidebar - Block Library */}
      <aside className="w-64 bg-ash-medium rounded-3xl border border-ash-border flex flex-col overflow-hidden">
        <div className="p-6 border-b border-ash-border">
          <h3 className="text-xs font-bold text-azure/40 uppercase tracking-widest mb-4">Block Library</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { type: 'hero', icon: Shapes, label: 'Hero' },
              { type: 'text', icon: Type, label: 'Text' },
              { type: 'features', icon: Shapes, label: 'Features' },
              { type: 'cta', icon: MousePointer2, label: 'CTA' },
              { type: 'spacer', icon: Plus, label: 'Spacer' }
            ].map((item) => (
              <button
                key={item.type}
                onClick={() => addBlock(item.type as BlockType)}
                className="flex flex-col items-center justify-center p-3 bg-ash rounded-xl border border-ash-border hover:border-azure/40 hover:bg-ash-light transition-all group"
              >
                <item.icon className="w-5 h-5 text-azure/40 group-hover:text-azure mb-1" />
                <span className="text-[10px] font-bold text-azure/40 group-hover:text-azure">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 p-6 space-y-4">
          <button 
            onClick={generateWithAi}
            disabled={isAiGenerating}
            className="w-full py-3 btn-metallic text-white rounded-xl font-bold flex items-center justify-center space-x-2 border border-azure/20"
          >
            {isAiGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            <span>Generate with AI</span>
          </button>
        </div>
      </aside>

      {/* Main Builder Canvas */}
      <div className="flex-1 flex flex-col bg-ash-medium rounded-3xl border border-ash-border overflow-hidden relative shadow-inner">
        <div className="px-6 py-3 border-b border-ash-border bg-ash-medium/50 flex items-center justify-between">
          <div className="flex items-center space-x-2 bg-ash p-1 rounded-lg border border-ash-border">
            <button onClick={() => setViewMode('desktop')} className={`p-1.5 rounded ${viewMode === 'desktop' ? 'bg-azure text-white' : 'text-azure/40 hover:text-azure'}`}>
              <Monitor className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('mobile')} className={`p-1.5 rounded ${viewMode === 'mobile' ? 'bg-azure text-white' : 'text-azure/40 hover:text-azure'}`}>
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-[10px] font-bold text-azure/20 uppercase">Editing Canvas</span>
            <button className="px-4 py-1.5 btn-metallic text-white rounded-lg text-xs font-bold border border-azure/20">Publish Page</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
          <div className={`mx-auto bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-500 ${viewMode === 'desktop' ? 'max-w-4xl' : 'max-w-sm'}`} style={{ minHeight: '100%' }}>
            {blocks.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-ash/20">
                <Shapes className="w-12 h-12 mb-4" />
                <p className="font-medium">Drop blocks here to start building</p>
              </div>
            ) : (
              blocks.map((block, index) => (
                <div 
                  key={block.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={() => setDraggedIndex(null)}
                  onClick={(e) => { e.stopPropagation(); setSelectedBlockId(block.id); }}
                  className={`relative group border-2 transition-all cursor-default ${selectedBlockId === block.id ? 'border-azure ring-4 ring-azure/10' : 'border-transparent hover:border-azure/20'}`}
                >
                  <div className={`absolute -left-12 top-2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
                    <div className="p-2 bg-azure text-white rounded-lg cursor-grab active:cursor-grabbing"><GripVertical className="w-4 h-4" /></div>
                    <button onClick={() => removeBlock(block.id)} className="p-2 bg-ash-medium text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <BlockRenderer block={block} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Properties Panel */}
      <aside className={`w-80 bg-ash-medium rounded-3xl border border-ash-border flex flex-col overflow-hidden transition-all duration-300 ${selectedBlock ? 'translate-x-0' : 'translate-x-full absolute right-0 h-full'}`}>
        <div className="p-6 border-b border-ash-border flex items-center justify-between bg-ash-medium/50 sticky top-0 z-10">
          <div className="flex items-center space-x-2">
            <Settings2 className="w-4 h-4 text-azure" />
            <h3 className="font-bold text-sm text-azure">Block Design</h3>
          </div>
          <button onClick={() => setSelectedBlockId(null)} className="text-azure/40 hover:text-azure"><ChevronDown className="w-4 h-4" /></button>
        </div>

        {selectedBlock ? (
          <div className="flex-1 p-6 space-y-8 overflow-y-auto scrollbar-hide pb-20">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-azure/30"><Palette className="w-3.5 h-3.5" /><p className="text-[10px] font-bold uppercase tracking-widest">Theme Switcher</p></div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'light', icon: Sun, label: 'Light' },
                  { id: 'dark', icon: Moon, label: 'Dark' },
                  { id: 'azure', icon: Sparkle, label: 'Azure' }
                ].map(t => (
                  <button 
                    key={t.id} 
                    onClick={() => updateStyles(selectedBlock.id, { theme: t.id as any })} 
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                      selectedBlock.styles.theme === t.id 
                        ? 'bg-azure/10 border-azure text-azure shadow-lg shadow-azure/5' 
                        : 'bg-ash border-ash-border text-azure/40 hover:border-azure/30 hover:text-azure'
                    }`}
                  >
                    <t.icon className="w-5 h-5 mb-1.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{t.label}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => updateStyles(selectedBlock.id, { theme: 'custom' })} className={`w-full py-2.5 rounded-xl border text-[10px] font-bold uppercase transition-all ${selectedBlock.styles.theme === 'custom' ? 'bg-azure/10 border-azure text-azure' : 'bg-ash border-ash-border text-azure/40 hover:text-azure'}`}>Custom Styling Mode</button>
              {selectedBlock.styles.theme === 'custom' && (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-azure/60 font-medium">Background</label>
                    <input type="color" value={selectedBlock.styles.backgroundColor || '#ffffff'} onChange={(e) => updateStyles(selectedBlock.id, { backgroundColor: e.target.value })} className="w-full h-8 bg-ash border border-ash-border rounded-lg cursor-pointer p-0.5" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-azure/60 font-medium">Text Color</label>
                    <input type="color" value={selectedBlock.styles.textColor || '#000000'} onChange={(e) => updateStyles(selectedBlock.id, { textColor: e.target.value })} className="w-full h-8 bg-ash border border-ash-border rounded-lg cursor-pointer p-0.5" />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4 pt-6 border-t border-ash-border">
              <div className="flex items-center space-x-2 text-azure/30"><Type className="w-3.5 h-3.5" /><p className="text-[10px] font-bold uppercase tracking-widest">Content</p></div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-azure/60 font-medium">Headline</label>
                <input type="text" value={selectedBlock.content.title} onChange={(e) => updateBlock(selectedBlock.id, { content: { ...selectedBlock.content, title: e.target.value } })} className="w-full bg-ash border border-ash-border rounded-xl px-3 py-2 text-sm text-azure-light focus:ring-1 focus:ring-azure/40 outline-none" />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-azure/20"><MousePointer2 className="w-10 h-10 mb-4 opacity-10 animate-pulse" /><p className="text-xs">Select a block.</p></div>
        )}
      </aside>
    </div>
  );
};

const BlockRenderer: React.FC<{ block: BuilderBlock }> = ({ block }) => {
  const themes = {
    light: { bg: '#ffffff', text: '#121212' },
    dark: { bg: '#1e1e1e', text: '#ffffff' },
    azure: { bg: '#3b82f6', text: '#ffffff' },
    custom: { bg: block.styles.backgroundColor || '#ffffff', text: block.styles.textColor || '#000000' }
  };

  const currentTheme = themes[block.styles.theme] || themes.light;

  const containerStyle: React.CSSProperties = {
    backgroundColor: currentTheme.bg,
    color: currentTheme.text,
    paddingTop: '64px',
    paddingBottom: '64px',
    textAlign: block.styles.textAlign || 'left',
    borderRadius: `${block.styles.borderRadius}px`,
    borderWidth: `${block.styles.borderWidth}px`,
    borderStyle: block.styles.borderWidth! > 0 ? 'solid' : 'none',
    borderColor: block.styles.borderColor || '#3b82f6',
    transition: 'all 0.3s ease'
  };

  switch(block.type) {
    case 'hero':
      return (
        <section style={containerStyle} className="px-12">
          <h2 className="text-4xl font-bold mb-6">{block.content.title}</h2>
          <p className="text-lg opacity-80 mb-8">{block.content.body}</p>
          <button className="px-8 py-3 rounded-full font-bold shadow-xl" style={{ backgroundColor: block.styles.theme === 'azure' ? '#fff' : '#3b82f6', color: block.styles.theme === 'azure' ? '#3b82f6' : '#fff' }}>
            {block.content.buttonText}
          </button>
        </section>
      );
    case 'text':
      return (
        <section style={containerStyle} className="px-12">
          <h3 className="text-2xl font-bold mb-4">{block.content.title}</h3>
          <p className="opacity-80">{block.content.body}</p>
        </section>
      );
    case 'features':
      return (
        <section style={containerStyle} className="px-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {block.content.items?.map((item, i) => (
              <div key={i} className="p-6 rounded-3xl bg-black/5">
                <p className="font-bold">{item}</p>
              </div>
            ))}
          </div>
        </section>
      );
    case 'cta':
      return (
        <section style={containerStyle} className="px-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <h3 className="text-3xl font-bold">{block.content.title}</h3>
          <button className="px-8 py-3 rounded-xl font-bold" style={{ backgroundColor: block.styles.theme === 'azure' ? '#fff' : '#121212', color: block.styles.theme === 'azure' ? '#3b82f6' : '#fff' }}>
            {block.content.buttonText}
          </button>
        </section>
      );
    case 'spacer':
      return <div style={{ height: '96px', backgroundColor: currentTheme.bg, opacity: 0.1 }} />;
    default:
      return null;
  }
};

export default SiteBuilder;
