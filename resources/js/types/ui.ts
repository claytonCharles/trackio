import { ReactNode } from "react";

export type GuestLayoutProps = {
  children?: ReactNode;
  name?: string;
  title?: string;
  description?: string;
}

export type AuthLayoutProps = {
  children?: ReactNode
}