import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import { CardContent, getCardStyle } from "./CardContent";

interface SwipeCardProps {
  id: string;
  content: string;
  onSwipe: (direction: "left" | "right") => void;
  active: boolean;
}

const SWIPE_THRESHOLD = 120;
const VELOCITY_THRESHOLD = 400;

export function SwipeCard({ id, content, onSwipe, active }: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-18, 0, 18]);

  const cardStyle = getCardStyle(id);

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
        className="relative w-[85vw] max-w-sm"
        style={{
          x: active ? x : 0,
          rotate: active ? rotate : 0,
          backgroundColor: cardStyle.bg,
          padding: 20,
          borderRadius: "4px 20px 4px 20px",
          border: "2px dashed rgba(0,0,0,0.1)",
          boxShadow: "4px 6px 0 rgba(0,0,0,0.15), 0 8px 20px rgba(0,0,0,0.1)",
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
        <CardContent id={id} content={content} expanded />
      </motion.div>
    </motion.div>
  );
}
