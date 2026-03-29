import { useMemo } from "react";

interface CardContentProps {
  id: string;
  content: string;
  expanded?: boolean;
}

const BG_COLORS = [
  "#fffde7", // 淡黄
  "#fce4ec", // 淡粉
  "#e3f2fd", // 淡蓝
  "#f3e5f5", // 淡紫
  "#e8f5e9", // 淡绿
];

const STICKERS = ["✦", "♡", "✿", "☆", "◇", "❋", "✧"];

const MAX_LENGTH = 150;
const MAX_LINES = 5;

export function getCardStyle(id: string) {
  const seed = id.charCodeAt(0) + id.charCodeAt(id.length - 1);
  return {
    bg: BG_COLORS[seed % BG_COLORS.length]!,
    rotate: (seed % 7) - 3,
    sticker: STICKERS[seed % STICKERS.length],
    stickerPos: seed % 2 === 0 ? ("left" as const) : ("right" as const),
  };
}

export function CardContent({ id, content, expanded = false }: CardContentProps) {
  const style = useMemo(() => getCardStyle(id), [id]);

  const shouldTruncate = useMemo(() => {
    if (expanded) return false;
    const lineCount = (content.match(/\n/g) || []).length + 1;
    return content.length > MAX_LENGTH || lineCount > MAX_LINES;
  }, [content, expanded]);

  const displayContent = useMemo(() => {
    if (!shouldTruncate) return content;
    const lines = content.split("\n");
    if (lines.length > MAX_LINES) {
      return lines.slice(0, MAX_LINES).join("\n") + "...";
    }
    return content.slice(0, MAX_LENGTH) + "...";
  }, [content, shouldTruncate]);

  return (
    <>
      <span
        className="card-sticker"
        style={{ [style.stickerPos]: "8px" }}
      >
        {style.sticker}
      </span>
      <p className="card-content">{displayContent}</p>
    </>
  );
}
