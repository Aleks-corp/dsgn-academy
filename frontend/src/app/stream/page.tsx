"use client";

import { useEffect, useState } from "react";
import { fetchStreamData } from "@/lib/api/getStreamData";
import MaskIcon from "@/components/MaskIcon";
import { useWindowWidth } from "@/hooks/useWindowWidth";

type IStreamData = { videoId: string; title: string; description: string };

function VideoStreamPage() {
  const [streamData, setStreamData] = useState<IStreamData | null>(null);
  const [expanded, setExpanded] = useState(false);

  const { width } = useWindowWidth();

  const handlefetchStreamData = async () => {
    try {
      const res: { data: IStreamData; status: number } =
        await fetchStreamData();
      if (res.status === 200) {
        setStreamData(res.data);
      }
    } catch (error) {
      console.info(error);
    }
  };

  useEffect(() => {
    handlefetchStreamData();
  }, []);

  const domain =
    process.env.NEXT_PUBLIC_STREAM_DOMAIN ||
    (typeof window !== "undefined" ? window.location.hostname : "localhost");
  const [chatError, setChatError] = useState(false);

  const handleChatError = () => {
    console.warn("💬 Чат недоступний або стрім не активний");
    setChatError(true);
  };
  if (!streamData) {
    return null;
  }

  return (
    <div className="flex flex-col lg:flex-row justify-center lg:gap-8 smx-auto">
      <div className="flex flex-col max-w-[calc((100vh-160px)/9*16)] w-full">
        <div className="flex py-4 w-full">
          <h1 className=" text-2xl font-bold leading-7 text-start">
            {streamData.title}
          </h1>
        </div>
        <div className="relative aspect-[16/9] w-auto max-h-[calc(100vh-160px)] rounded-xl overflow-hidden bg-background mb-5">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${streamData.videoId}?autoplay=1&fullscreen&playsinline&theme=light`}
            title={streamData.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; playsinline; fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen={true}
            className="w-full h-full"
          ></iframe>
        </div>{" "}
        <div>
          <p
            className={`whitespace-pre-line transition-all duration-300 ${
              expanded || width >= 1024 ? "line-clamp-none" : "line-clamp-2"
            }`}
          >
            {streamData.description}
          </p>
          {streamData.description &&
            streamData.description.length > 120 &&
            width < 1024 && (
              <div className="w-full flex justify-center translate-y-3">
                <button
                  type="button"
                  onClick={() => setExpanded((prev) => !prev)}
                  className="flex justify-center items-center w-10 h-10 text-muted bg-white font-medium rounded-full hover:text-muted-background cursor-pointer transition-all duration-300 shadow-icon"
                >
                  <div
                    className={` ${
                      !expanded ? "rotate-180" : "rotate-0"
                    } transition-transform duration-300`}
                  >
                    <MaskIcon
                      src="/icons/nav-icons/chevron-up.svg"
                      className="w-6 h-6"
                    />
                  </div>
                </button>
              </div>
            )}
        </div>
      </div>
      <div className="w-full xl:w-96">
        <div className="bg-white rounded-xl shadow-md overflow-hidden h-[600px] max-h-[calc(100vh-160px)] flex flex-col lg:mt-[60px]">
          {/* <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Live Chat</h3>
          </div> */}

          <div className="flex-1 relative">
            {chatError ? (
              <div className="flex items-center justify-center h-full bg-gray-50">
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-2">💬</div>
                  <p>Чат недоступний</p>
                  <p className="text-sm">Можливо, стрім не активний</p>
                </div>
              </div>
            ) : (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/live_chat?v=${streamData.videoId}&embed_domain=${domain}&theme=light`}
                title="Live Chat"
                onError={handleChatError}
              />
            )}
          </div>
        </div>

        {chatError && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">💡 Підказка</h4>
            <p className="text-sm text-blue-700">
              Чат працює тільки під час активної трансляції та на десктопі. На
              мобільних пристроях може не відображатися.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
export default VideoStreamPage;
