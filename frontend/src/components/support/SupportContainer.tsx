import { useState } from "react";
import SupportBtn from "./SupportBtn";
import SupportMenu from "./SupportMenu";
import { ChatItem } from "@/types/support.type";

function SupportContainer() {
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [chatItems, setChatItems] = useState<Array<ChatItem>>([]);

  return (
    <div className="relative w-full h-full">
      <div className="absolute bottom-5 right-5 z-40">
        <SupportBtn setIsSupportOpen={setIsSupportOpen} />
      </div>
      {isSupportOpen && (
        <div
          className="absolute w-screen h-screen z-40"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsSupportOpen(false);
            }
          }}
        >
          <SupportMenu
            setIsSupportOpen={setIsSupportOpen}
            chatItems={chatItems}
            setChatItems={setChatItems}
            userMessage={userMessage}
            setUserMessage={setUserMessage}
          />
        </div>
      )}
    </div>
  );
}
export default SupportContainer;
