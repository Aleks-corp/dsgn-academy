// import { motion } from "framer-motion";

type IconInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
> & {
  icon?: React.ReactNode;
  wrapperClassName?: string;
  inputClassName?: string;
  value: string;
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  onChange: (value: string) => void;
};

export default function IconInput({
  wrapperClassName = "",
  inputClassName = "",
  value,
  onChange,
  isExpanded,
  setIsExpanded,
  ...props
}: IconInputProps) {
  return (
    <div
      className={`relative rounded-xl font-inter h-10 
        ${wrapperClassName}`}
    >
      <div
        className={`md:absolute top-0 left-0 z-1 lg:relative lg:w-62 ${
          isExpanded ? "w-36 tab:w-52 md:w-50 lg:w-62" : "w-10"
        } ${inputClassName}`}
      >
        <input
          {...props}
          className={`relative flex z-2 w-full pr-6 lg:pl-9 font-inter font-medium text-xs leading-4 tracking-[-0.12px] h-full border-1 border-border py-3 rounded-xl bg-icon focus:border-border-focus focus:outline-0 ${
            isExpanded ? "pl-9" : ""
          }`}
          placeholder={
            isExpanded || window.innerWidth > 1024 ? "Пошук відео..." : ""
          }
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoFocus={isExpanded}
          onFocus={() => {
            if (window.innerWidth < 1024) {
              setIsExpanded(true);
            }
          }}
          onBlur={() => {
            if (window.innerWidth < 1024 && !value) {
              setIsExpanded(false);
            }
          }}
          onClick={() => {
            if (window.innerWidth < 1024) {
              setIsExpanded(true);
            }
          }}
        />
      </div>
      <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M14 14L11.1 11.1M12.6667 7.33333C12.6667 10.2789 10.2789 12.6667 7.33333 12.6667C4.38781 12.6667 2 10.2789 2 7.33333C2 4.38781 4.38781 2 7.33333 2C10.2789 2 12.6667 4.38781 12.6667 7.33333Z"
            stroke="#7b7b7b"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <div
        className={`absolute top-0 translate-y-[50%] left-52 p-1.5 bg-muted-background rounded-md shadow-count z-2 lg:block ${
          isExpanded ? "hidden lg:block" : "hidden"
        }`}
      >
        <p className="font-inter font-medium text-xs leading-4 tracking-[10.11px] text-muted">
          <svg
            width="20"
            height="8"
            viewBox="0 0 20 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.244 8C1.73067 8 1.32 7.84967 1.012 7.549C0.711333 7.24833 0.561 6.845 0.561 6.339C0.561 5.80367 0.718667 5.38933 1.034 5.096C1.35667 4.79533 1.82967 4.645 2.453 4.645H3.102V3.435H2.453C1.82967 3.435 1.35667 3.28833 1.034 2.995C0.718667 2.69433 0.561 2.27633 0.561 1.741C0.561 1.235 0.711333 0.831667 1.012 0.531C1.32 0.230333 1.73067 0.0799997 2.244 0.0799997C2.65467 0.0799997 2.97733 0.157 3.212 0.310999C3.454 0.465 3.62267 0.670333 3.718 0.927C3.82067 1.18367 3.872 1.466 3.872 1.774V2.687H5.082V1.774C5.082 1.466 5.12967 1.18367 5.225 0.927C5.32767 0.670333 5.49633 0.465 5.731 0.310999C5.973 0.157 6.29933 0.0799997 6.71 0.0799997C7.22333 0.0799997 7.63033 0.230333 7.931 0.531C8.239 0.831667 8.393 1.235 8.393 1.741C8.393 2.27633 8.23533 2.69433 7.92 2.995C7.60467 3.28833 7.13167 3.435 6.501 3.435H5.852V4.645H6.501C7.13167 4.645 7.60467 4.79533 7.92 5.096C8.23533 5.38933 8.393 5.80367 8.393 6.339C8.393 6.845 8.239 7.24833 7.931 7.549C7.63033 7.84967 7.22333 8 6.71 8C6.29933 8 5.973 7.923 5.731 7.769C5.49633 7.615 5.32767 7.40967 5.225 7.153C5.12967 6.89633 5.082 6.614 5.082 6.306V5.393H3.872V6.306C3.872 6.614 3.82067 6.89633 3.718 7.153C3.62267 7.40967 3.454 7.615 3.212 7.769C2.97733 7.923 2.65467 8 2.244 8ZM5.852 1.752V2.687H6.501C6.88967 2.687 7.172 2.61 7.348 2.456C7.524 2.29467 7.612 2.05633 7.612 1.741C7.612 1.41833 7.524 1.18733 7.348 1.048C7.17933 0.908666 6.96667 0.839 6.71 0.839C6.424 0.839 6.20767 0.923333 6.061 1.092C5.92167 1.25333 5.852 1.47333 5.852 1.752ZM2.453 2.687H3.102V1.752C3.102 1.47333 3.02867 1.25333 2.882 1.092C2.74267 0.923333 2.53 0.839 2.244 0.839C1.98733 0.839 1.771 0.908666 1.595 1.048C1.42633 1.18733 1.342 1.41833 1.342 1.741C1.342 2.05633 1.43 2.29467 1.606 2.456C1.782 2.61 2.06433 2.687 2.453 2.687ZM3.872 4.645H5.082V3.435H3.872V4.645ZM2.244 7.241C2.53 7.241 2.74267 7.16033 2.882 6.999C3.02867 6.83033 3.102 6.60667 3.102 6.328V5.393H2.453C2.06433 5.393 1.782 5.47367 1.606 5.635C1.43 5.789 1.342 6.02367 1.342 6.339C1.342 6.66167 1.42633 6.89267 1.595 7.032C1.771 7.17133 1.98733 7.241 2.244 7.241ZM5.852 6.328C5.852 6.60667 5.92167 6.83033 6.061 6.999C6.20767 7.16033 6.424 7.241 6.71 7.241C6.96667 7.241 7.17933 7.17133 7.348 7.032C7.524 6.89267 7.612 6.66167 7.612 6.339C7.612 6.02367 7.524 5.789 7.348 5.635C7.172 5.47367 6.88967 5.393 6.501 5.393H5.852V6.328ZM12.6365 0.145999H14.0115V3.721L17.5095 0.145999H19.2035L16.0685 3.281L19.4235 8H17.7075L15.1335 4.249L14.0115 5.36V8H12.6365V0.145999Z"
              fill="#7B7B7B"
            />
          </svg>
        </p>
      </div>
    </div>
  );
}
