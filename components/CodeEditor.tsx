
import React, { useState } from 'react';
import { File, Folder, FileCode, Upload, Download, Trash2, Save, Terminal, Search, ChevronRight, Layout, Play, Check } from 'lucide-react';

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileItem[];
}

const CodeEditor: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([
    {
      name: 'src',
      type: 'folder',
      children: [
        { name: 'App.tsx', type: 'file', content: 'import React from "react";\n\nexport default function App() {\n  return <div>Hello WebMaster!</div>;\n}' },
        { name: 'index.css', type: 'file', content: 'body {\n  margin: 0;\n  background: #121212;\n  color: #ff8080;\n}' },
      ]
    },
    { name: 'package.json', type: 'file', content: '{\n  "name": "my-site",\n  "version": "1.0.0"\n}' },
    { name: 'public', type: 'folder', children: [{ name: 'index.html', type: 'file', content: '<html><body style="background:#121212; color:#ff8080"><div id="root"></div></body></html>' }] }
  ]);

  const [activeFile, setActiveFile] = useState<FileItem | null>(files[0].children![0]);
  const [isSaved, setIsSaved] = useState(true);

  const handleContentChange = (val: string) => {
    if (activeFile) {
      setActiveFile({ ...activeFile, content: val });
      setIsSaved(false);
    }
  };

  const handleSave = () => {
    setIsSaved(true);
  };

  const renderFileTree = (items: FileItem[], depth = 0) => {
    return items.map((item, idx) => (
      <div key={idx} style={{ paddingLeft: `${depth * 12}px` }}>
        <button 
          onClick={() => item.type === 'file' && setActiveFile(item)}
          className={`w-full text-left px-2 py-1.5 rounded flex items-center space-x-2 text-sm transition-colors ${
            activeFile?.name === item.name ? 'btn-metallic text-white' : 'text-poppy/40 hover:bg-ash-light'
          }`}
        >
          {item.type === 'folder' ? <Folder className="w-4 h-4 text-poppy" /> : <FileCode className="w-4 h-4" />}
          <span className="truncate">{item.name}</span>
        </button>
        {item.children && renderFileTree(item.children, depth + 1)}
      </div>
    ));
  };

  return (
    <div className="flex h-[700px] bg-ash rounded-3xl overflow-hidden shadow-2xl border border-ash-border">
      {/* FTP / Sidebar */}
      <div className="w-64 bg-ash-medium border-r border-ash-border flex flex-col">
        <div className="p-4 border-b border-ash-border flex items-center justify-between">
          <span className="text-xs font-bold text-poppy/40 uppercase tracking-widest">FTP Browser</span>
          <div className="flex space-x-1">
            <button className="p-1.5 hover:bg-ash-light rounded text-poppy/40"><Upload className="w-3.5 h-3.5" /></button>
            <button className="p-1.5 hover:bg-ash-light rounded text-poppy/40"><Download className="w-3.5 h-3.5" /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {renderFileTree(files)}
        </div>
        <div className="p-4 border-t border-ash-border bg-ash-medium/50">
          <div className="flex items-center space-x-2 text-xs text-green-500">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            <span>Connected: webmaster-sftp-1</span>
          </div>
        </div>
      </div>

      {/* Code Editor */}
      <div className="flex-1 flex flex-col relative">
        <div className="h-12 bg-ash-medium border-b border-ash-border flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-ash px-3 py-1.5 rounded-t-lg border-t-2 border-poppy">
              <FileCode className="w-4 h-4 text-poppy" />
              <span className="text-xs font-semibold text-poppy-light">{activeFile?.name || 'No file open'}</span>
              {!isSaved && <div className="w-2 h-2 bg-poppy rounded-full animate-pulse" />}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleSave}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-white/5 ${
                isSaved ? 'bg-ash-light text-poppy/40' : 'btn-metallic text-white hover:opacity-90'
              }`}
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-1.5 btn-metallic text-white rounded-lg text-xs font-bold hover:opacity-90 border border-white/5">
              <Play className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden bg-ash">
          <div className="w-12 bg-ash-medium border-r border-ash-border flex flex-col items-center py-4 space-y-1 text-[10px] text-poppy/20 font-mono">
            {Array.from({ length: 30 }).map((_, i) => <div key={i}>{i + 1}</div>)}
          </div>
          <textarea 
            value={activeFile?.content || ''}
            onChange={(e) => handleContentChange(e.target.value)}
            className="flex-1 bg-ash text-poppy-bright font-mono text-sm p-4 outline-none resize-none selection:bg-poppy/30"
            spellCheck={false}
          />
        </div>

        {/* Console */}
        <div className="h-32 bg-ash-medium border-t border-ash-border flex flex-col">
          <div className="px-4 py-2 border-b border-ash-border flex items-center space-x-2">
            <Terminal className="w-3.5 h-3.5 text-poppy/40" />
            <span className="text-[10px] font-bold text-poppy/40 uppercase tracking-widest">Debug Console</span>
          </div>
          <div className="flex-1 p-4 font-mono text-xs text-poppy-light overflow-y-auto space-y-1">
            <p className="text-poppy/20 italic">Welcome to WebMaster Shell v2.4.0</p>
            <p><span className="text-poppy">$</span> npm run build:production</p>
            <p className="text-poppy/60">Successfully bundled 21 assets.</p>
            <p className="text-poppy/60">Total size: 4.2MB</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;