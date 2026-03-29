import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { SwipeCard } from "./SwipeCard";
import type { PostWithTags } from "../lib/database.types";

interface SwipeDeckProps {
  posts: PostWithTags[];
}

export function SwipeDeck({ posts }: SwipeDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipe = useCallback(
    (direction: "left" | "right") => {
      if (direction === "left") {
        setCurrentIndex((prev) => prev + 1);
      } else if (direction === "right") {
        if (currentIndex > 0) {
          setCurrentIndex((prev) => prev - 1);
        }
      }
    },
    [currentIndex]
  );

  const handleReset = () => setCurrentIndex(0);

  if (posts.length === 0) {
    return (
      <div className="flex h-[calc(100vh-160px)] items-center justify-center">
        <p className="text-lg text-gray-400">还没有文案</p>
      </div>
    );
  }

  if (currentIndex >= posts.length) {
    return (
      <div className="flex h-[calc(100vh-160px)] flex-col items-center justify-center gap-4">
        <p className="text-lg text-gray-400">刷完了~</p>
        <button
          onClick={handleReset}
          className="rounded-full bg-black/80 px-6 py-2.5 text-sm text-white shadow-lg transition-transform active:scale-95"
        >
          再刷一遍
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-160px)] w-full overflow-hidden">
      <AnimatePresence>
        {posts.slice(currentIndex, currentIndex + 2).map((post, i) => (
          <SwipeCard
            key={post.id}
            id={post.id}
            content={post.content}
            onSwipe={handleSwipe}
            active={i === 0}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
