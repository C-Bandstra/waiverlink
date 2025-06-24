import React from "react";

// PageContainer just wraps the routed-to page; might be useful down the line for page updates/notifcations
const PageContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <div className="flex flex-col h-full p-4">{children}</div>;
};

export default PageContainer;
