import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Trash2, Bookmark, FileText, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import BottomNav from '@/components/ui/bottom-nav';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Chat {
  id: string;
  title: string;
  created_at: string;
  is_saved: boolean;
}

interface SavedAnswer {
  id: string;
  question: string;
  answer: string;
  source_info: {
    evidence?: Array<{ document?: string; page?: string; text?: string }>;
    confidence?: string;
  } | null;
  created_at: string;
}

const Saved = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [chats, setChats] = useState<Chat[]>([]);
  const [savedAnswers, setSavedAnswers] = useState<SavedAnswer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      // Fetch chats
      const { data: chatsData } = await supabase
        .from('chats')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (chatsData) {
        setChats(chatsData);
      }

      // Fetch saved answers
      const { data: answersData } = await supabase
        .from('saved_answers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (answersData) {
        setSavedAnswers(answersData as SavedAnswer[]);
      }

      setLoading(false);
    };

    fetchData();
  }, [user]);

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
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

  const handleDeleteAnswer = async (answerId: string) => {
    const { error } = await supabase
      .from('saved_answers')
      .delete()
      .eq('id', answerId);

    if (!error) {
      setSavedAnswers(prev => prev.filter(a => a.id !== answerId));
      toast({
        title: 'Card removed',
        description: 'The knowledge card has been removed.',
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
        <h1 className="text-xl font-semibold text-foreground">Saved</h1>
      </header>

      {/* Tabs */}
      <Tabs defaultValue="cards" className="px-4">
        <TabsList className="grid w-full grid-cols-2 bg-white/20">
          <TabsTrigger value="cards" className="data-[state=active]:bg-white">
            <Bookmark className="w-4 h-4 mr-2" />
            Knowledge Cards
          </TabsTrigger>
          <TabsTrigger value="chats" className="data-[state=active]:bg-white">
            <MessageSquare className="w-4 h-4 mr-2" />
            Chat History
          </TabsTrigger>
        </TabsList>

        {/* Knowledge Cards */}
        <TabsContent value="cards" className="mt-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-32 rounded-2xl shimmer" />
              ))}
            </div>
          ) : savedAnswers.length > 0 ? (
            <div className="space-y-4">
              {savedAnswers.map((answer) => (
                <div
                  key={answer.id}
                  className="glass-card rounded-2xl p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Bookmark className="w-4 h-4 text-primary" />
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(answer.created_at)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteAnswer(answer.id)}
                      className="p-1 rounded-full hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-800 mb-1">Q: {answer.question}</p>
                    <p className="text-sm text-gray-600 line-clamp-3">{answer.answer}</p>
                  </div>

                  {answer.source_info?.evidence && answer.source_info.evidence.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <FileText className="w-3 h-3" />
                      <span>
                        {answer.source_info.evidence[0].document || 'Document source'}
                      </span>
                      {answer.source_info.confidence && (
                        <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          {answer.source_info.confidence}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bookmark className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No saved answers</h3>
              <p className="text-muted-foreground text-sm">
                Save important AI responses to access them later.
              </p>
            </div>
          )}
        </TabsContent>

        {/* Chat History */}
        <TabsContent value="chats" className="mt-4">
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
                    onClick={(e) => handleDeleteChat(chat.id, e)}
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
        </TabsContent>
      </Tabs>

      <BottomNav />
    </div>
  );
};

export default Saved;
