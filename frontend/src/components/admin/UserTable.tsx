"use client";

import { SetStateAction, useEffect, useRef, useState } from "react";

import { selectAdminUsers } from "@/selectors/admin.selectors";
import moment from "moment";
import {
  ColumnConfig,
  ColumnId,
  ColumnState,
  UserList,
} from "@/types/admin.types";

import {
  RiUserLine,
  RiMailLine,
  RiVipCrownLine,
  RiShieldCheckLine,
  RiBillLine,
  RiCalendarCheckLine,
  RiHashtag,
  RiPlayLine,
  RiStopLine,
  RiTimerLine,
  RiPhoneLine,
  RiMoneyDollarCircleLine,
  RiTimeLine,
  RiForbidLine,
} from "react-icons/ri";
import { useAppSelector } from "@/redux/hooks";

const UsersTable = ({
  currentPage,
  updateUsers,
  setUpdateUsers,
}: {
  currentPage: number;
  updateUsers: string[];
  setUpdateUsers: React.Dispatch<SetStateAction<string[]>>;
}) => {
  const users = useAppSelector(selectAdminUsers);

  const [sortField, setSortField] = useState<keyof UserList | "">("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const USERS_PER_PAGE = 50;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onDown = (e: MouseEvent) => {
      isDown = true;
      el.classList.add("cursor-grabbing");
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };
    const onLeave = () => {
      isDown = false;
      el.classList.remove("cursor-grabbing");
    };
    const onUp = () => {
      isDown = false;
      el.classList.remove("cursor-grabbing");
    };
    const onMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1; // чутливість drag
      el.scrollLeft = scrollLeft - walk;
    };

    el.addEventListener("mousedown", onDown);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("mouseup", onUp);
    el.addEventListener("mousemove", onMove);

    return () => {
      el.removeEventListener("mousedown", onDown);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("mouseup", onUp);
      el.removeEventListener("mousemove", onMove);
    };
  }, []);

  // useEffect(() => {

  //   const el = scrollRef.current;
  //   if (!el) return;
  //   const scrollContainer = document.querySelector<HTMLElement>(
  //     `.${styles.scroll}`
  //   );
  //   if (!scrollContainer) return;
  //   let isDown = false;
  //   let startX: number;
  //   let scrollLeft: number;

  //   const handleMouseDown = (e: MouseEvent) => {
  //     isDown = true;
  //     scrollContainer.classList.add("active");
  //     startX = e.pageX - scrollContainer.offsetLeft;
  //     scrollLeft = scrollContainer.scrollLeft;
  //   };

  //   const handleMouseLeave = () => {
  //     isDown = false;
  //     scrollContainer.classList.remove("active");
  //   };

  //   const handleMouseUp = () => {
  //     isDown = false;
  //     scrollContainer.classList.remove("active");
  //   };

  //   const handleMouseMove = (e: MouseEvent) => {
  //     if (!isDown) return;
  //     e.preventDefault();
  //     const x = e.pageX - scrollContainer.offsetLeft;
  //     const walk = (x - startX) * 1;
  //     scrollContainer.scrollLeft = scrollLeft - walk;
  //   };

  //   scrollContainer.addEventListener("mousedown", handleMouseDown);
  //   scrollContainer.addEventListener("mouseleave", handleMouseLeave);
  //   scrollContainer.addEventListener("mouseup", handleMouseUp);
  //   scrollContainer.addEventListener("mousemove", handleMouseMove);

  //   return () => {
  //     scrollContainer.removeEventListener("mousedown", handleMouseDown);
  //     scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
  //     scrollContainer.removeEventListener("mouseup", handleMouseUp);
  //     scrollContainer.removeEventListener("mousemove", handleMouseMove);
  //   };
  // }, []);

  const handleSort = (field: keyof UserList | "") => {
    if (field === "") {
      setSortField("");
      setSortDirection("asc");
    }
    const direction =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (!sortField) return 0;
    const aValue = a[sortField];
    const bValue = b[sortField];
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    return 0;
  });

  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setUpdateUsers((prev) =>
      checked ? [...prev, id] : prev.filter((userId) => userId !== id)
    );
  };

  const COLUMNS: ColumnConfig[] = [
    {
      id: "name",
      label: "Name",
      icon: <RiUserLine size="1.5em" />,
      render: (u) => u.name,
      sortKey: "name",
    },
    {
      id: "email",
      label: "Email",
      icon: <RiMailLine size="1.5em" />,
      render: (u) => u.email,
      sortKey: "email",
    },
    {
      id: "subscription",
      label: "Subscription",
      icon: <RiVipCrownLine size="1.5em" />,
      render: (u) => u.subscription,
      sortKey: "subscription",
    },
    {
      id: "status",
      label: "Status",
      icon: <RiShieldCheckLine size="1.5em" />,
      render: (u) => u.status,
    },
    {
      id: "lastPayedStatus",
      label: "LastPaid Status",
      icon: <RiBillLine size="1.5em" />,
      render: (u) => u.lastPayedStatus,
    },
    {
      id: "lastPayedDate",
      label: "LastPaid Date",
      icon: <RiCalendarCheckLine size="1.5em" />,
      render: (u) =>
        u.lastPayedDate && moment(u.lastPayedDate).format("DD-MM-YYYY"),
    },
    {
      id: "orderReference",
      label: "Order Ref",
      icon: <RiHashtag size="1.5em" />,
      render: (u) => u.orderReference,
    },
    {
      id: "substart",
      label: "Sub Start",
      icon: <RiPlayLine size="1.5em" />,
      render: (u) => u.substart && moment(u.substart).format("DD-MM-YYYY"),
    },
    {
      id: "subend",
      label: "Sub End",
      icon: <RiStopLine size="1.5em" />,
      render: (u) => u.subend && moment(u.subend).format("DD-MM-YYYY"),
    },
    {
      id: "regularDateEnd",
      label: "Subscription Until",
      icon: <RiTimerLine size="1.5em" />,
      render: (u) =>
        u.regularDateEnd && moment(u.regularDateEnd).format("DD-MM-YYYY"),
    },
    {
      id: "phone",
      label: "Phone",
      icon: <RiPhoneLine size="1.5em" />,
      render: (u) => u.phone,
    },
    {
      id: "amount",
      label: "Amount",
      icon: <RiMoneyDollarCircleLine size="1.5em" />,
      render: (u) => u.amount,
    },
    {
      id: "mode",
      label: "Period",
      icon: <RiTimeLine size="1.5em" />,
      render: (u) => u.mode,
    },
    {
      id: "isBlocked",
      label: "Banned",
      icon: <RiForbidLine size="1.5em" />,
      render: (u) => (u.isBlocked ? "BAN" : ""),
    },
  ];

  const [colState, setColState] = useState<Record<ColumnId, ColumnState>>(
    () => {
      const saved = localStorage.getItem("users_table_colstate");
      return saved
        ? JSON.parse(saved)
        : COLUMNS.reduce((acc, c) => {
            acc[c.id] = "full";
            return acc;
          }, {} as Record<ColumnId, ColumnState>);
    }
  );

  useEffect(() => {
    localStorage.setItem("users_table_colstate", JSON.stringify(colState));
  }, [colState]);

  const toggleCollapse = (id: ColumnId) => {
    setColState((s) => ({
      ...s,
      [id]: s[id] === "full" ? "collapsed" : "full",
    }));
  };

  return (
    users.length > 0 && (
      <div
        ref={scrollRef}
        className="scrollbar-x -mx-16 overflow-x-auto touch-pan-x scroll-smooth cursor-grab rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900"
      >
        <div className="overflow-x-auto">
          <table className="min-w-[960px] w-full table-auto text-left">
            <thead className="sticky top-0 z-10 bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th scope="col" className="w-10 px-3 py-2">
                  <input
                    type="checkbox"
                    className="size-4 rounded border-gray-300 text-gray-900"
                    disabled
                  />
                </th>
                {COLUMNS.map((col) => (
                  <th
                    key={col.id}
                    onClick={() => col.sortKey && handleSort(col.sortKey)}
                    className={
                      "select-none px-3 py-3 text-sm font-semibold " +
                      (col.sortKey ? "cursor-pointer hover:text-gray-900" : "")
                    }
                    style={{
                      width: colState[col.id] === "collapsed" ? "60px" : "auto",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {col.icon}
                      {colState[col.id] !== "collapsed" && (
                        <span>{col.label}</span>
                      )}
                      {sortField === col.sortKey && (
                        <span className="text-xs opacity-70">
                          {sortDirection === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCollapse(col.id);
                        }}
                        className="ml-auto inline-flex h-6 w-6 items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                        title="Collapse column"
                      >
                        {colState[col.id] === "collapsed" ? "+" : "−"}
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/60"
                >
                  <th scope="row" className="px-3 py-2">
                    <input
                      type="checkbox"
                      className="size-4 rounded border-gray-300 text-gray-900"
                      checked={updateUsers.includes(user._id)}
                      onChange={(e) =>
                        handleCheckboxChange(user._id, e.target.checked)
                      }
                    />
                  </th>
                  {COLUMNS.map((col) => (
                    <td
                      key={col.id}
                      className="px-3 py-2 text-sm text-gray-800 dark:text-gray-100"
                      style={{
                        maxWidth:
                          colState[col.id] === "collapsed" ? "60px" : "none",
                        overflow:
                          colState[col.id] === "collapsed"
                            ? "hidden"
                            : "visible",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {col.render(user)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300">
                  {updateUsers.length > 0 && updateUsers.length}
                </td>
                <td colSpan={COLUMNS.length} />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    )
  );
};
export default UsersTable;
