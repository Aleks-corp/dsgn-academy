import MaskIcon from "../MaskIcon";

function SupportBtn({
  setIsSupportOpen,
}: {
  setIsSupportOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <button
      onClick={() => setIsSupportOpen((prev) => !prev)}
      aria-label="support-button"
      className="p-2 rounded-full bg-muted-background hover:bg-border transition cursor-pointer shadow-count"
    >
      <MaskIcon src="/icons/menu-icons/headphone-alt.svg" className="w-6 h-6" />
    </button>
  );
}
export default SupportBtn;
