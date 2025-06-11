"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Calendar, Search, User, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/events", icon: Search, label: "Explore" },
  { href: "/calendar", icon: Calendar, label: "Calendar" },
  { href: "/profile", icon: User, label: "Profile" },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <div
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200",
                  isActive
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200",
                )}
              >
                <item.icon className={cn("h-5 w-5 mb-1", isActive && "scale-110")} />
                <span className="text-xs font-medium">{item.label}</span>
              </div>
            </Link>
          )
        })}
        <Link href="/events/create" className="flex-1">
          <div className="flex flex-col items-center justify-center py-2 px-3">
            <Button size="sm" className="h-8 w-8 rounded-full p-0 shadow-lg">
              <Plus className="h-4 w-4" />
            </Button>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-1">Create</span>
          </div>
        </Link>
      </div>
    </div>
  )
}
