import { useRef } from "react";

export const useDragScroll = () => {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseDown = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;

    el.dataset.down = "true";
    el.dataset.startX = String(e.pageX - el.offsetLeft);
    el.dataset.scrollLeft = String(el.scrollLeft);
  };

  const onMouseLeaveOrUp = () => {
    const el = ref.current;
    if (!el) return;
    el.dataset.down = "false";
  };

  const onMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || el.dataset.down !== "true") return;

    e.preventDefault();
    const startX = parseInt(el.dataset.startX || "0", 10);
    const scrollLeft = parseInt(el.dataset.scrollLeft || "0", 10);
    const x = e.pageX - el.offsetLeft;
    el.scrollLeft = scrollLeft - (x - startX);
  };

  return {
    ref,
    onMouseDown,
    onMouseLeave: onMouseLeaveOrUp,
    onMouseUp: onMouseLeaveOrUp,
    onMouseMove,
  };
};
