"use client";

import { withAdminGuard } from "@/components/guards&providers/WithAdminGuard";

function UsersPage() {
  return <div>UsersPage</div>;
}
export default withAdminGuard(UsersPage);
// export default UsersPage;
