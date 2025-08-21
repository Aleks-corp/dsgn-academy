// "use client";

// import { useRef } from "react";
// import {
//   MediaPlayer,
//   MediaPlayerInstance,
//   MediaProvider,
//   useMediaStore,
//   Menu,
//   useVideoQualityOptions,
//   PlayerSrc,
// } from "@vidstack/react";

// import {
//   SettingsIcon,
//   CheckIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
// } from "lucide-react";

// import {
//   DefaultVideoLayout,
//   defaultLayoutIcons,
// } from "@vidstack/react/player/layouts/default";

// // стилі (обов'язково підключити)
// import "@vidstack/react/player/styles/default/theme.css";
// import "@vidstack/react/player/styles/default/layouts/video.css";

// type VideoFilesProps = {
//   progressive: { link: string; rendition: string; type: string }[];
//   cover?: string;
//   title?: string;
// };

// function QualitySubmenu() {
//   const options = useVideoQualityOptions(),
//     currentQuality = options.selectedQuality?.height,
//     hint =
//       options.selectedValue !== "auto" && currentQuality
//         ? `${currentQuality}p`
//         : `Auto${currentQuality ? ` (${currentQuality}p)` : ""}`;
//   console.log("🚀 ~ options:", options);
//   return (
//     <Menu.Root className="vds-menu">
//       <Menu.Button className="vds-menu-button vds-button" aria-label="Settings">
//         <SettingsIcon className="vds-rotate-icon vds-icon" />
//       </Menu.Button>
//       <Menu.Items className="vds-menu-items" placement="top" offset={0}>
//         <Menu.Root className="vds-menu">
//           <SubmenuButton
//             label="Quality"
//             hint={hint}
//             disabled={options.disabled}
//           />
//           <Menu.Content className="vds-menu-items">
//             <Menu.RadioGroup
//               className="vds-radio-group"
//               value={options.selectedValue}
//             >
//               {options.map(({ label, value, bitrateText, select }) => (
//                 <Menu.Radio
//                   className="vds-radio"
//                   value={value}
//                   onSelect={select}
//                   key={value}
//                 >
//                   <CheckIcon className="vds-icon" />
//                   <span className="vds-radio-label">{label}</span>
//                   {bitrateText ? (
//                     <span className="vds-radio-hint">{bitrateText}</span>
//                   ) : null}
//                 </Menu.Radio>
//               ))}
//             </Menu.RadioGroup>
//           </Menu.Content>
//         </Menu.Root>
//       </Menu.Items>
//     </Menu.Root>
//   );
// }

// interface SubmenuButtonProps {
//   label: string;
//   hint: string;
//   disabled?: boolean;
// }

// function SubmenuButton({ label, hint }: SubmenuButtonProps) {
//   return (
//     <Menu.Button className="vds-menu-item">
//       <ChevronLeftIcon className="vds-menu-close-icon" />
//       <SettingsIcon className="vds-icon" />
//       <span className="vds-menu-item-label">{label}</span>
//       <span className="vds-menu-item-hint">{hint}</span>
//       <ChevronRightIcon className="vds-menu-open-icon" />
//     </Menu.Button>
//   );
// }

// export default function VideoPlayer2({
//   progressive,
//   cover,
//   title,
// }: VideoFilesProps) {
//   const sources: PlayerSrc = progressive.map((file) => ({
//     src: file.link,
//     type: "video/mp4" as const,
//     quality: {
//       id: file.rendition,
//       height: parseInt(file.rendition.replace("p", "")),
//       width: parseInt(file.rendition.replace("p", "")),
//       bitrate: parseInt(file.rendition.replace("p", "")),
//     },
//   }));

//   const player = useRef<MediaPlayerInstance>(null);
//   const { paused } = useMediaStore(player);
//   console.log("🚀 ~ paused:", paused);

//   return (
//     <MediaPlayer ref={player} title={title} src={sources} poster={cover}>
//       <MediaProvider />

//       <DefaultVideoLayout
//         icons={defaultLayoutIcons}
//         slots={{
//           googleCastButton: null,
//           settingsMenu: <QualitySubmenu />,
//         }}
//       />
//     </MediaPlayer>
//   );
// }
