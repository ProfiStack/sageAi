"use client";

import SettingsHeader from "@/CustomComponents/settingsHeader/settingsHeader";
import { useSkinResultStore } from "@/store/skinResult";

export default function ResultsPage() {
  const html = useSkinResultStore((state) => state.html);

  if (!html) return <p>No results yet.</p>;

  return (
    <>
      <SettingsHeader title={"Result"} />

      <div dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
