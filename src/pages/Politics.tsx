import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/ui/bottom-nav';

const Politics = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-bg pb-24">
      <header className="px-6 pt-12 pb-6 flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full glass-card flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Politics</h1>
      </header>

      <main className="px-6">
        <div className="glass-card rounded-2xl p-6">
          <p className="text-muted-foreground text-center">
            Political updates coming soon...
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Politics;
