import { logout } from "@/routes";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Link, usePage } from "@inertiajs/react";


export default function NavUser() {
  const user = usePage().props.auth.user;

  return (
    <Menu>
      <MenuButton className="w-full">{user.name}</MenuButton>
      <MenuItems anchor="top" 
        className="w-52 origin-top-right rounded-xl border border-white/5 bg-white/5 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
      >
        <MenuItem>
          <Link href="#">
            Profile
          </Link>
        </MenuItem>
        <hr />
        <MenuItem>
          <Link href={logout()}>
            Logout
          </Link>
        </MenuItem>
      </MenuItems>
    </Menu>
  )
}