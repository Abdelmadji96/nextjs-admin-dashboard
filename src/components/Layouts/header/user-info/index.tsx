"use client";

import { ChevronUpIcon } from "@/assets/icons";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useFetch } from "@/hooks/useFetch";
import { getProfile } from "@/services/profile.service";
import type { ProfileResponse } from "@/types/auth";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { LogOutIcon, SettingsIcon, UserIcon } from "./icons";
import { UserInfoSkeleton } from "./user-info-skeleton";

export function UserInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();

  // Fetch profile data using useFetch directly
  const { data: profileData, isLoading } = useFetch<ProfileResponse>(
    ["user-profile"],
    getProfile,
  );

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  // Get user data from profile API
  const user = profileData?.user;

  // Format user display data
  const USER = {
    name:
      user?.first_name && user?.last_name
        ? `${user.first_name} ${user.last_name}`
        : user?.email?.split("@")[0] || "User",
    email: user?.email || "user@example.com",
    reference: user?.reference || "US-ROOT",
    userType: user?.admin_type || user?.user_type || "admin",
    img: "/images/user/user-03.png", // Default avatar
  };

  // Show loading skeleton
  if (isLoading) {
    return <UserInfoSkeleton />;
  }

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger className="rounded align-middle outline-none transition-transform duration-200 hover:scale-105 active:scale-95 ring-primary ring-offset-2 focus-visible:ring-1 dark:ring-offset-gray-dark">
        <span className="sr-only">My Account</span>

        <figure className="flex items-center gap-2 md:gap-3">
          <Image
            src={USER.img}
            className="h-10 w-10 rounded-full object-cover md:h-11 md:w-11"
            alt={`Avatar of ${USER.name}`}
            role="presentation"
            width={200}
            height={200}
          />
          <figcaption className="hidden items-center gap-1 text-sm font-medium text-dark dark:text-dark-6 lg:flex">
            <span className="max-w-[100px] truncate xl:max-w-none">{USER.name}</span>

            <ChevronUpIcon
              aria-hidden
              className={cn(
                "h-4 w-4 rotate-180 transition-transform shrink-0",
                isOpen && "rotate-0",
              )}
              strokeWidth={1.5}
            />
          </figcaption>
        </figure>
      </DropdownTrigger>

      <DropdownContent
        className="border border-stroke bg-white shadow-md dark:border-dark-3 dark:bg-gray-dark min-[230px]:min-w-[17.5rem]"
        align="end"
      >
        <h2 className="sr-only">User information</h2>

        <figure className="flex items-center gap-2.5 px-5 py-3.5">
          <Image
            src={USER.img}
            className="size-12 rounded-full"
            alt={`Avatar for ${USER.name}`}
            role="presentation"
            width={200}
            height={200}
          />

          <figcaption className="space-y-1 text-base font-medium">
            <div className="leading-none text-dark dark:text-white">
              {USER.name}
            </div>

            <div className="mt-1 text-xs leading-none text-gray-6">
              {USER.reference}
            </div>

            <div className="mt-1 text-sm leading-none text-gray-6">
              {USER.email}
            </div>
          </figcaption>
        </figure>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6 [&>*]:cursor-pointer">
          <Link
            href={"/profile"}
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <UserIcon />

            <span className="mr-auto text-base font-medium">View profile</span>
          </Link>

          <Link
            href={"/pages/settings"}
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <SettingsIcon />

            <span className="mr-auto text-base font-medium">
              Account Settings
            </span>
          </Link>
        </div>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6">
          <button
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
            onClick={handleLogout}
          >
            <LogOutIcon />

            <span className="text-base font-medium">Log out</span>
          </button>
        </div>
      </DropdownContent>
    </Dropdown>
  );
}
