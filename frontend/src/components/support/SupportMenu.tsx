import { useRouter } from "next/navigation";
import Button from "@/components/buttons/Button";
import MaskIcon from "@/components/MaskIcon";
import SafeImage from "@/components/SafeImage";
import { supportItems } from "@/constants/support.constants";
import { useRef, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { selectUser } from "@/redux/selectors/auth.selectors";
import { ChatItem } from "@/types/support.type";
import Image from "next/image";
import { sendToSupport } from "@/lib/api/sendSupport";
import toast from "react-hot-toast";

const isEmail = (str: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);

function SupportMenu({
  setIsSupportOpen,
  chatItems,
  setChatItems,
  userMessage,
  setUserMessage,
}: {
  setIsSupportOpen: React.Dispatch<React.SetStateAction<boolean>>;
  chatItems: ChatItem[];
  setChatItems: React.Dispatch<React.SetStateAction<ChatItem[]>>;
  userMessage: string;
  setUserMessage: React.Dispatch<React.SetStateAction<string>>;
}) {
  const router = useRouter();
  const user = useAppSelector(selectUser);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleSend = async () => {
    let email: string = "";
    const trimmed = userMessage.trim();
    if (!user && isEmail(trimmed)) {
      email = trimmed;
    }
    setChatItems((prev) => [...prev, { sender: "user", message: userMessage }]);
    setUserMessage("");
    if (!user && !isEmail(userMessage.trim())) {
      setChatItems((prev) => [
        ...prev,
        {
          sender: "support",
          message:
            "Будь ласка, залиште свою e-mail адресу, щоб ми змогли з вами звʼязатися 🙂",
        },
      ]);
      return;
    }
    // Логіка відправки повідомлення
    const form = new FormData();
    const userMessages = [
      ...chatItems
        .filter(
          (item) =>
            item.sender === "user" &&
            item.message &&
            !isEmail(item.message.trim())
        )
        .map((item) => item.message),
      !isEmail(trimmed) && trimmed ? trimmed : null,
    ].filter(Boolean);
    form.append("message", userMessages.join("\n"));
    if (email) {
      form.append("email", email);
    } else if (user) {
      form.append("email", user.email);
    }

    if (uploadedFile) {
      form.append("file", uploadedFile);
    }

    const result = await sendToSupport(form);

    if (typeof result === "string") {
      toast.error("Помилка: " + result + " , спробуйте ще раз");
    } else {
      toast.success("Повідомлення успішно відправлено!");
    }
    setChatItems([]);
  };

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserMessage(e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFile(file);
    const url = URL.createObjectURL(file);

    setChatItems((prev) => {
      const filtered = prev.filter(
        (item) =>
          !(
            item.sender === "user" &&
            item.fileUrl &&
            item.fileType?.startsWith("image")
          )
      );
      return [
        ...filtered,
        {
          sender: "user",
          fileUrl: url,
          fileName: file.name,
          fileType: file.type,
        },
      ];
    });
  };

  return (
    <div className="absolute bottom-16 right-5 z-40 flex flex-col justify-between px-2 pb-2 w-90 min-h-[442px] max-h-[calc(100dvh-60px)] overflow-y-auto bg-white border border-[#ECECEC] rounded-2xl shadow-[0_18px_24px_-20px_rgba(0,0,0,0.13),0_2px_0_0_#FFF_inset,0_8px_16px_-12px_rgba(0,0,0,0.08)] backdrop-blur-[6px] font-inter text-foreground">
      <div>
        <div className="flex items-center justify-between px-1 py-4 w-full">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setChatItems([])}
              className="flex justify-center items-center p-1 cursor-pointer mr-3 rounded-full hover:bg-muted-background transition"
            >
              <MaskIcon
                src="/icons/nav-icons/chevron-left.svg"
                className="w-6 h-6"
              />
            </button>
            <div className="w-8 h-8">
              <SafeImage
                src={"/images/support.png"}
                width={32}
                height={32}
                alt="Support Agent"
                className="rounded-full object-cover"
              />
            </div>
            <p className="text-[#4F5053] text-sm font-semibold">
              Dsgn Support
              <span className="block text-[#9D9FA2] font-normal text-[11px]">
                Тут, щоб допомогти
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsSupportOpen(false);
              setChatItems([]);
            }}
            className="w-5 h-5 flex justify-center items-center rounded-full bg-foreground text-background transition cursor-pointer"
          >
            <MaskIcon src="/icons/nav-icons/xmark.svg" className="w-4 h-4" />
          </button>
        </div>
        <p className="p-3 bg-muted-background rounded-2xl rounded-bl-none text-sm leading-5">
          Вітаємо! Ми уважно читаємо кожне звернення. Оберіть зі списку або
          опишіть свою проблему нижче ✨
        </p>

        {chatItems.length !== 0 ? (
          <div className="flex flex-col gap-3 text-xs leading-5 tracking-thin mt-3">
            {chatItems.map((i, idx) => {
              // Якщо є зображення — показуємо його (для юзера чи сапорту)
              if (i.fileUrl && i.fileType?.startsWith("image")) {
                return (
                  <div
                    key={idx}
                    className={`flex ${
                      i.sender === "support" ? "justify-start" : "justify-end"
                    } w-full`}
                  >
                    <Image
                      src={i.fileUrl}
                      alt={i.fileName || "screenshot"}
                      width={160}
                      height={120}
                      className="max-w-[160px] max-h-[120px] rounded-md object-cover"
                    />
                  </div>
                );
              }

              // Якщо це текст — стандартний bubble
              return i.sender === "support" ? (
                <div key={idx} className="flex justify-start w-full">
                  <p className="px-3 py-1.5 bg-muted-background rounded-2xl rounded-bl-none text-sm leading-5">
                    {i.message}
                  </p>
                </div>
              ) : (
                <div key={idx} className="flex justify-end w-full">
                  <p className="px-3 py-1.5 bg-accent rounded-lg text-text-white whitespace-pre-line">
                    {i.message}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 text-xs leading-5 tracking-thin mt-4">
            {supportItems.map((i, idx) => (
              <button
                key={idx}
                onClick={() =>
                  setChatItems([
                    { sender: "user", message: supportItems[idx] },
                    {
                      sender: "support",
                      message:
                        "Будь ласка, опишіть, що саме не так 🙂 Додайте скріншот — і ми швидше все зрозуміємо 🙌",
                    },
                  ])
                }
                className="px-3 py-1.5 bg-muted-background rounded-lg hover:bg-border transition cursor-pointer"
              >
                {i}
              </button>
            ))}
          </div>
        )}
      </div>
      {chatItems.length !== 0 ? (
        <div className="flex items-end bg-white w-full">
          <button type="button" className="cursor-pointer p-1.5">
            <label className="cursor-pointer flex items-center mr-2 p-1.5">
              <input
                type="file"
                name="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />

              <MaskIcon
                src="/icons/menu-icons/tree.svg"
                className="w-5 h-5 text-gray-400 hover:text-gray-600"
              />
            </label>
          </button>
          <label className="relative flex gap-6 items-end w-full bg-muted-background py-1.5 pl-1.5 rounded-xl">
            <textarea
              ref={textareaRef}
              name="userMessage"
              value={userMessage}
              onChange={handleChange}
              placeholder="Reply"
              className="w-full resize-none overflow-y-auto max-h-30 min-h-8 p-1.5 pr-8 text-sm outline-none transition bg-transparent no-scrollbar"
              rows={1}
            />
            <button
              type="button"
              className="absolute bottom-1.5 right-1.5 flex justify-center items-center w-8 h-8 btn-gradient-send  
              p-1.5 rounded-lg cursor-pointer disabled:cursor-default"
              onClick={handleSend}
              disabled={!userMessage.trim()}
            >
              <MaskIcon
                src="/icons/nav-icons/arrow-top.svg"
                className="w-6 h-6 text-foreground"
              />
            </button>
          </label>
        </div>
      ) : (
        <Button
          type="button"
          text="❓ Поширені питання (FAQ)"
          className="w-full mt-2"
          onClick={() => {
            setIsSupportOpen(false);
            router.push("/faq");
          }}
        />
      )}
    </div>
  );
}
export default SupportMenu;
