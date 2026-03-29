import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import { CardContent, getCardStyle } from "./CardContent";

interface SwipeCardProps {
  id: string;
  content: string;
  tags: string[];
  score: number;
  onSwipe: (direction: "left" | "right") => void;
  active: boolean;
}

const SWIPE_THRESHOLD = 120;
const VELOCITY_THRESHOLD = 400;

export function SwipeCard({ id, content, tags, score, onSwipe, active }: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-18, 0, 18]);
  const leftOpacity = useTransform(x, [-150, -30], [1, 0]);
  const rightOpacity = useTransform(x, [30, 150], [0, 1]);

  const style = getCardStyle(id);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const { offset, velocity } = info;
    if (offset.x > SWIPE_THRESHOLD || velocity.x > VELOCITY_THRESHOLD) {
      onSwipe("right");
    } else if (offset.x < -SWIPE_THRESHOLD || velocity.x < -VELOCITY_THRESHOLD) {
      onSwipe("left");
    }
  };

  return (
    <motion.div
      className="absolute flex h-full w-full items-center justify-center"
      style={{ zIndex: active ? 10 : 0 }}
    >
      <motion.div
        className="relative w-[85vw] max-w-sm cursor-grab rounded-[4px_20px_4px_20px] border-2 border-dashed border-black/10 p-6 shadow-[4px_6px_0_rgba(0,0,0,0.15),0_8px_20px_rgba(0,0,0,0.1)] active:cursor-grabbing"
        style={{
          x: active ? x : 0,
          rotate: active ? rotate : 0,
          backgroundColor: style.bg,
        }}
        drag={active ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.9}
        onDragEnd={active ? handleDragEnd : undefined}
        initial={active ? { scale: 1, y: 0 } : { scale: 0.95, y: 12 }}
        animate={active ? { scale: 1, y: 0 } : { scale: 0.95, y: 12 }}
        exit={{
          x: x.get() > 0 ? 500 : -500,
          opacity: 0,
          rotate: x.get() > 0 ? 30 : -30,
          transition: { duration: 0.3 },
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {/* 方向提示 */}
        {active && (
          <>
            <motion.div
              className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-[4px_20px_4px_20px] bg-rose-400/20"
              style={{ opacity: leftOpacity }}
            >
              <span className="text-3xl font-bold text-rose-500">跳过</span>
            </motion.div>
            <motion.div
              className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-[4px_20px_4px_20px] bg-emerald-400/20"
              style={{ opacity: rightOpacity }}
            >
              <span className="text-3xl font-bold text-emerald-500">复制</span>
            </motion.div>
          </>
        )}

        <CardContent
          id={id}
          content={content}
          tags={tags}
          score={score}
          expanded
        />
      </motion.div>
    </motion.div>
  );
}
