interface ExploreCardProps {
  title?: string;
  onClick?: () => void;
}

const ExploreCard = ({ title, onClick }: ExploreCardProps) => {
  return (
    <button
      onClick={onClick}
      className="aspect-square glass-card rounded-2xl flex items-center justify-center hover:bg-white/90 transition-colors p-4"
    >
      {title && (
        <span className="text-sm text-gray-600 text-center">{title}</span>
      )}
    </button>
  );
};

export default ExploreCard;
