import React from "react";

type Props = {
  children: React.ReactNode;
};

const Layout = (props: Props) => {
  return (
    <div className="h-full w-full  overflow-x-hidden">{props.children}</div>
  );
};

export default Layout;
