import { logout } from "@/routes";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Link, usePage } from "@inertiajs/react";
import { LogOut, Settings } from "lucide-react";

export default function NavUser() {
  const user = usePage().props.auth.user;

  return (
    <div className="w-52 text-right">
      <Menu>
        <MenuButton className="flex w-full flex-col items-start">
          <span className="truncate font-medium">{user.name}</span>
          <span className="text-muted-foreground truncate text-xs">
            {user.email}
          </span>
        </MenuButton>
        <MenuItems
          anchor="top end"
          className="w-52 origin-top-right rounded-xl border border-white/5 bg-white/5 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
        >
          <MenuItem>
            <Link
              href="#"
              role="button"
              className="group mb-1 flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10"
            >
              <Settings className="size-5" />
              Settings
            </Link>
          </MenuItem>
          <div className="bg-foreground -mx-1 my-1 h-px" />
          <MenuItem>
            <Link
              href={logout()}
              className="group mt-1 flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10"
            >
              <LogOut className="size-5" />
              Logout
            </Link>
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  );
}
