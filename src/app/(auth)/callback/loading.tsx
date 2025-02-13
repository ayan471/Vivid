import React from "react";
import { Loader2 } from "lucide-react";

const AuthLoading = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="animate-spin" />
    </div>
  );
};
export default AuthLoading;
