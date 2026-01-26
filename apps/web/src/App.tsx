import { useMutation } from "@tanstack/react-query";
import { api } from "./lib/api";

export function App() {
  const { mutate, data, isPending } = useMutation({
    mutationFn: async (content: string) => {
      const { data, error } = await api.analyze.post({ content });
      if (error) throw error;
      return data;
    }
  })

  return (
    <div className="container">
      <h1 className="title">抽象文案一键打标</h1>
      <textarea
        className="textarea"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            mutate(e.currentTarget.value);
          }
        }}
        placeholder="输入文案后按回车..."
      />

      {isPending && <p className="loading">AI 正在发疯...</p>}

      {data && (
        <div className="result">
          <div className="result-item">
            <span className="result-label">建议标签</span>
            <div className="tags">
              {data.tags.map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>
          <div className="result-item">
            <span className="result-label">抽象指数</span>
            <span className="score">{data.score}/10</span>
          </div>
        </div>
      )}
    </div>
  )
}
