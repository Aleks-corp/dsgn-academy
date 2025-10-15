"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  getAllUsers,
  patchUsers,
  banUsers,
  patchCheckSub,
  sendMailToSelected,
} from "@/redux/admin/admin.thunk";
import {
  selectAdminUsers,
  selectAdminLoadingMore,
  selectAdminLoadingUpdate,
  selectAdminLoadingCheck,
  selectTotalFolowers,
} from "@/selectors/admin.selectors";
import Loader from "@/components/loaders/Loader";

import UsersTable from "@/components/admin/UserTable";
import Button from "@/components/buttons/Button";
import toast from "react-hot-toast";

const UsersPage = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectAdminUsers);
  const totalUsers = useAppSelector(selectTotalFolowers);
  const isLoadingMore = useAppSelector(selectAdminLoadingMore);
  const isLoadingUpdate = useAppSelector(selectAdminLoadingUpdate);
  const isLoadingCheck = useAppSelector(selectAdminLoadingCheck);

  const [currentPage, setCurrentPage] = useState(1);
  const [updateUsers, setUpdateUsers] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const USERS_PER_PAGE = 50;

  useEffect(() => {
    dispatch(getAllUsers({}));
  }, [dispatch]);

  const handleSend = async () => {
    setIsLoading(true);
    const res = await dispatch(sendMailToSelected({ usersIds: updateUsers }));
    if (res?.payload.message === "Emails sent") {
      const sent: number = res.payload.sent || 0;
      const failed: number = res.payload.failed || 0;
      const sentEmails: string[] = res.payload.sentEmails || [];
      const failedEmails: string[] = res.payload.failedEmails || [];
      console.log("SentEmails:", sentEmails);
      console.log("FailedEmails:", failedEmails);

      // Тостер на 2 хвилини
      toast.success(
        `✅ Відправлено: ${sent}\n❌ Не відправлено: ${failed}${
          failed > 0 ? `\nДеталі у консолі.` : ""
        }`,
        {
          duration: 120000,
          style: {
            whiteSpace: "pre-line",
          },
        }
      );
      if (failed > 0) {
        setUpdateUsers(failedEmails);
      } else {
        setUpdateUsers([]);
      }

      if (failed > 0) {
        alert(
          `Відправлено: ${sent}\nНе відправлено: ${failed}\n\nНе доставлені листи:\n${failedEmails.join(
            ", "
          )}`
        );
      }
    } else {
      toast.error("Помилка відправки листів", { duration: 10000 });
      alert("Сталася помилка під час відправки листів.");
    }

    setIsLoading(false);
  };

  return (
    <div className="mx-auto w-full px-4 py-6">
      {/* About block */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <p className="mb-2 text-sm font-medium text-foreground">
          About subscription:
        </p>
        <ul className="flex gap-4 space-y-1 text-sm text-foreground">
          <li>
            <span className="font-medium text-muted-foreground">
              All users:
            </span>{" "}
            <span className="opacity-80">({users.length} person)</span>
          </li>
          <li>
            <span className="font-medium text-muted-foreground">Free:</span>{" "}
            <span className="opacity-80">
              ({users.filter((u) => u.subscription === "free").length} person)
            </span>
          </li>
          <li>
            <span className="font-medium text-muted-foreground">Premium:</span>{" "}
            <span className="opacity-80">
              ({users.filter((u) => u.subscription === "premium").length}{" "}
              person)
            </span>
          </li>
          <li>
            <span className="font-medium text-muted-foreground ">Tester:</span>{" "}
            <span className="opacity-80">
              ({users.filter((u) => u.subscription === "tester").length} person)
            </span>
          </li>
          <li>
            <span className="font-medium text-muted-foreground">Admin:</span>{" "}
            <span className="opacity-80">
              ({users.filter((u) => u.subscription === "admin").length} person)
            </span>
          </li>
        </ul>
      </div>

      {users.length > 0 && (
        <>
          <UsersTable
            currentPage={currentPage}
            updateUsers={updateUsers}
            setUpdateUsers={setUpdateUsers}
          />

          {updateUsers.length > 0 && (
            <div className="sticky bottom-4 z-10 mt-4 mx-4 flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white/90 p-3 shadow-lg backdrop-blur">
              {/* Check subscription */}
              {!isLoadingCheck ? (
                <Button
                  type="button"
                  text={"Check subscription"}
                  onClick={() =>
                    dispatch(patchCheckSub({ usersId: updateUsers }))
                  }
                />
              ) : (
                <button
                  type="button"
                  className="btn-gradient inline-flex items-center justify-center shadow-btn rounded-lg px-3 py-2"
                  disabled
                >
                  <Loader />
                </button>
              )}

              {/* Set member for 1 month */}
              {!isLoadingUpdate ? (
                <Button
                  type="button"
                  text="Set sub-tion for 1 month"
                  onClick={() =>
                    dispatch(
                      patchUsers({
                        usersId: updateUsers,
                        subscription: "premium",
                      })
                    )
                  }
                  style="accent"
                />
              ) : (
                <button
                  type="button"
                  className="btn-gradient inline-flex items-center justify-center shadow-btn rounded-lg px-3 py-2"
                  disabled
                >
                  <Loader />
                </button>
              )}

              {/* Set free */}
              {!isLoadingUpdate ? (
                <Button
                  type="button"
                  text="Set Free"
                  onClick={() =>
                    dispatch(
                      patchUsers({ usersId: updateUsers, subscription: "free" })
                    )
                  }
                  style="accent"
                />
              ) : (
                <button
                  type="button"
                  className="btn-gradient inline-flex items-center justify-center shadow-btn rounded-lg px-3 py-2"
                  disabled
                >
                  <Loader />
                </button>
              )}

              {/* Ban / Unban */}
              {!isLoadingUpdate ? (
                <Button
                  type="button"
                  text="Ban | Unban"
                  onClick={() => dispatch(banUsers({ usersId: updateUsers }))}
                  className="bg-red-700"
                  style="accent"
                />
              ) : (
                <button
                  type="button"
                  className="btn-gradient inline-flex items-center justify-center shadow-btn rounded-lg px-3 py-2"
                  disabled
                >
                  <Loader />
                </button>
              )}
              {!isLoading ? (
                <Button
                  type="button"
                  text="Send Mails"
                  onClick={handleSend}
                  className="bg-green-700"
                  style="accent"
                />
              ) : (
                <button
                  type="button"
                  className="btn-gradient inline-flex items-center justify-center shadow-btn rounded-lg px-3 py-2"
                  disabled
                >
                  <Loader />
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          <div className="mt-6 flex flex-wrap gap-2">
            {Array.from(
              { length: Math.ceil(users.length / USERS_PER_PAGE) },
              (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={
                    "font-inter cursor-pointer min-w-9 rounded-lg border px-3 py-1.5 text-sm font-medium " +
                    (currentPage === i + 1
                      ? "border-gray-800 bg-gray-800 text-white "
                      : "border-gray-300 text-gray-800 hover:bg-gray-100 ")
                  }
                >
                  {i + 1}
                </button>
              )
            )}
          </div>

          {/* Load more */}
          <div className="mt-6">
            {isLoadingMore ? (
              <Loader />
            ) : (
              totalUsers > users.length && (
                <button
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 active:bg-gray-200"
                  type="button"
                  onClick={() => {
                    const nextPage = currentPage + 1;
                    setCurrentPage(nextPage);
                    dispatch(
                      getAllUsers({
                        page: nextPage,
                        limit: 500,
                      })
                    );
                  }}
                >
                  <span>Load more</span>
                </button>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
};
export default UsersPage;
