import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import BottomNav from '@/components/ui/bottom-nav';
import { useToast } from '@/hooks/use-toast';

interface Chat {
  id: string;
  title: string;
  created_at: string;
  is_saved: boolean;
}

const Saved = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      if (!user) return;

      const { data } = await supabase
        .from('chats')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (data) {
        setChats(data);
      }
      setLoading(false);
    };

    fetchChats();
  }, [user]);

  const handleDelete = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const { error } = await supabase
      .from('chats')
      .delete()
      .eq('id', chatId);

    if (!error) {
      setChats(prev => prev.filter(c => c.id !== chatId));
      toast({
        title: 'Chat deleted',
        description: 'The chat has been removed.',
      });
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen gradient-bg pb-24">
      {/* Header */}
      <header className="px-4 py-4 flex items-center gap-4">
        <button 
          onClick={() => navigate('/dashboard')}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-xl font-semibold text-foreground">Chat History</h1>
      </header>

      {/* Chats list */}
      <main className="px-6 py-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-2xl shimmer" />
            ))}
          </div>
        ) : chats.length > 0 ? (
          <div className="space-y-4">
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => navigate(`/chat/${chat.id}`)}
                className="w-full glass-card rounded-2xl p-4 flex items-center gap-4 hover:bg-white/90 transition-colors text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-800 truncate">{chat.title}</h3>
                  <p className="text-sm text-gray-500">{formatDate(chat.created_at)}</p>
                </div>
                <button
                  onClick={(e) => handleDelete(chat.id, e)}
                  className="p-2 rounded-full hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No chats yet</h3>
            <p className="text-muted-foreground">Start a new conversation to see it here.</p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Saved;
