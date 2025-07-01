import { getServerSession } from "next-auth";
import { authOptions } from '../api/auth/authOptions';
import { redirect } from "next/navigation";

// 認証ガード用 親コンポーネント
export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return <>{children}</>;
}