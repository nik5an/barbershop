import { MdManageAccounts, MdOutlineAccountCircle } from "react-icons/md";
import { useSession } from "next-auth/react";
import Link from "next/link";
import UserAccountNav from "./UserAccountNav";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SignInForm from "./form/SignInForm";

const UserDropdown = async () => {
  const { data: session } = useSession();

  return (
    <div className="dropdown p-0">
      <div
        tabIndex={0}
        role="button"
        className="btn m-1 bg-black bg-opacity-80"
      >
        <div className="flex items-center justify-center w-12 h-12 text-4xl text-white ">
          {session?.user ? <MdManageAccounts /> : <MdOutlineAccountCircle />}
        </div>
      </div>
      <ul className="dropdown-content z-[1] menu p-1 shadow bg-base-100 rounded-box w-22 absolute top-full -left-4 text-base max-w-full">
        <li>
          {session?.user ? (
            <>
              {session?.user.email === "asd@gmail.com" ? (
                <Link href={"/admin"}>Admin</Link>
              ) : null}
              <Link href={"/my-booking"}>Моите часове</Link>
              <UserAccountNav />
            </>
          ) : (
            <Dialog>
              <DialogTrigger className="w-20">Влез</DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-center font-normal">
                    Логин
                  </DialogTitle>
                  <SignInForm />
                </DialogHeader>
              </DialogContent>
            </Dialog>
          )}
        </li>
      </ul>
    </div>
  );
};

export default UserDropdown;
