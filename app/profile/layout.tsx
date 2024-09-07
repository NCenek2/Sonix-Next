import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Profile",
    description: "Profile Page",
  };

type LayoutProps = {
  children?: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return <>{children}</>;
};

export default Layout;
