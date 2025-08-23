"use client";

import { withAdminGuard } from "@/guards&providers/WithAdminGuard";

function UsersPage() {
  return <div>UsersPage</div>;
}
export default withAdminGuard(UsersPage);
// export default UsersPage;
