const Switch: React.FC<{
  value: boolean;
  setValue: (v: boolean) => void;
  name?: string;
}> = ({ value, setValue, name }) => (
  <button
    type="button"
    aria-pressed={value}
    onClick={() => setValue(!value)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors focus:outline-none ${
      value ? "bg-blue-600" : "bg-gray-300"
    }`}
  >
    <span
      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
        value ? "translate-x-5" : "translate-x-1"
      }`}
    />
    {name && (
      <span className="absolute left-1 top-1 text-xs text-gray-500">
        {name}
      </span>
    )}
  </button>
);
export default Switch;
