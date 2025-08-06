"use client";
import { useLenis } from "@/lib/lenis.hook";

export default function LenisProvider() {
  useLenis();
  return null; // не рендерить нічого у DOM, лише підключає скролл
}
