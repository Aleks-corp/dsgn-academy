// "use client";

// import React, { useEffect, useState } from "react";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks";
// import {
//   getAllUsers,
//   patchUsers,
//   banUsers,
//   patchCheckSub,
// } from "@/redux/admin/admin.thunk";
// import {
//   selectAdminUsers,
//   selectAdminLoadingMore,
//   selectAdminLoadingUpdate,
//   selectAdminLoadingCheck,
// } from "@/selectors/auth.selectors";
// import UsersTable from "@/components/UserTable";

// // Optional loader fallback if you don’t have your own component
// function Spinner() {
//   return (
//     <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
//   );
// }

// export default function UsersPage() {
//   const dispatch = useAppDispatch();

//   const users = useAppSelector(selectAdminUsers);
//   const isLoadingMore = useAppSelector(selectAdminLoadingMore);
//   const isLoadingUpdate = useAppSelector(selectAdminLoadingUpdate);
//   const isLoadingCheck = useAppSelector(selectAdminLoadingCheck);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [updateUsers, setUpdateUsers] = useState<string[]>([]);

//   const USERS_PER_PAGE = 50;

//   useEffect(() => {
//     dispatch(getAllUsers({}));
//   }, [dispatch]);

//   return (
//     <div className="mx-auto max-w-7xl px-4 py-6">
//       {/* About block */}
//       <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
//         <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
//           About subscription:
//         </p>
//         <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
//           <li>
//             <span className="font-medium text-gray-800 dark:text-gray-100">
//               Free:
//             </span>{" "}
//             <span className="opacity-80">
//               (without payment, limited access)
//             </span>
//           </li>
//           <li>
//             <span className="font-medium text-gray-800 dark:text-gray-100">
//               Premium:
//             </span>{" "}
//             <span className="opacity-80">
//               (active paid subscription; can watch content)
//             </span>
//           </li>
//           <li>
//             <span className="font-medium text-gray-800 dark:text-gray-100">
//               Tester:
//             </span>{" "}
//             <span className="opacity-80">(180 days; full access)</span>
//           </li>
//           <li>
//             <span className="font-medium text-gray-800 dark:text-gray-100">
//               Admin:
//             </span>{" "}
//             <span className="opacity-80">(all access)</span>
//           </li>
//         </ul>
//       </div>

//       {users.length > 0 && (
//         <>
//           <UsersTable
//             currentPage={currentPage}
//             updateUsers={updateUsers}
//             setUpdateUsers={setUpdateUsers}
//           />

//           {updateUsers.length > 0 && (
//             <div className="sticky bottom-4 z-10 mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white/90 p-3 shadow-lg backdrop-blur dark:border-gray-700 dark:bg-gray-900/90">
//               {/* Check subscription */}
//               <button
//                 type="button"
//                 onClick={() =>
//                   dispatch(patchCheckSub({ usersId: updateUsers }))
//                 }
//                 className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 active:bg-gray-200 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-800"
//               >
//                 {isLoadingCheck ? <Spinner /> : <span>Check subscription</span>}
//               </button>

//               {/* Set member for 1 month */}
//               <button
//                 type="button"
//                 onClick={() =>
//                   dispatch(
//                     patchUsers({ usersId: updateUsers, subscription: "member" })
//                   )
//                 }
//                 className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 active:bg-gray-200 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-800"
//               >
//                 {isLoadingUpdate ? (
//                   <Spinner />
//                 ) : (
//                   <span>Set sub-tion for 1 month</span>
//                 )}
//               </button>

//               {/* Set free */}
//               <button
//                 type="button"
//                 onClick={() =>
//                   dispatch(
//                     patchUsers({ usersId: updateUsers, subscription: "free" })
//                   )
//                 }
//                 className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 active:bg-gray-200 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-800"
//               >
//                 {isLoadingUpdate ? <Spinner /> : <span>Set Free</span>}
//               </button>

//               {/* Ban / Unban */}
//               <button
//                 type="button"
//                 onClick={() => dispatch(banUsers({ usersId: updateUsers }))}
//                 className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 active:bg-gray-200 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-800"
//               >
//                 <span>Ban | Unban</span>
//               </button>
//             </div>
//           )}

//           {/* Pagination */}
//           <div className="mt-6 flex flex-wrap gap-2">
//             {Array.from(
//               { length: Math.ceil(users.length / USERS_PER_PAGE) },
//               (_, i) => (
//                 <button
//                   key={i}
//                   onClick={() => setCurrentPage(i + 1)}
//                   className={
//                     "min-w-9 rounded-lg border px-3 py-1.5 text-sm font-medium " +
//                     (currentPage === i + 1
//                       ? "border-gray-800 bg-gray-800 text-white dark:border-gray-100 dark:bg-gray-100 dark:text-gray-900"
//                       : "border-gray-300 text-gray-800 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-800")
//                   }
//                 >
//                   {i + 1}
//                 </button>
//               )
//             )}
//           </div>

//           {/* Load more */}
//           <div className="mt-6">
//             <button
//               type="button"
//               onClick={() => dispatch(getAllUsers({ loadMore: true }))}
//               className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 active:bg-gray-200 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-800"
//             >
//               {isLoadingMore ? <Spinner /> : <span>Load more</span>}
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }
