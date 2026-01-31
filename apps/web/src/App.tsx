import { useRef, useState, useMemo } from "react";
import { usePosts, useCreatePost } from "./hooks/usePosts";
import { Card } from "./components/Card";

export function App() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: posts, isLoading } = usePosts();
  const { mutate, isPending } = useCreatePost();

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

  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    if (!searchQuery.trim()) return posts;

    const query = searchQuery.toLowerCase().trim();

    return posts.filter(post => {
      const contentMatch = post.content.toLowerCase().includes(query);
      const tagsMatch = post.tags.some(tag =>
        tag.toLowerCase().includes(query)
      );
      return contentMatch || tagsMatch;
    });
  }, [posts, searchQuery]);

  return (
    <>
      {isLoading && <p className="loading">加载中...</p>}

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="搜索文案或标签..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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

      {filteredPosts.length === 0 && searchQuery && (
        <p className="no-results">未找到匹配的内容</p>
      )}

      <div className="masonry">
        {filteredPosts.map((post) => (
          <Card
            key={post.id}
            id={post.id}
            content={post.content}
            tags={post.tags}
            score={post.score}
          />
        ))}
      </div>

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
    </>
  );
}
