import { useMemo } from "react";

interface CardProps {
  id: string;
  content: string;
  tags: string[];
  score: number;
}

const BG_COLORS = [
  "#fffde7", // 淡黄
  "#fce4ec", // 淡粉
  "#e3f2fd", // 淡蓝
  "#f3e5f5", // 淡紫
  "#e8f5e9", // 淡绿
];

const STICKERS = ["✦", "♡", "✿", "☆", "◇", "❋", "✧"];

export function Card({ id, content, tags, score }: CardProps) {
  const style = useMemo(() => {
    const seed = id.charCodeAt(0) + id.charCodeAt(id.length - 1);
    return {
      bg: BG_COLORS[seed % BG_COLORS.length]!,
      rotate: (seed % 7) - 3,
      sticker: STICKERS[seed % STICKERS.length],
      stickerPos: seed % 2 === 0 ? "left" : "right",
    };
  }, [id]);

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
      <span
        className="card-sticker"
        style={{ [style.stickerPos]: "8px" }}
      >
        {style.sticker}
      </span>
      <p className="card-content">{content}</p>
      <div className="card-tags">
        {tags.map((tag) => (
          <span key={tag} className="card-tag">{tag}</span>
        ))}
      </div>
      <div className="card-score">抽象指数 {score}/10</div>
      <div className="card-actions">
        <button className="card-btn" onClick={handleCopy}>复制</button>
        <button className="card-btn" onClick={handleShare}>分享</button>
      </div>
    </div>
  );
}
