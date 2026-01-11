
import React from 'react';
import { 
  BarChart3, 
  Globe, 
  Server, 
  BookOpen, 
  Bell, 
  Settings,
  Menu,
  X,
  Layout as LayoutIcon,
  Sparkles,
  SearchCode,
  LogOut,
  Shapes
} from 'lucide-react';
import { AppView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: AppView;
  setView: (view: AppView) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setView, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const navItems = [
    { id: 'analysis', label: 'Analysis', icon: BarChart3 },
    { id: 'builder', label: 'Site Builder', icon: Shapes },
    { id: 'content-ai', label: 'AI Assistant', icon: Sparkles },
    { id: 'blog', label: 'Blog CMS', icon: BookOpen },
    { id: 'domains', label: 'Domains', icon: Globe },
    { id: 'hosting', label: 'Hosting', icon: Server },
    { id: 'seo', label: 'SEO Tools', icon: SearchCode },
    { id: 'templates', label: 'Templates', icon: LayoutIcon },
  ];

  return (
    <div className="flex h-screen bg-ash text-azure-light overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-ash-medium border-r border-ash-border flex flex-col z-30`}
      >
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen ? (
            <span className="text-xl font-bold text-azure tracking-tight">WebMaster <span className="text-azure-dim">AI</span></span>
          ) : (
            <div className="w-8 h-8 btn-metallic rounded-lg mx-auto" />
          )}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden lg:block text-azure-dim hover:text-azure">
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 py-4 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as AppView)}
              className={`w-full flex items-center p-3 rounded-xl transition-all ${
                activeView === item.id 
                  ? 'btn-metallic text-azure font-semibold shadow-sm border border-azure/20' 
                  : 'text-azure/60 hover:bg-ash-light hover:text-azure'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isSidebarOpen ? 'mr-3' : 'mx-auto'}`} />
              {isSidebarOpen && <span className="text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-ash-border space-y-1">
          <button className="w-full flex items-center p-3 text-azure/60 hover:bg-ash-light rounded-xl">
            <Settings className={`w-5 h-5 ${isSidebarOpen ? 'mr-3' : 'mx-auto'}`} />
            {isSidebarOpen && <span className="text-sm font-medium">Settings</span>}
          </button>
          <button 
            onClick={onLogout}
            className="w-full flex items-center p-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
          >
            <LogOut className={`w-5 h-5 ${isSidebarOpen ? 'mr-3' : 'mx-auto'}`} />
            {isSidebarOpen && <span className="text-sm font-medium">Log out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-ash-medium border-b border-ash-border flex items-center justify-between px-8 z-10 shrink-0">
          <div className="flex items-center text-sm text-azure/60">
            <span className="font-medium text-azure capitalize">{activeView.replace('-', ' ')}</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 text-azure/40 hover:text-azure transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="h-8 w-px bg-ash-border mx-2" />
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-azure">Alex Designer</p>
                <p className="text-xs text-azure/40">Pro Plan</p>
              </div>
              <img 
                src="https://picsum.photos/seed/user-azure/40/40" 
                className="w-10 h-10 rounded-full border border-ash-border shadow-sm grayscale hover:grayscale-0 transition-all"
                alt="Profile" 
              />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-ash">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
