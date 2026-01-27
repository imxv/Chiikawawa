import { useRef } from "react";
import { usePosts, useCreatePost } from "./hooks/usePosts";
import { Card } from "./components/Card";

export function App() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { data: posts, isLoading } = usePosts();
  const { mutate, isPending } = useCreatePost();

  const handleSubmit = () => {
    const content = textareaRef.current?.value.trim();
    if (!content) return;
    mutate(content, {
      onSuccess: () => {
        if (textareaRef.current) textareaRef.current.value = "";
      },
    });
  };

  return (
    <>
      <div className="header">
        <h1 className="title">抽象文案分享</h1>
        <textarea
          ref={textareaRef}
          className="textarea"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="发一条抽象文案... (Enter 发布)"
        />
        {isPending && <p className="loading">AI 正在发疯...</p>}
      </div>

      {isLoading && <p className="loading">加载中...</p>}

      <div className="masonry">
        {posts?.map((post) => (
          <Card
            key={post.id}
            id={post.id}
            content={post.content}
            tags={post.tags}
            score={post.score}
          />
        ))}
      </div>
    </>
  );
}
