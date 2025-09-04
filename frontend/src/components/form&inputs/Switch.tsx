import Image from "next/image";

const Switch: React.FC<{
  value: boolean;
  setValue: (v: boolean) => void;
  name?: string;
}> = ({ value, setValue, name }) => (
  <button
    type="button"
    aria-pressed={value}
    onClick={() => setValue(!value)}
    className={`relative inline-flex w-10 items-center  cursor-pointer transition-colors focus:outline-none ${
      value ? "bg-blue-600" : "bg-muted-background"
    } ${name ? "h-10 p-0.5 rounded-lg" : "h-6 rounded-full"}`}
  >
    {name ? (
      <div className="flex justify-center items-center w-9 h-9 rounded-md p-1.5 bg-muted-background">
        <Image
          src={`/icons/${name}.svg`}
          alt="logo"
          width={20}
          height={20}
          className="w-full h-full"
        />
      </div>
    ) : (
      <div
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
          value ? "translate-x-[18px]" : "translate-x-[2px]"
        } `}
      />
    )}
  </button>
);
export default Switch;
