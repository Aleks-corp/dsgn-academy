export default function useScrollToTop() {
  return () => {
    const el = document.getElementById("app-scroll-container");
    if (el) {
      el.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
}
