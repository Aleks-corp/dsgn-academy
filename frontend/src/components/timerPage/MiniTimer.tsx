// "use client";

// import { useAppSelector } from "@/redux/hooks";
// import {
//   selectIsLoadingTest,
//   selectIsTester,
//   selectTimer,
// } from "@/redux/selectors/test.selectors";
// import { useEffect, useState } from "react";

// export function MiniTimer() {
//   const targetTime = useAppSelector(selectTimer);
//   const isLoading = useAppSelector(selectIsLoadingTest);
//   const isTester = useAppSelector(selectIsTester);
//   const [timeLeft, setTimeLeft] = useState(
//     targetTime ? Math.max(targetTime - Date.now(), 0) : 0
//   );

//   useEffect(() => {
//     if (!targetTime) return;
//     const interval = setInterval(() => {
//       const time = Math.max(targetTime - Date.now(), 0);
//       setTimeLeft(time);
//     }, 1000);
//     return () => clearInterval(interval);
//   }, [targetTime]);

//   if (!targetTime || timeLeft <= 0) {
//     return null;
//   }
//   const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
//   const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
//   const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
//   const seconds = Math.floor((timeLeft / 1000) % 60);

//   const pad = (n: number) => String(n).padStart(2, "0");
//   if (isLoading || !isTester) {
//     return null;
//   }

//   return (
//     <p className="font-inter font-light text-foreground tracking-[-1.2px] uppercase select-none">
//       {pad(days)}:{pad(hours)}:{pad(minutes)}:{pad(seconds)}
//     </p>
//   );
// }
