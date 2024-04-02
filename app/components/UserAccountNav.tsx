"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";

const UserAccountNav = () => {
  return (
    <Link
      href={"/sign-in"}
      className="text-error"
      onClick={() =>
        signOut({
          redirect: true,
          callbackUrl: `${window.location.origin}/sign-in`,
        })
      }
    >
      Sign out
    </Link>
  );
};

export default UserAccountNav;
