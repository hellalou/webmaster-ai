
import React from 'react';
import { Sparkles, ArrowRight, Zap, Globe, SearchCode, Wand2 } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-ash text-azure-light selection:bg-azure/30">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-ash-medium/80 backdrop-blur-md border-b border-ash-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 btn-metallic rounded-lg flex items-center justify-center text-azure">
                <Wand2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-azure">WebMaster <span className="text-azure-dim">AI</span></span>
            </div>
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-azure/60">
              <a href="#features" className="hover:text-azure transition-colors">Features</a>
              <a href="#seo" className="hover:text-azure transition-colors">SEO Suite</a>
              <button 
                onClick={onLogin}
                className="px-5 py-2.5 btn-metallic text-white rounded-full font-bold transition-all shadow-lg shadow-azure/5 border border-azure/10"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-azure/10 rounded-full text-azure text-xs font-bold mb-8 border border-azure/20">
            <Sparkles className="w-4 h-4" />
            <span>Powered by Gemini 3 Pro</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-azure">
            The only website <span className="text-azure-dim">OS</span> you'll ever need.
          </h1>
          <p className="text-xl text-azure/40 max-w-2xl mx-auto mb-10">
            WebMaster AI combines site building, domain management, enterprise hosting, and a full AI SEO suite into one unified dashboard.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={onLogin}
              className="w-full sm:w-auto px-8 py-4 btn-metallic text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-azure/10 flex items-center justify-center group border border-azure/10"
            >
              Start Building Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-ash-medium text-azure border border-ash-border rounded-2xl font-bold text-lg hover:bg-ash-light transition-all">
              View Demo
            </button>
          </div>

          <div className="mt-20 relative max-w-5xl mx-auto">
            {/* Background Glows */}
            <div className="absolute inset-0 bg-azure/20 blur-[120px] -z-10 rounded-full translate-y-24 opacity-50" />
            <div className="absolute -inset-4 bg-gradient-to-b from-azure/5 to-transparent blur-2xl -z-10 rounded-3xl" />
            
            <div className="rounded-3xl border border-ash-border bg-ash-medium p-2 shadow-[0_0_50px_rgba(59,130,246,0.1)] relative overflow-hidden group">
              {/* Metallic Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-tr from-azure/10 via-transparent to-white/5 pointer-events-none z-10 opacity-30 group-hover:opacity-50 transition-opacity duration-700" />
              
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&auto=format&fit=crop&q=90" 
                alt="WebMaster AI Dashboard Preview" 
                className="rounded-2xl border border-ash-border opacity-70 group-hover:opacity-90 transition-all duration-1000 w-full"
                style={{ 
                  filter: 'grayscale(0.4) brightness(0.9) contrast(1.1) sepia(0.2) hue-rotate(180deg)',
                  boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-ash-medium/50 border-t border-ash-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-azure">Enterprise-grade tools at your fingertips.</h2>
            <p className="text-azure/40">Everything you need to grow your digital presence, automated by AI.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'AI Assistant', desc: 'Generate brand-aligned copy and blog content in seconds.', icon: Wand2, color: 'btn-metallic' },
              { title: 'SEO Engine', desc: 'Real-time analysis, keyword suggestions, and schema generation.', icon: SearchCode, color: 'bg-azure-light' },
              { title: 'Smart Domains', desc: 'Find and register the perfect domain with AI suggestions.', icon: Globe, color: 'bg-ash-medium' },
              { title: 'Edge Hosting', desc: 'Global edge network with automated CI/CD and deployments.', icon: Zap, color: 'bg-azure-dim' },
            ].map((f, i) => (
              <div key={i} className="bg-ash-medium p-8 rounded-3xl shadow-sm border border-ash-border hover:border-azure/30 transition-all">
                <div className={`w-12 h-12 rounded-2xl ${f.color.includes('btn-metallic') ? 'btn-metallic' : f.color} flex items-center justify-center text-white mb-6 shadow-lg border border-white/5`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-azure">{f.title}</h3>
                <p className="text-azure/40 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-ash-border bg-ash-medium">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-azure/40 text-sm">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-6 h-6 btn-metallic rounded flex items-center justify-center text-white border border-azure/20">
               <Wand2 className="w-4 h-4" />
            </div>
            <span className="font-bold text-azure">WebMaster AI</span>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-azure transition-colors">Privacy</a>
            <a href="#" className="hover:text-azure transition-colors">Terms</a>
            <a href="#" className="hover:text-azure transition-colors">Contact</a>
          </div>
          <p className="mt-4 md:mt-0">&copy; 2023 WebMaster AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
