import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Users,
  UserCircle,
  Gavel,
  BarChart4,
  FileText,
  UserRound,
  LogOut,
  Menu,
  Bell,
  Home,
  FileText as FileIcon,
  User,
} from "lucide-react";

export function MobileNav() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
    setIsOpen(false);
  };

  const links = [
    {
      title: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Members Directory",
      href: "/members",
      icon: Users,
    },
    {
      title: "Executive Committee",
      href: "/executive-committee",
      icon: UserCircle,
    },
    {
      title: "Ethics",
      href: "/ethics",
      icon: Gavel,
    },
    {
      title: "Finance",
      href: "/finance",
      icon: BarChart4,
      showFor: ["admin", "financial_officer"],
    },
    {
      title: "Applications",
      href: "/applications",
      icon: FileText,
    },
    {
      title: "My Profile",
      href: "/profile",
      icon: UserRound,
    },
  ];

  // Filter links based on user role
  const filteredLinks = links.filter(
    (link) => !link.showFor || link.showFor.includes(user?.role || "")
  );

  // Nav items for the bottom nav
  const bottomNavLinks = [
    { title: "Home", href: "/", icon: Home },
    { title: "Members", href: "/members", icon: Users },
    { title: "Applications", href: "/applications", icon: FileIcon },
    { title: "Profile", href: "/profile", icon: User },
  ];

  return (
    <>
      {/* Top Mobile Header */}
      <header className="fixed top-0 left-0 right-0 bg-[#1E5631] text-white h-16 flex items-center justify-between px-4 z-10 md:hidden">
        <div className="flex items-center">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2 text-white">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-[#1E5631] text-white border-r border-[#154525]">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-[#2D7A46] flex items-center">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#1E5631]">
                    <span className="font-heading font-bold text-sm">NI</span>
                  </div>
                  <h1 className="ml-2 font-heading font-semibold">NITP Abuja</h1>
                </div>

                <nav className="flex-1 overflow-y-auto py-4">
                  <div className="space-y-1 px-2">
                    {filteredLinks.map((link) => {
                      const isActive = location === link.href;
                      const Icon = link.icon;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center px-4 py-3 text-white rounded-md",
                            isActive
                              ? "bg-[#2D7A46]"
                              : "hover:bg-[#2D7A46]"
                          )}
                        >
                          <Icon className="w-5 h-5 mr-3" />
                          <span>{link.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                </nav>

                <div className="p-4 border-t border-[#2D7A46]">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-[#3D8361] text-white">
                        {user?.firstName.charAt(0)}
                        {user?.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <p className="text-sm font-medium">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-[#D8E9A8]">
                        {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="ml-auto text-white hover:text-[#D8E9A8]"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#1E5631]">
              <span className="font-heading font-bold text-sm">NI</span>
            </div>
            <h1 className="ml-2 font-heading font-semibold">NITP Abuja</h1>
          </div>
        </div>
        <div>
          <Button variant="ghost" size="icon" className="text-white">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-white ml-1">
            <Avatar className="h-8 w-8 border-2 border-[#D8E9A8]">
              <AvatarImage src="" />
              <AvatarFallback className="bg-[#3D8361] text-white">
                {user?.firstName.charAt(0)}
                {user?.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </header>

      {/* Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 z-10">
        {bottomNavLinks.map((link) => {
          const isActive = location === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col items-center justify-center text-center w-full h-full"
            >
              <Icon
                className={cn(
                  "w-5 h-5",
                  isActive ? "text-[#1E5631]" : "text-gray-600"
                )}
              />
              <span
                className={cn(
                  "text-xs mt-1",
                  isActive ? "text-[#1E5631]" : "text-gray-600"
                )}
              >
                {link.title}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* App content padding for mobile */}
      <div className="md:hidden h-16" />
    </>
  );
}
