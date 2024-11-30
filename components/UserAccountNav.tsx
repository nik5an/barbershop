"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";

const UserAccountNav = () => {
  return (
    <Link
      href={"/"}
      className="text-error p-2 pr-16"
      onClick={() =>
        signOut({
          redirect: true,
          callbackUrl: `${window.location.origin}`,
        })
      }
    >
      Излез
    </Link>
  );
};

export default UserAccountNav;
