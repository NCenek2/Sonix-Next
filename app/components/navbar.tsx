"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NavBar = () => {
  const { data: session } = useSession();
  const [showDropDown, setShowDropDown] = useState(false);
  const pathName = usePathname()

  function SignOut() {
    signOut({ redirect: true, callbackUrl: "/" });
  }

  function SignIn() {
    signIn("google", { redirect: true, callbackUrl: "/posts" });
  }

  const homeStyle = pathName.endsWith("posts") ? "text-white bg-gray-900" : "text-gray-300 hover:bg-gray-700 hover:text-white";
  const profileStyle = pathName.endsWith("profile")
    ? "text-white bg-gray-900"
    : "text-gray-300 hover:bg-gray-700 hover:text-white";

  return (
    <nav className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/*  */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              type="button"
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={() => setShowDropDown((p) => !p)}
            >
              <span className="absolute -inset-0.5"></span>
              <span className="sr-only">Open main menu</span>

              <svg
                className="block h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>

              <svg
                className="hidden h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          {/*  */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <Image
                className="h-8 w-8 rounded-full"
                width={30}
                height={30}
                src="/favicon.ico"
                alt="profile-image"
              />
            </div>
            {session && (
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  <Link
                    href="/posts"
                    className={`block rounded-md px-3 py-2 text-base font-medium ${homeStyle}`}
                  >
                    Home
                  </Link>
                  <Link
                    href="/profile"
                    className={`block rounded-md px-3 py-2 text-base font-medium  ${profileStyle}`}
                  >
                    Profile
                  </Link>
                  <a
                    onClick={() => SignOut()}
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
                  >
                    Log Out
                  </a>
                </div>
              </div>
            )}
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div className="relative ml-3">
              <div>
                <Image
                  className="h-8 w-8 rounded-full"
                  width={30}
                  height={30}
                  src={session?.user?.image ?? "/favicon.ico"}
                  alt="profile-image"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDropDown && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {session && (
              <>
                <Link
                  href="/posts"
                  className={`block rounded-md px-3 py-2 text-base font-medium ${homeStyle}`}
                  aria-current="page"
                >
                  Home
                </Link>
                <Link
                  href="/profile"
                  className={`block rounded-md px-3 py-2 text-base font-medium  ${profileStyle}`}
                >
                  Profile
                </Link>
              </>
            )}
            <a
              onClick={() => (session === null ? SignIn() : SignOut())}
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
            >
              {session === null ? "Sign In" : "Sign Out"}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
