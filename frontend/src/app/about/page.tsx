"use client";

import { useEffect, useState } from "react";

import PolicySection from "@/components/about/Policy";
import CommandSection from "@/components/about/Command";
import FaqSection from "@/components/about/FAQ";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

type TabId = "command" | "policy" | "faq";

export default function AboutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [selectedTab, setSelectedTab] = useState<TabId>("command");

  useEffect(() => {
    const tabFromQuery = searchParams.get("tab") as TabId | null;

    if (
      tabFromQuery === "command" ||
      tabFromQuery === "policy" ||
      tabFromQuery === "faq"
    ) {
      setSelectedTab(tabFromQuery);
    }
  }, [searchParams]);

  const handleTabChange = (tab: TabId) => {
    setSelectedTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full flex flex-col">
      <nav className="relative flex gap-2.5 mb-5 z-10">
        {[
          { id: "command", label: "Про команду" },
          { id: "policy", label: "Політика" },
          { id: "faq", label: "Поширені питання" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id as TabId)}
            className="relative flex items-center justify-center gap-2 px-[10px] py-[11px] text-foreground
             font-inter text-sm font-semibold leading-4 tracking-thin cursor-pointer transition-colors"
          >
            {tab.label}
            {selectedTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-[4px] bg-[#0170FD]" />
            )}
          </button>
        ))}
      </nav>

      {selectedTab === "command" && <CommandSection />}
      {selectedTab === "faq" && <FaqSection />}
      {selectedTab === "policy" && <PolicySection />}
    </div>
  );
}
