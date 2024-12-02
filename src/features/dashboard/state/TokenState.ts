import { atom } from "recoil";
import Cookies from "js-cookie";

// アクセストークンのグローバルステート
export const TokenState = atom<string>({
  key: 'tokenState',
  default: Cookies.get("_access_token"),
});
