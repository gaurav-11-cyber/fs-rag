import { User } from 'lucide-react';

interface Evidence {
  document?: string;
  page?: string;
  text?: string;
}

interface ChatBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  evidence?: Evidence[];
  confidence?: string;
  isLoading?: boolean;
}

const ChatBubble = ({ role, content, evidence, confidence, isLoading = false }: ChatBubbleProps) => {
  if (role === 'user') {
    return (
      <div className="flex flex-col items-end animate-fade-in">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <User className="w-4 h-4 text-muted-foreground" />
          </div>
          <span className="text-sm text-foreground font-medium">You</span>
        </div>
        <div className="chat-bubble-user rounded-2xl rounded-tr-md px-4 py-3 max-w-[85%]">
          <p className="text-sm">{content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start animate-fade-in">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <span className="text-xs font-bold text-white">FS</span>
        </div>
        <span className="text-sm text-foreground font-medium">FS RAG</span>
      </div>
      <div className="chat-bubble-assistant rounded-2xl rounded-tl-md px-4 py-4 max-w-[85%]">
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-sm text-gray-700 whitespace-pre-wrap">{content}</div>
            
            {evidence && evidence.length > 0 && (
              <div className="border-t border-gray-200 pt-3 mt-3">
                <p className="text-xs font-semibold text-gray-600 mb-2">Evidence:</p>
                {evidence.map((e, idx) => (
                  <div key={idx} className="text-xs text-gray-500 mb-1">
                    {e.document && <span>• Document: {e.document}</span>}
                    {e.page && <span> | Page: {e.page}</span>}
                    {e.text && <p className="ml-2 italic">"{e.text}"</p>}
                  </div>
                ))}
              </div>
            )}
            
            {confidence && (
              <div className="text-xs text-gray-500">
                <span className="font-medium">Confidence:</span> {confidence}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
