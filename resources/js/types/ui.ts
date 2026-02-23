import { ReactNode } from "react";
import { BreadcrumbItem } from "./navigation";

export type SimpleLayoutProps = {
  children?: ReactNode;
  name?: string;
  title?: string;
  description?: string;
};

export type AppLayoutProps = {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
};
