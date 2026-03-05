import type { Auth } from "@/types/auth";

declare module "@inertiajs/core" {
  export interface InertiaConfig {
    sharedPageProps: {
      name: string;
      auth: Auth;
      sidebarOpen: boolean;
      flashMsg?: {
        type: ToastVariant
        message: string
      } | null;
      [key: string]: unknown;
    };
  }
}
