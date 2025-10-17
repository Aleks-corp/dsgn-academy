import { subDuration } from "@/constants/sub.desc.constants";
import MaskIcon from "@/components/MaskIcon";

interface ICard {
  title: string;
  subTitle: string;
  description: string[];

  amount?: number;
  submitComponent: React.ReactNode;
  subscription: string;
}
export default function SubCard({
  title,
  subTitle,
  description,
  amount,
  submitComponent,
  subscription,
}: ICard) {
  return (
    <div
      className={
        "relative w-full max-w-[444px] min-w-[340px] pt-3 border-1 border-[#E2E2E2] rounded-[20px] bg-muted-background"
      }
    >
      <div
        className={`absolute top-0 left-0 w-full h-24 ${
          subscription === "free"
            ? "bg-muted-background"
            : subscription === "tester"
            ? "sub-gradient"
            : "bg-[url(/images/bg-s.jpg)]"
        } ${
          subscription === "premiumRemoved" ? "opacity-15" : ""
        } rounded-[20px] bg-bottom-left`}
      ></div>
      <p
        className={`relative px-6 font-inter font-medium text-lg leading-7 tracking-thinest mb-3 z-1 ${
          subscription !== "premium" && subscription !== "tester"
            ? "text-foreground"
            : "text-white"
        } `}
      >
        {title}
      </p>
      <div className="relative p-3 border-1 border-[#E2E2E2] rounded-[20px] bg-text-white z-1">
        <p className="font-inter text-sm leading-5 tracking-thin p-3 mb-3">
          {subTitle}
        </p>
        <div className="flex flex-col gap-2 p-3 bg-icon border-1 border-[#E2E2E2] rounded-[20px] shadow-sub">
          {amount ? (
            amount.toString() === subDuration.MONTH ? (
              <div className="flex">
                <p className="font-inter font-medium text-2xl leading-8 tracking-thin text-muted mt-1">
                  €
                </p>
                <p className="font-inter text-[40px] leading-12 tracking-thinest mr-2">
                  {subDuration.MONTH}
                </p>
                <p className="font-inter font-medium text-xs leading-4 tracking-thin text-muted mt-6 ">
                  EUR / місяць
                </p>
              </div>
            ) : (
              <div className="w-full flex justify-between">
                <div className="flex">
                  <p className="font-inter font-medium text-2xl leading-8 tracking-thin text-muted mt-1">
                    €
                  </p>
                  <p className="font-inter text-[40px] leading-12 tracking-thinest mr-2">
                    {subDuration.PER_MONTH}
                  </p>
                  <div className="ml-2 flex flex-col justify-center">
                    <p className="font-inter font-medium text-xs text-muted leading-4 tracking-thin line-through">
                      €{subDuration.MONTH}
                    </p>
                    <p className="font-inter font-medium text-xs leading-4 tracking-thin text-muted ">
                      EUR / місяць
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-end">
                  <p className="font-inter font-medium text-xs text-muted leading-4 tracking-thin">
                    *€{subDuration.YEAR}
                  </p>
                  <p className="font-inter font-medium text-xs text-muted leading-4 tracking-thin">
                    річна плата
                  </p>
                </div>
              </div>
            )
          ) : (
            <div className="flex">
              <p className="font-inter font-medium text-2xl leading-8 tracking-thin text-muted mt-1">
                €
              </p>
              <p className="font-inter text-[40px] leading-12 tracking-thinest mr-2">
                0
              </p>
              <p className="font-inter font-medium text-xs leading-4 tracking-thin text-muted mt-6 ">
                EUR / місяць
              </p>
            </div>
          )}

          {submitComponent}
        </div>
        <ul className="flex flex-col gap-2 p-3 font-inter text-[13px] leading-5 tracking-thin">
          {description.map((i, idx) => {
            if (description.length === 1) {
              return (
                <li key={idx} className="flex gap-2 items-center">
                  {i}
                </li>
              );
            }

            if (subscription === "free" && idx !== 0) {
              return (
                <li
                  key={idx}
                  className="flex gap-2 items-center text-[#A3A3A3]"
                >
                  <MaskIcon
                    src="/icons/nav-icons/xmark.svg"
                    className="w-4 h-4 text-[#A3A3A3]"
                  />

                  {i}
                </li>
              );
            }
            return (
              <li key={idx} className="flex gap-2 items-center">
                <MaskIcon
                  src="/icons/nav-icons/check.svg"
                  className="w-4 h-4"
                />
                {i}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
