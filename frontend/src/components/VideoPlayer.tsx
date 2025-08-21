// "use client";

// import Plyr from "plyr-react";
// // import "plyr/dist/plyr.css";

// type VideoFilesProps = {
//   progressive: { link: string; rendition: string; type: string }[];
//   poster?: string;
// };

// export default function VideoPlayer({ progressive }: VideoFilesProps) {
//   const sources = progressive.map((file) => ({
//     src: file.link,
//     type: file.type,
//     size: parseInt(file.rendition.replace("p", "")), // 360, 720, 1080
//   }));

//   return (
//     <Plyr
//       source={{
//         type: "video",
//         sources,
//         poster:
//           "https://i.vimeocdn.com/video/2048162096-1c022e48e9e426fb12c3865c1ecf23823bb7cf73c8b5000619f082a41c3ece6b-d_1280x720?&r=pad&region=us",
//       }}
//       options={{
//         controls: [
//           "play",
//           "progress",
//           "current-time",
//           "mute",
//           "volume",
//           "settings",
//           "pip",
//           "fullscreen",
//         ],
//         settings: ["quality"],
//         keyboard: { focused: true, global: true },
//         vimeo: {
//           byline: true,
//           portrait: false,
//           title: true,
//           speed: true,
//           transparent: true,
//         },
//       }}
//     />
//   );
// }
