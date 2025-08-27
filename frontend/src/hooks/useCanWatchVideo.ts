import { useAppSelector } from "@/redux/hooks";
import { selectUser } from "@/redux/selectors/auth.selectors";

export function useCanWatchVideo() {
  const profile = useAppSelector(selectUser);

  if (!profile) return false;

  // 🚫 Безкоштовний тариф
  if (profile.subscription === "free") return false;

  // 🚫 Free + Declined оплата
  // if (
  //   profile.subscription === "premium" &&
  //   profile.lastPayedStatus === "Declined"
  // ) {
  //   return false;
  // }

  // TODO: додати інші умови
  // приклади:
  // if (profile.banned) return false;
  // if (profile.subscription === "trial" && trialExpired(profile)) return false;

  return true;
}
