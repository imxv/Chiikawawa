import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import type { PostWithTags } from "../lib/database.types";

export function usePosts() {
  return useQuery({
    queryKey: ["posts"],
    queryFn: async (): Promise<PostWithTags[]> => {
      const { data: posts, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (!posts || posts.length === 0) return [];

      const postIds = posts.map((p) => p.id);

      const { data: relations, error: relError } = await supabase
        .from("post_tags")
        .select("post_id, tags(name)")
        .in("post_id", postIds);

      if (relError) throw relError;

      const tagsByPostId = new Map<string, string[]>();
      for (const rel of relations ?? []) {
        const tagName = (rel.tags as unknown as { name: string })?.name;
        if (!tagName) continue;
        const existing = tagsByPostId.get(rel.post_id) ?? [];
        existing.push(tagName);
        tagsByPostId.set(rel.post_id, existing);
      }

      return posts.map((post) => ({
        ...post,
        tags: tagsByPostId.get(post.id) ?? [],
      }));
    },
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (content: string) => {
      // 随机选标签和打分（原后端逻辑）
      const { data: allTags } = await supabase.from("tags").select("id, name");
      const shuffled = (allTags ?? []).sort(() => Math.random() - 0.5);
      const count = Math.floor(Math.random() * 3) + 2;
      const selectedTags = shuffled.slice(0, count);
      const score = Math.floor(Math.random() * 3) + 8;

      const { data: post, error } = await supabase
        .from("posts")
        .insert({ content, score })
        .select()
        .single();

      if (error) throw error;

      if (selectedTags.length > 0) {
        await supabase.from("post_tags").insert(
          selectedTags.map((tag) => ({ post_id: post.id, tag_id: tag.id }))
        );
      }

      return { ...post, tags: selectedTags.map((t) => t.name) };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useTags() {
  return useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tags")
        .select("id, name")
        .order("name");
      if (error) throw error;
      return data;
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      content,
      tags,
    }: {
      id: string;
      content: string;
      tags: string[];
    }) => {
      const { data: updated, error } = await supabase
        .from("posts")
        .update({ content })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      // 删除旧标签关联，插入新的
      await supabase.from("post_tags").delete().eq("post_id", id);

      if (tags.length > 0) {
        const { data: tagRecords } = await supabase
          .from("tags")
          .select("id, name")
          .in("name", tags);

        if (tagRecords && tagRecords.length > 0) {
          await supabase.from("post_tags").insert(
            tagRecords.map((tag) => ({ post_id: updated.id, tag_id: tag.id }))
          );
        }

        return { ...updated, tags: tagRecords?.map((r) => r.name) ?? [] };
      }

      return { ...updated, tags: [] };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
