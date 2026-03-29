import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { SwipeCard } from "./SwipeCard";
import { Toast } from "./Toast";
import type { PostWithTags } from "../lib/database.types";

interface SwipeDeckProps {
  posts: PostWithTags[];
}

export function SwipeDeck({ posts }: SwipeDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [toast, setToast] = useState({ visible: false, message: "" });

  const showToast = useCallback((message: string) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: "" }), 1500);
  }, []);

  const handleSwipe = useCallback(
    (direction: "left" | "right") => {
      const post = posts[currentIndex];
      if (direction === "right" && post) {
        navigator.clipboard.writeText(post.content);
        showToast("已复制到剪贴板 ✓");
      }
      setCurrentIndex((prev) => prev + 1);
    },
    [currentIndex, posts, showToast]
  );

  const handleBack = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      showToast("已返回上一张");
    }
  }, [currentIndex, showToast]);

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
        <Toast message={toast.message} visible={toast.visible} />
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
            tags={post.tags}
            score={post.score}
            onSwipe={handleSwipe}
            active={i === 0}
          />
        ))}
      </AnimatePresence>
      {currentIndex > 0 && (
        <button
          onClick={handleBack}
          className="absolute left-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow-md backdrop-blur-sm transition-transform active:scale-90"
          aria-label="返回上一张"
        >
          <span className="text-lg">↩</span>
        </button>
      )}
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}
