import AppLogoIcon from "@/components/icons/app-logo-icon";
import NavUser from "@/components/nav-user";
import { dashboard, logout } from "@/routes";
import { AuthLayoutProps } from "@/types/ui";
import { Link } from "@inertiajs/react";

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="h-screen w-screen max-w-screen flex bg-sidebar">
      <aside className="h-full w-60 min-w-60 flex flex-col justify-between ">
        <div>
          <div className="flex justify-start items-center p-4">
            <AppLogoIcon className="size-8 fill-current" />
            <p className="text-lg font-semibold ml-2">Trackio</p>
          </div>
          <hr />
          <ul className="p-3">
            <li className="px-2 py-1 rounded hover:bg-sidebar-accent">
              <Link href={dashboard()} className="text-md">
                Dashboard
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <ul className="p-3">
            <li className="px-2 py-1 rounded hover:bg-sidebar-accent">
              <NavUser 
              
              />
              {/* <Link href={logout()} className="text-md">
                Logout
              </Link> */}
            </li>
          </ul>
        </div>
      </aside>
      <main className="w-full overflow-y-scroll px-3 py-2 bg-background">
        {children}
      </main>
    </div>
  )
}