const SwitchName: React.FC<{
  value: boolean;
  setValue: (v: boolean) => void;
}> = ({ value, setValue }) => (
  <div className="flex flex-col items-center w-fit gap-4 h-10">
    <button
      type="button"
      aria-pressed={value}
      onClick={() => setValue(!value)}
      className={`relative inline-flex h-10 items-center rounded-xl border-1 cursor-pointer transition-colors focus:outline-none bg-muted-background shadow-switch-box z-1 ${
        !value ? "border-accent" : "border-border"
      }`}
    >
      <span
        className={`relative font-inter font-semibold text-xs leading-4 tracking-thin transition-all duration-500 mr-2 px-3 z-3 ${
          !value ? "text-muted" : "text-foreground"
        } `}
      >
        Безкоштовно
      </span>
      <span
        className={`relative font-inter font-semibold text-xs leading-4 tracking-thin transition-all duration-500 px-3 z-3 ${
          !value ? "text-foreground" : "text-muted"
        } `}
      >
        Платно
      </span>
      <div className="absolute w-full h-full top-0 left-0 flex items-center z-2">
        <span
          className={`inline-block h-8 transform rounded-lg bg-text-white shadow-switch-btn transition-all duration-500 ${
            value ? "translate-x-[3px] w-[96px]" : "translate-x-28 w-[62px]"
          }`}
        />
      </div>
    </button>
  </div>
);
export default SwitchName;
