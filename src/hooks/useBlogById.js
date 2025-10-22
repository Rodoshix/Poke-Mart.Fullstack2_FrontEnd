// hook usado en BlogDetailPage.jsx
// src/hooks/useBlogById.js
import { useEffect, useMemo, useState } from "react";
import blogsData from "@/data/blogs.json";

export function useBlogById(id) {
  const [notFound, setNotFound] = useState(false);

  const blog = useMemo(() => {
    const list = Array.isArray(blogsData) ? blogsData : [];
    const item = list.find((b) => String(b.id) === String(id));
    return item || null;
  }, [id]);

  useEffect(() => setNotFound(!blog), [blog]);

  return { blog, notFound };
}
