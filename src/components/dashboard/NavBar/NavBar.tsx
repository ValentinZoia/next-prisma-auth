import Link from "next/link";
import React from "react";


import { DropdownMenuMyAccount } from "./DropdownMenu";
import { auth } from "@/auth";
import { Input } from "@/components/ui/input";
import { Bell, Home, MessageSquare, Search, SearchIcon, User } from 'lucide-react'

export default async function NavBar() {
  
  const session = await auth();
  return (
    <>
      

      <nav className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="text-xl font-bold">
            LOGO
          </Link>
          <div className="flex items-center gap-4 list-none">
            <Input
              type="search"
              placeholder="Search..."
              className="hidden md:block w-64 bg-card text-foreground"
              style={{ WebkitBackgroundClip: "none" }}
            />
            <SearchIcon className="md:hidden lg:hidden h-6 w-6" />
            <Link href="/dashboard">
              <Home className="h-6 w-6" />
            </Link>
            <Link href="/dashboard/messages">
              <MessageSquare className="h-6 w-6" />
            </Link>
            <Link href="/dashboard/notifications">
              <Bell className="h-6 w-6" />
            </Link>

            <DropdownMenuMyAccount sessionProp={session} />
          </div>
        </div>
      </nav>
    </>
  );
}
