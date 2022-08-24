import React, { FunctionComponent, PropsWithChildren } from "react";

const Layout: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return (
    <div className="grid h-screen w-screen bg-base-200 auto-rows-auto grid-cols-[75px_30%_2fr]">
      {children}
    </div>
  );
};

export default Layout;
