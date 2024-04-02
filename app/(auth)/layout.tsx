import { FC, ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-base-200 p-14 rounded-lg max-w-lg mx-auto">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
