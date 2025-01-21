"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { IoIosMenu } from "react-icons/io";
import { IoIosClose } from "react-icons/io";
import { MdOutlineAccountCircle } from "react-icons/md";
import { Link as ScrollLink } from "react-scroll";
import { useSession } from "next-auth/react";
import UserAccountNav from "./UserAccountNav";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SignInForm from "./form/SignInForm";
import { MdManageAccounts } from "react-icons/md";
import { usePathname } from "next/navigation";

const links = [
  { href: "services", label: "Услуги" },
  { href: "about", label: "За нас" },
];
const LOGO = "/barbershop-logo.png";

const MyNavbar = () => {
  let [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const isMainPage = pathname === "/";

  return (
    <nav className="bg-black bg-opacity-50 ">
      <div className="navbar max-w-full lg:max-w-5xl mx-auto flex-col md:flex-row justify-between relative">
        <div className="flex justify-start ">
          <Link href="/" className="btn btn-primary rounded-lg">
            <div className="w-40 h-18">
              <Image src={LOGO} alt="logo" width={500} height={500} />
            </div>
          </Link>
        </div>
        <div
          onClick={() => setOpen(!open)}
          className="text-3xl text-white absolute right-8 top-4 cursor-pointer md:hidden"
        >
          {!open ? <IoIosMenu /> : <IoIosClose />}
        </div>
        <ul
          className={`menu mt-4 md:mt-0 md:ml-8 flex flex-col md:flex-row items-center ${
            open ? "" : "hidden md:flex"
          }`}
        >
          <li className="md:ml-4 my-0">
            <Link
              className="capitalize text-2xl text-white focus:text-white cursor-pointer drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]"
              href={"/gallery"}
            >
              Галерия
            </Link>
          </li>
          {isMainPage &&
            links.map((link) => (
              <li key={link.href} className="md:ml-4 my-0">
                <ScrollLink
                  activeClass="active"
                  to={link.href}
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
                  className="capitalize text-2xl text-white focus:text-white cursor-pointer drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]"
                >
                  {link.label}
                </ScrollLink>
              </li>
            ))}

          <li className="relative ml-2">
            <Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger className="p-0" asChild>
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn m-1 bg-black bg-opacity-80 px-5"
                  >
                    <div className="flex items-center justify-center w-12 h-12 text-4xl text-white ">
                      {session?.user ? (
                        <MdManageAccounts />
                      ) : (
                        <MdOutlineAccountCircle />
                      )}
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel className="font-medium">
                    Моят Профил
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {session?.user ? (
                    <>
                      {session?.user.email === "krysteffsm@gmail.com" ? (
                        <DropdownMenuItem>
                          <Link href={"/admin"} className="p-2 pr-16">
                            Admin
                          </Link>
                        </DropdownMenuItem>
                      ) : null}
                      <DropdownMenuItem>
                        <Link href={"/my-booking"} className="p-2">
                          Моите часове
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <UserAccountNav />
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DialogTrigger className="p-2 pr-16 cursor-pointer" asChild>
                      <DropdownMenuItem>Влез</DropdownMenuItem>
                    </DialogTrigger>
                  )}
                </DropdownMenuContent>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-center font-normal">
                      Логин
                    </DialogTitle>
                    <SignInForm></SignInForm>
                  </DialogHeader>
                </DialogContent>
              </DropdownMenu>
            </Dialog>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default MyNavbar;
