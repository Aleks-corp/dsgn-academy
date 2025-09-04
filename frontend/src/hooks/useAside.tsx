"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function useSelectedPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedPage, setSelectedPage] = useState("");

  useEffect(() => {
    // --- Videos / Aside ---

    if (
      pathname === "/videos" &&
      !searchParams.get("free") &&
      !(searchParams.get("free") === "") &&
      !searchParams.get("category")
    ) {
      setSelectedPage("all-videos");
      return;
    }
    if (
      (pathname === "/videos" && searchParams.get("free")) ||
      searchParams.get("free") === ""
    ) {
      setSelectedPage("free-videos");
      return;
    }
    if (pathname === "/videos" && searchParams.get("category")) {
      setSelectedPage(searchParams.get("category")!);
      return;
    }

    if (pathname === "/shorts") {
      setSelectedPage("shorts");
      return;
    }

    // --- Courses (Aside) ---
    if (pathname === "/courses") {
      setSelectedPage("courses");
      return;
    }

    // --- ProfileAside ---
    if (pathname === "/profile") {
      setSelectedPage("profile");
      return;
    }
    if (pathname === "/profile/security") {
      setSelectedPage("security");
      return;
    }
    if (pathname === "/profile/subscription") {
      setSelectedPage("subscription");
      return;
    }

    // --- AdminAside ---
    if (pathname === "/da-admin/add/video") {
      setSelectedPage("add-video");
      return;
    }
    if (pathname === "/da-admin/add/course") {
      setSelectedPage("add-course");
      return;
    }
    if (pathname === "/da-admin/edit/video") {
      setSelectedPage("edit-video");
      return;
    }
    if (pathname === "/da-admin/edit/course") {
      setSelectedPage("edit-course");
      return;
    }
    if (pathname === "/da-admin/users") {
      setSelectedPage("users");
      return;
    }
    if (pathname === "/da-admin") {
      setSelectedPage("analitics");
      return;
    }

    // --- Default ---
    setSelectedPage("");
  }, [pathname, searchParams]);

  return { selectedPage, setSelectedPage };
}
