import { useRef, useState, useMemo, useEffect } from "react";
import { usePosts, useCreatePost } from "./hooks/usePosts";
import { useIsMobile } from "./hooks/useIsMobile";
import { Card } from "./components/Card";
import { SwipeDeck } from "./components/SwipeDeck";

export function App() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const { data: posts, isLoading } = usePosts();
  const { mutate, isPending } = useCreatePost();
  const isMobile = useIsMobile();

  const handleSubmit = () => {
    const content = textareaRef.current?.value.trim();
    if (!content) return;
    mutate(content, {
      onSuccess: () => {
        if (textareaRef.current) textareaRef.current.value = "";
        setIsExpanded(false);
      },
    });
  };

  const handleBlur = () => {
    if (!textareaRef.current?.value.trim()) {
      setIsExpanded(false);
    }
  };

  // 防抖处理搜索查询
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 全局快捷键：Ctrl+F / Cmd+F 聚焦搜索框
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    if (!debouncedQuery.trim()) return posts;

    const query = debouncedQuery.toLocaleLowerCase().trim();

    return posts.filter(post => {
      const contentMatch = post.content.toLocaleLowerCase().includes(query);
      const tagsMatch = post.tags.some(tag =>
        tag.toLocaleLowerCase().includes(query)
      );
      return contentMatch || tagsMatch;
    });
  }, [posts, debouncedQuery]);

  return (
    <>
      {isLoading && <p className="loading">加载中...</p>}

      {isMobile ? (
        <SwipeDeck posts={filteredPosts} />
      ) : (
        <>
          <div className="search-container">
            <input
              ref={searchInputRef}
              type="text"
              className="search-input"
              placeholder="搜索文案或标签... (Ctrl+F / ⌘F)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="搜索文案或标签"
            />
            {searchQuery && (
              <button
                className="search-clear"
                onClick={() => setSearchQuery("")}
                aria-label="清除搜索"
              >
                ✕
              </button>
            )}
          </div>

          {!isLoading && filteredPosts.length === 0 && searchQuery && (
            <p className="no-results">未找到匹配的内容</p>
          )}

          <div className="masonry">
            {filteredPosts.map((post) => (
              <Card
                key={post.id}
                id={post.id}
                content={post.content}
                tags={post.tags}
              />
            ))}
          </div>
        </>
      )}

      {!isMobile && (
        <div className={`floating-input ${isExpanded ? "expanded" : ""}`}>
          <textarea
            ref={textareaRef}
            className="floating-textarea"
            rows={isExpanded ? 4 : 1}
            onFocus={() => setIsExpanded(true)}
            onBlur={handleBlur}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="发一条抽象文案..."
          />
          <button
            className="floating-btn"
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? "发布中..." : "发布"}
          </button>
        </div>
      )}
    </>
  );
}
