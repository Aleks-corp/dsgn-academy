// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import { useAppSelector } from "@/redux/hooks";
// import { selectAdminUsers } from "@/redux/selectors";
// import moment from "moment";
// import {
//   RiBillLine,
//   RiCalendarCheckLine,
//   RiForbidLine,
//   RiHashtag,
//   RiMailLine,
//   RiMoneyDollarCircleLine,
//   RiPhoneLine,
//   RiPlayLine,
//   RiShieldCheckLine,
//   RiStopLine,
//   RiTimeLine,
//   RiTimerLine,
//   RiUserLine,
// } from "react-icons/ri";

// // Types based on your Table.tsx usage
// export interface UserList {
//   _id: string;
//   name?: string;
//   email?: string;
//   subscription?: "free" | "member" | "admin" | string;
//   status?: string;
//   lastPayedStatus?: string;
//   lastPayedDate?: string | Date | null;
//   orderReference?: string;
//   substart?: string | Date | null;
//   subend?: string | Date | null;
//   regularDateEnd?: string | Date | null;
//   phone?: string;
//   amount?: string | number | null;
//   mode?: string | null; // period
//   isBlocked?: boolean;
// }

// type ColumnId =
//   | "name"
//   | "email"
//   | "subscription"
//   | "status"
//   | "lastPayedStatus"
//   | "lastPayedDate"
//   | "orderReference"
//   | "substart"
//   | "subend"
//   | "regularDateEnd"
//   | "phone"
//   | "amount"
//   | "mode"
//   | "isBlocked";

// type ColumnState = Record<ColumnId, "full" | "collapsed">;

// interface ColumnConfig {
//   id: ColumnId;
//   label: string;
//   icon?: React.ReactNode;
//   sortKey?: keyof UserList;
//   render: (u: UserList) => React.ReactNode;
// }

// export default function UsersTable({
//   currentPage,
//   updateUsers,
//   setUpdateUsers,
// }: {
//   currentPage: number;
//   updateUsers: string[];
//   setUpdateUsers: React.Dispatch<React.SetStateAction<string[]>>;
// }) {
//   const users = useAppSelector(selectAdminUsers);

//   const [sortField, setSortField] = useState<keyof UserList | "">("");
//   const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

//   const USERS_PER_PAGE = 50;

//   // Sticky localStorage column state (optional; keeping structure from original)
//   const defaultColState = useMemo<ColumnState>(
//     () => ({
//       name: "full",
//       email: "full",
//       subscription: "full",
//       status: "full",
//       lastPayedStatus: "full",
//       lastPayedDate: "full",
//       orderReference: "full",
//       substart: "full",
//       subend: "full",
//       regularDateEnd: "full",
//       phone: "full",
//       amount: "full",
//       mode: "full",
//       isBlocked: "full",
//     }),
//     []
//   );
//   const [colState, setColState] = useState<ColumnState>(() => {
//     if (typeof window === "undefined") return defaultColState;
//     try {
//       const saved = localStorage.getItem("users_table_colstate");
//       return saved
//         ? { ...defaultColState, ...JSON.parse(saved) }
//         : defaultColState;
//     } catch {
//       return defaultColState;
//     }
//   });

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       localStorage.setItem("users_table_colstate", JSON.stringify(colState));
//     }
//   }, [colState]);

//   const handleSort = (field: keyof UserList | "") => {
//     if (field === "") {
//       setSortField("");
//       setSortDirection("asc");
//       return;
//     }
//     const direction =
//       sortField === field && sortDirection === "asc" ? "desc" : "asc";
//     setSortField(field);
//     setSortDirection(direction);
//   };

//   const sortedUsers = useMemo(() => {
//     const copy = [...users];
//     if (!sortField) return copy;
//     return copy.sort((a, b) => {
//       const av = (a as any)[sortField];
//       const bv = (b as any)[sortField];
//       if (av == null && bv == null) return 0;
//       if (av == null) return 1;
//       if (bv == null) return -1;
//       if (typeof av === "number" && typeof bv === "number")
//         return sortDirection === "asc" ? av - bv : bv - av;
//       return sortDirection === "asc"
//         ? String(av).localeCompare(String(bv))
//         : String(bv).localeCompare(String(av));
//     });
//   }, [users, sortField, sortDirection]);

//   const start = (currentPage - 1) * USERS_PER_PAGE;
//   const paginatedUsers = sortedUsers.slice(start, start + USERS_PER_PAGE);

//   const COLUMNS: ColumnConfig[] = [
//     {
//       id: "name",
//       label: "Name",
//       icon: <RiUserLine size="1.2em" />,
//       render: (u) => u.name,
//     },
//     {
//       id: "email",
//       label: "Email",
//       icon: <RiMailLine size="1.2em" />,
//       render: (u) => u.email,
//     },
//     {
//       id: "subscription",
//       label: "Subscription",
//       icon: <RiShieldCheckLine size="1.2em" />,
//       render: (u) => (
//         <span
//           className={
//             "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium " +
//             (u.subscription === "free"
//               ? "bg-gray-200 text-gray-700"
//               : u.subscription === "member"
//               ? "bg-gray-700 text-white"
//               : u.subscription === "admin"
//               ? "bg-gray-900 text-white"
//               : "bg-gray-300 text-gray-800")
//           }
//         >
//           {u.subscription || "—"}
//         </span>
//       ),
//     },
//     {
//       id: "status",
//       label: "Status",
//       icon: <RiShieldCheckLine size="1.2em" />,
//       render: (u) => u.status,
//     },
//     {
//       id: "lastPayedStatus",
//       label: "LastPaid Status",
//       icon: <RiBillLine size="1.2em" />,
//       render: (u) => u.lastPayedStatus,
//     },
//     {
//       id: "lastPayedDate",
//       label: "LastPaid Date",
//       icon: <RiCalendarCheckLine size="1.2em" />,
//       render: (u) =>
//         u.lastPayedDate ? moment(u.lastPayedDate).format("DD-MM-YYYY") : "—",
//     },
//     {
//       id: "orderReference",
//       label: "Order Ref",
//       icon: <RiHashtag size="1.2em" />,
//       render: (u) => u.orderReference,
//     },
//     {
//       id: "substart",
//       label: "Sub Start",
//       icon: <RiPlayLine size="1.2em" />,
//       render: (u) =>
//         u.substart ? moment(u.substart).format("DD-MM-YYYY") : "—",
//     },
//     {
//       id: "subend",
//       label: "Sub End",
//       icon: <RiStopLine size="1.2em" />,
//       render: (u) => (u.subend ? moment(u.subend).format("DD-MM-YYYY") : "—"),
//     },
//     {
//       id: "regularDateEnd",
//       label: "Subscription Until",
//       icon: <RiTimerLine size="1.2em" />,
//       render: (u) =>
//         u.regularDateEnd ? moment(u.regularDateEnd).format("DD-MM-YYYY") : "—",
//     },
//     {
//       id: "phone",
//       label: "Phone",
//       icon: <RiPhoneLine size="1.2em" />,
//       render: (u) => u.phone,
//     },
//     {
//       id: "amount",
//       label: "Amount",
//       icon: <RiMoneyDollarCircleLine size="1.2em" />,
//       render: (u) => u.amount,
//     },
//     {
//       id: "mode",
//       label: "Period",
//       icon: <RiTimeLine size="1.2em" />,
//       render: (u) => u.mode,
//     },
//     {
//       id: "isBlocked",
//       label: "Banned",
//       icon: <RiForbidLine size="1.2em" />,
//       render: (u) => (u.isBlocked ? "Yes" : "No"),
//     },
//   ];

//   const toggleCollapse = (id: ColumnId) => {
//     setColState((s) => ({
//       ...s,
//       [id]: s[id] === "full" ? "collapsed" : "full",
//     }));
//   };

//   const handleCheckboxChange = (userId: string, checked: boolean) => {
//     setUpdateUsers((prev) =>
//       checked ? [...prev, userId] : prev.filter((id) => id !== userId)
//     );
//   };

//   return (
//     users.length > 0 && (
//       <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
//         <div className="overflow-x-auto">
//           <table className="min-w-[960px] w-full table-auto text-left">
//             <thead className="sticky top-0 z-10 bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
//               <tr className="border-b border-gray-200 dark:border-gray-700">
//                 <th scope="col" className="w-10 px-3 py-2">
//                   <input
//                     type="checkbox"
//                     className="size-4 rounded border-gray-300 text-gray-900"
//                     disabled
//                   />
//                 </th>
//                 {COLUMNS.map((col) => (
//                   <th
//                     key={col.id}
//                     onClick={() => col.sortKey && handleSort(col.sortKey)}
//                     className={
//                       "select-none px-3 py-3 text-sm font-semibold " +
//                       (col.sortKey ? "cursor-pointer hover:text-gray-900" : "")
//                     }
//                   >
//                     <div className="flex items-center gap-2">
//                       {col.icon}
//                       <span>{col.label}</span>
//                       {sortField === col.sortKey && (
//                         <span className="text-xs opacity-70">
//                           {sortDirection === "asc" ? "▲" : "▼"}
//                         </span>
//                       )}
//                       <button
//                         type="button"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           toggleCollapse(col.id);
//                         }}
//                         className="ml-auto inline-flex h-6 w-6 items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-700"
//                         title="Collapse column"
//                       >
//                         {colState[col.id] === "collapsed" ? "+" : "−"}
//                       </button>
//                     </div>
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {paginatedUsers.map((user) => (
//                 <tr
//                   key={user._id}
//                   className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/60"
//                 >
//                   <th scope="row" className="px-3 py-2">
//                     <input
//                       type="checkbox"
//                       className="size-4 rounded border-gray-300 text-gray-900"
//                       checked={updateUsers.includes(user._id)}
//                       onChange={(e) =>
//                         handleCheckboxChange(user._id, e.target.checked)
//                       }
//                     />
//                   </th>
//                   {COLUMNS.map((col) => (
//                     <td
//                       key={col.id}
//                       className={
//                         "px-3 py-2 text-sm text-gray-800 dark:text-gray-100 " +
//                         (colState[col.id] === "collapsed"
//                           ? "max-w-[160px] truncate"
//                           : "")
//                       }
//                     >
//                       {col.render(user)}
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//             <tfoot>
//               <tr>
//                 <td className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300">
//                   {updateUsers.length > 0 && updateUsers.length}
//                 </td>
//                 <td colSpan={COLUMNS.length} />
//               </tr>
//             </tfoot>
//           </table>
//         </div>
//       </div>
//     )
//   );
// }
