import { logout } from "@/routes";
import { Link, router } from "@inertiajs/react";
import { LogOut } from "lucide-react";

export default function Dashboard() {
  const handleLogout = () => {
    router.flushAll();
  };

  return (
    <>
      <h1>Dashboard</h1>
      <Link
        className="block w-full cursor-pointer"
        href={logout()}
        as="button"
        onClick={handleLogout}
        data-test="logout-button"
      >
        <LogOut className="mr-2" />
        Log out
      </Link>
    </>
  )
}