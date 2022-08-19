import React, { FunctionComponent, PropsWithChildren } from "react";

const Layout: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return (
    <div className="grid min-h-screen bg-base-200 auto-rows-auto grid-cols-[30%_2fr] place-items-stretch">
      {children}
    </div>
  );
};

export default Layout;
