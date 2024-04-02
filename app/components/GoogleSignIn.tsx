import { Button } from "@/components/ui/button";
import { FC, ReactNode } from "react";

interface GoogleSignInProps {
  children: ReactNode;
}

const GoogleSignIn: FC<GoogleSignInProps> = ({ children }) => {
  const loginWithGoogle = console.log("google");

  return (
    <Button onClick={() => loginWithGoogle} className="w-full">
      {children}
    </Button>
  );
};

export default GoogleSignIn;
