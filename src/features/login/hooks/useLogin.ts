import { useState } from "react";
import { useRecoilState, useSetRecoilState, useRecoilValue } from "recoil";
import Cookies from "js-cookie";
import { client } from "@/lib/client";
import { currentAdminState } from "@/features/login/states/currentAdminState";
import { LoginParams, LoginResponse } from "@/features/login/types";
import { TokenState } from "@/features/dashboard/state/TokenState";

export const useLogin = () => {
  const [currentAdmin, setCurrentAdmin] = useRecoilState(currentAdminState);
  const [isAuthCompleted, setIsAuthCompleted] = useState(false);
  const setToken = useSetRecoilState(TokenState);
  const token = useRecoilValue(TokenState);

  const getCurrentAdmin = async () => {
    if (!token) return;
    return await client
      .get(`admin/logged_in`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const data = res.data;
        const { email, name } = data.admin;
        setIsAuthCompleted(data.is_login);
        setCurrentAdmin({ email: email, name: name, roles: data.roles });
        return currentAdmin;
      })
      .catch((err) => {
        setIsAuthCompleted(false);
        console.log("Error Get User Detail", err);
      });
  };

  const handleLogin = async (payload: LoginParams): Promise<LoginResponse | null> => {
    try {
        const res = await client.post("admin/sign_in", payload);
        console.log('rrrrrrrrr: ', res);

        // tokenを取得し、cookieに保存
        const accessToken = res.data.Bearer;
        Cookies.set("_access_token", accessToken);
        setToken(accessToken);
        const roles = res.data.roles;

        const current_admin = await getCurrentAdmin();
        if (current_admin) {
          setIsAuthCompleted(true);
          setCurrentAdmin(current_admin);
        }

        const { email, name } = res.data.admin;
        return { email, name, roles };
      } catch (err) {
        setIsAuthCompleted(false);
        console.log("Login error:", err);
        return null;
      }
  };

  const handleLogout = async () => {
    if (!Cookies.get("_access_token")) return;
    const token = Cookies.get("_access_token");
    try {
      await client.delete("admin/sign_out", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Cookies.remove("_access_token");
      setIsAuthCompleted(false);
      setCurrentAdmin(null);
      localStorage.clear();
    } catch (err) {
      console.log("Logout error:", err);
    }
  };
  return {
    isAuthCompleted,
    handleLogin,
    getCurrentAdmin,
    currentAdmin,
    handleLogout,
  };
};
