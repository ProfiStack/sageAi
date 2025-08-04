'use client';

import { useSkinResultStore } from "@/store/skinResult";

export default function ResultsPage() {
  const html = useSkinResultStore((state) => state.html);

  if (!html) return <p>No results yet.</p>;

  return (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  );
}
