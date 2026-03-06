import { AppSidebar } from "@/components/default/app-sidebar";
import { AppSidebarHeader } from "@/components/default/app-sidebar-header";
import { SidebarInset, SidebarProvider } from "@/components/default/sidebar";
import { useFlashToast } from "@/hooks/use-flash-toast";
import { AppLayoutProps } from "@/types/ui";
import { usePage } from "@inertiajs/react";

export default function AppLayout({
  children,
  breadcrumbs = [],
  ...props
}: AppLayoutProps) {
  const isOpen = usePage().props.sidebarOpen;
  useFlashToast()

  return (
    <SidebarProvider defaultOpen={isOpen} {...props}>
      <AppSidebar />
      <SidebarInset className="overflow-x-hidden">
        <AppSidebarHeader breadcrumbs={breadcrumbs} />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
