"use client";

import Image from "next/image";
import { useState } from "react";

export default function SafeImage({
  src,
  alt,
  width,
  height,
  className,
  priority,
}: {
  src: string | null | undefined;
  alt?: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}) {
  const [error, setError] = useState(false);

  return (
    <Image
      src={error || !src ? "/images/placeholder.png" : src}
      alt={alt || "no image"}
      width={width}
      height={height}
      className={`w-full h-full ${className}`}
      onError={() => setError(true)}
      priority={priority ? priority : false}
    />
  );
}
