import { useMemo, useState } from "react";
import { EditModal } from "./EditModal";
import { CardContent, getCardStyle } from "./CardContent";

interface CardProps {
  id: string;
  content: string;
  tags: string[];
  score: number;
}

const MAX_LENGTH = 150;
const MAX_LINES = 5;

export function Card({ id, content, tags, score }: CardProps) {
  const [expanded, setExpanded] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const style = useMemo(() => getCardStyle(id), [id]);

  const shouldTruncate = useMemo(() => {
    const lineCount = (content.match(/\n/g) || []).length + 1;
    return content.length > MAX_LENGTH || lineCount > MAX_LINES;
  }, [content]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ text: content });
    } else {
      handleCopy();
    }
  };

  return (
    <div
      className="card"
      style={{
        backgroundColor: style.bg,
        transform: `rotate(${style.rotate}deg)`,
      }}
    >
      <CardContent
        id={id}
        content={content}
        tags={tags}
        score={score}
        expanded={expanded}
      />
      {shouldTruncate && (
        <button
          className="card-expand-btn"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "收起" : "展开全文"}
        </button>
      )}
      <div className="card-actions">
        <button className="card-btn card-btn-icon" onClick={() => setIsEditOpen(true)}>✏️</button>
        <button className="card-btn" onClick={handleCopy}>复制</button>
        <button className="card-btn" onClick={handleShare}>分享</button>
      </div>
      <EditModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} post={{ id, content, tags }} />
    </div>
  );
}
