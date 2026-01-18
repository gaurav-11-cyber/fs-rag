import { useNavigate } from 'react-router-dom';
import { MessageSquare, FileText, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FeatureCard from '@/components/landing/FeatureCard';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

const Landing = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const features = [
    {
      icon: MessageSquare,
      title: 'Remembers context',
      description: 'across text, images, and documents.',
    },
    {
      icon: FileText,
      title: 'Understands text, images,',
      description: 'PDFs, and structured data.',
    },
    {
      icon: CheckCircle,
      title: 'Retrieves verified data for',
      description: 'accurate, grounded responses.',
    },
  ];

  return (
    <div className="min-h-screen gradient-bg flex flex-col">
      {/* Header */}
      <header className="pt-12 pb-8 text-center">
        <h1 className="text-lg font-semibold text-foreground tracking-wide">FS RAG</h1>
        <p className="text-xs text-muted-foreground tracking-widest uppercase">
          Multimodal RAG System
        </p>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary leading-tight mb-2">
            Ask anything.
          </h2>
          <h2 className="text-4xl font-bold text-primary leading-tight">
            Get answers
          </h2>
          <h2 className="text-4xl font-bold text-primary leading-tight">
            with proof.
          </h2>
        </div>

        {/* Features */}
        <div className="space-y-4 max-w-md mx-auto w-full">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 100}
            />
          ))}
        </div>
      </main>

      {/* Footer buttons */}
      <footer className="p-6 pb-8">
        <div className="flex gap-4 max-w-md mx-auto">
          <Button
            variant="outline"
            className="flex-1 h-12 rounded-full glass-card border-0 text-gray-700 font-medium hover:bg-white/90"
            onClick={() => navigate('/auth?mode=login')}
          >
            Login
          </Button>
          <Button
            className="flex-1 h-12 rounded-full bg-primary/80 hover:bg-primary text-white font-medium"
            onClick={() => navigate('/auth?mode=signup')}
          >
            Sign Up
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
