import { useEffect, useRef, useState } from "react";
import { useTags, useUpdatePost } from "../hooks/usePosts";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: { id: string; content: string; tags: string[] };
}

export function EditModal({ isOpen, onClose, post }: EditModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [content, setContent] = useState(post.content);
  const [selectedTags, setSelectedTags] = useState<string[]>(post.tags);

  const { data: allTags } = useTags();
  const updatePost = useUpdatePost();

  useEffect(() => {
    setContent(post.content);
    setSelectedTags(post.tags);
  }, [post.content, post.tags]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = async () => {
    await updatePost.mutateAsync({ id: post.id, content, tags: selectedTags });
    onClose();
  };

  return (
    <dialog ref={dialogRef} className="edit-modal" onClose={onClose}>
      <div className="edit-modal-header">编辑内容</div>
      <textarea
        className="edit-modal-textarea"
        value={content}
        onChange={e => setContent(e.target.value)}
        rows={6}
      />
      <div className="edit-modal-section">标签</div>
      <div className="edit-modal-tags">
        {allTags?.map(tag => (
          <button
            key={tag.id}
            type="button"
            className={`edit-modal-tag ${selectedTags.includes(tag.name) ? "selected" : ""}`}
            onClick={() => toggleTag(tag.name)}
          >
            {tag.name}
          </button>
        ))}
      </div>
      <div className="edit-modal-actions">
        <button type="button" className="edit-modal-btn cancel" onClick={onClose}>
          取消
        </button>
        <button
          type="button"
          className="edit-modal-btn save"
          onClick={handleSave}
          disabled={updatePost.isPending}
        >
          {updatePost.isPending ? "保存中..." : "保存"}
        </button>
      </div>
    </dialog>
  );
}
