import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Home",
  description: "Home Page",
};

type LayoutProps = {
  children?: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return <>{children}</>;
};

export default Layout;
