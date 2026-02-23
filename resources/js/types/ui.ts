import { ReactNode } from "react";

export type SimpleLayoutProps = {
  children?: ReactNode;
  name?: string;
  title?: string;
  description?: string;
}

export type AuthLayoutProps = {
  children?: ReactNode
}