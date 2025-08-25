"use client";

import { withAdminGuard } from "@/guards/WithAdminGuard";

function UsersPage() {
  return <div>UsersPage</div>;
}
export default withAdminGuard(UsersPage);
// export default UsersPage;
