import { useState } from 'react';
import { Bookmark, BookmarkCheck, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SaveAnswerButtonProps {
  question: string;
  answer: string;
  sourceInfo?: {
    evidence?: Array<{ document?: string; page?: string; text?: string }>;
    confidence?: string;
  };
  chatId?: string;
  messageId?: string;
}

const SaveAnswerButton = ({ question, answer, sourceInfo, chatId, messageId }: SaveAnswerButtonProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!user || isSaved) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('saved_answers')
        .insert({
          user_id: user.id,
          question,
          answer,
          source_info: sourceInfo || null,
          chat_id: chatId || null,
          message_id: messageId || null,
        });

      if (error) throw error;

      setIsSaved(true);
      toast({
        title: 'Answer saved',
        description: 'Added to your knowledge cards.',
      });
    } catch (error) {
      console.error('Error saving answer:', error);
      toast({
        title: 'Failed to save',
        description: 'Could not save this answer. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={isLoading || isSaved}
      className="p-1.5 rounded-full hover:bg-white/20 transition-colors disabled:opacity-50"
      title={isSaved ? 'Saved to knowledge cards' : 'Save to knowledge cards'}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
      ) : isSaved ? (
        <BookmarkCheck className="w-4 h-4 text-primary" />
      ) : (
        <Bookmark className="w-4 h-4 text-muted-foreground" />
      )}
    </button>
  );
};

export default SaveAnswerButton;
