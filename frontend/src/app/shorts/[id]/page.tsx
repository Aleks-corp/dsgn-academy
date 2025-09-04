"use client";

import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import ShortsViewer from "@/components/shorts/viewer/ShortsViewer";

export default function ShortPage() {
  const searchParams = useSearchParams();
  const { id } = useParams<{ id: string }>();
  const activeTag = searchParams.get("filter") || undefined;

  // Scroll lock for immersive viewer
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div className="relative h-[calc(100vh-80px)] w-full">
      {/* account for header height if any */}
      <ShortsViewer shortId={id} tag={activeTag} />
    </div>
  );
}
