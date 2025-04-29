import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/auth-context";
import React, { useContext } from "react";

function StudentHomePage() {
  const { resetCredentials } = useContext(AuthContext);
  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
  }
  return (
    <div>
      StudentHomePage
      <Button className="bg-blue-500 text-white" onClick={handleLogout}>
        Click Me
      </Button>
    </div>
  );
}

export default StudentHomePage;
