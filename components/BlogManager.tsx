
import React from 'react';
import { PenTool, Calendar, Save, Loader2, Sparkles, Trash2, Clock, Plus } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { BlogPost } from '../types';

const BlogManager: React.FC = () => {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [topic, setTopic] = React.useState('');
  const [posts, setPosts] = React.useState<BlogPost[]>([
    { id: '1', title: 'The Future of Web Development', content: '...', status: 'published', author: 'AI Assistant' },
    { id: '2', title: 'Why Design Systems Matter', content: '...', status: 'scheduled', scheduledDate: '2023-12-25', author: 'AI Assistant' },
  ]);

  const generatePost = async () => {
    if (!topic) return;
    setIsGenerating(true);
    try {
      const result = await geminiService.generateBlogPost(topic);
      const newPost: BlogPost = {
        id: Math.random().toString(36).substr(2, 9),
        title: result.title,
        content: result.content,
        status: 'draft',
        author: 'Gemini AI'
      };
      setPosts([newPost, ...posts]);
      setTopic('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const deletePost = (id: string) => {
    setPosts(posts.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="bg-ash-medium rounded-2xl border border-ash-border p-8 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-azure/10 rounded-lg border border-azure/20">
            <Sparkles className="w-6 h-6 text-azure" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-azure">AI Content Generator</h2>
            <p className="text-sm text-azure/40">Generate SEO-optimized blog posts in seconds with Gemini Pro.</p>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <input 
            type="text" 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="What should we write about today?"
            className="flex-1 px-4 py-3 bg-ash border border-ash-border rounded-xl text-azure focus:outline-none focus:ring-1 focus:ring-azure transition-all"
          />
          <button 
            onClick={generatePost}
            disabled={isGenerating || !topic}
            className="btn-metallic text-azure-light hover:text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center space-x-2 shadow-lg shadow-azure/5 border border-azure/10"
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <><PenTool className="w-5 h-5" /><span>Draft Post</span></>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-lg font-bold flex items-center text-azure">
            <Calendar className="w-5 h-5 mr-2 text-azure" />
            Scheduled & Recent Posts
          </h3>
          {posts.map((post) => (
            <div key={post.id} className="bg-ash-medium p-6 rounded-2xl border border-ash-border shadow-sm group hover:border-azure/30 transition-all relative">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-bold border ${
                  post.status === 'published' ? 'bg-green-400/10 text-green-400 border-green-400/20' : 
                  post.status === 'scheduled' ? 'bg-azure/10 text-azure border-azure/20' : 'bg-ash-light text-azure/40 border-ash-border'
                }`}>
                  {post.status}
                </span>
                <div className="flex space-x-2">
                  <button className="p-2 text-azure/20 hover:text-azure transition-colors">
                    <Save className="w-4 h-4" />
                  </button>
                  <button onClick={() => deletePost(post.id)} className="p-2 text-azure/20 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h4 className="font-bold text-azure text-lg mb-2">{post.title}</h4>
              <p className="text-azure/40 text-sm line-clamp-3 mb-4">{post.content.length > 10 ? post.content : "No content generated yet..."}</p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-ash-border">
                <div className="flex items-center text-xs text-azure/30 italic">
                  <Clock className="w-3 h-3 mr-1" />
                  {post.scheduledDate ? `Scheduled for ${post.scheduledDate}` : 'Created today'}
                </div>
                <button className="text-sm font-bold text-azure hover:text-azure-bright transition-colors">Edit Post</button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-ash-medium rounded-2xl border border-ash-border p-8 shadow-sm flex flex-col items-center justify-center text-center space-y-4 h-fit sticky top-8">
          <div className="w-16 h-16 bg-ash text-azure rounded-full flex items-center justify-center border border-azure/10">
            <Plus className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-azure">Post Scheduler</h3>
          <p className="text-azure/40 text-sm max-w-xs">
            Pick a date and let our AI publish your content automatically across all your social channels.
          </p>
          <input 
            type="date" 
            className="w-full px-4 py-3 bg-ash border border-ash-border rounded-xl text-azure focus:outline-none focus:ring-1 focus:ring-azure"
          />
          <button className="w-full py-4 btn-metallic text-azure-light hover:text-white rounded-xl font-bold transition-all shadow-lg shadow-azure/5 border border-azure/10">
            Confirm Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogManager;
