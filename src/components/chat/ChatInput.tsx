import { useState } from 'react';
import { Paperclip, Mic, Send, MicOff, Loader2 } from 'lucide-react';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  onFileUpload?: () => void;
  disabled?: boolean;
  placeholder?: string;
}

const ChatInput = ({ onSend, onFileUpload, disabled = false, placeholder = "Ask anything...." }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const { isRecording, isProcessing, toggleRecording } = useVoiceRecording({
    onTranscript: (text) => {
      setMessage(prev => prev ? `${prev} ${text}` : text);
      toast({
        title: 'Voice captured',
        description: 'Your speech has been converted to text.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Voice input error',
        description: error,
        variant: 'destructive',
      });
    },
  });

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="glass-input rounded-full px-4 py-3 flex items-center gap-3">
      {onFileUpload && (
        <button 
          onClick={onFileUpload}
          className="p-2 rounded-full hover:bg-gray-200/50 transition-colors"
          disabled={disabled}
          title="Upload file"
        >
          <Paperclip className="w-5 h-5 text-gray-500" />
        </button>
      )}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isRecording ? "Listening..." : placeholder}
        disabled={disabled || isRecording}
        className="flex-1 bg-transparent outline-none text-gray-700 placeholder:text-gray-500"
      />
      <div className="flex items-center gap-2">
        <button 
          onClick={toggleRecording}
          className={cn(
            "p-2 rounded-full transition-colors",
            isRecording 
              ? "bg-red-500 hover:bg-red-600" 
              : "hover:bg-gray-200/50"
          )}
          disabled={disabled || isProcessing}
          title={isRecording ? "Stop recording" : "Start voice input"}
        >
          {isProcessing ? (
            <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
          ) : isRecording ? (
            <MicOff className="w-5 h-5 text-white" />
          ) : (
            <Mic className="w-5 h-5 text-gray-500" />
          )}
        </button>
        {message.trim() && (
          <button 
            onClick={handleSend}
            disabled={disabled}
            className="p-2 rounded-full bg-primary hover:bg-primary/90 transition-colors"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatInput;
