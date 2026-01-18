interface ChatHistoryTagProps {
  title: string;
  onClick: () => void;
}

const ChatHistoryTag = ({ title, onClick }: ChatHistoryTagProps) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 glass-card rounded-full text-sm text-gray-700 hover:bg-white/90 transition-colors truncate max-w-[180px]"
    >
      {title}
    </button>
  );
};

export default ChatHistoryTag;
