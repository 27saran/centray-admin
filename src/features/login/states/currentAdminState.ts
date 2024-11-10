import { atom } from "recoil";
import { AdminState } from "@/features/login/types";

// ログイン状態のグローバルステート
export const currentAdminState = atom<AdminState | null>({
  key: "currentAdminState",
  default: null,
});
