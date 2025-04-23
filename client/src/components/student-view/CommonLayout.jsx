import React from "react";
import { Outlet } from "react-router-dom";

function CommonLayout() {
  return <div>CommonLayout
    <Outlet />
  </div>;
}

export default CommonLayout;
