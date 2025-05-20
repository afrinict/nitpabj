import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Users,
  UserCircle,
  Gavel,
  BarChart4,
  FileText,
  UserRound,
  LogOut,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Vote,
  Wrench,
  CreditCard,
  MessageSquare,
  Share2,
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const { user, logoutMutation } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const links = [
    {
      title: "Dashboard",
      href: "/dashboard",
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
      title: "E-Learning",
      href: "/elearning",
      icon: BookOpen,
    },
    {
      title: "Election",
      href: "/election",
      icon: Vote,
    },
    {
      title: "Chat",
      href: "/chat",
      icon: MessageSquare,
    },
    {
      title: "Social Media",
      href: "/social",
      icon: Share2,
    },
    {
      title: "Tools",
      href: "/tools",
      icon: Wrench,
    },
    {
      title: "Subscription",
      href: "/subscription",
      icon: CreditCard,
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

  return (
    <aside
      className={cn(
        "bg-[#1E5631] text-white border-r border-[#154525] transition-all duration-300",
        collapsed ? "w-20" : "w-64",
        "hidden md:flex md:flex-col h-screen sticky top-0",
        className
      )}
    >
      <div className="p-4 flex items-center border-b border-[#2D7A46]">
        <div
          className={cn(
            "w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1E5631]",
            collapsed && "mx-auto"
          )}
        >
          <span className="font-heading font-bold text-xl">NI</span>
        </div>
        {!collapsed && (
          <div className="ml-3">
            <h1 className="font-heading font-semibold text-lg">NITP</h1>
            <p className="text-xs text-[#D8E9A8]">Abuja Chapter</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-white p-1 rounded hover:bg-[#2D7A46] transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <div className="space-y-1">
          {filteredLinks.map((link) => {
            const isActive = location.pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "flex items-center py-3 rounded-md group",
                  collapsed ? "justify-center px-3" : "px-4",
                  isActive
                    ? "bg-[#2D7A46] text-white"
                    : "text-white hover:bg-[#2D7A46]"
                )}
              >
                <Icon className={cn("w-5 h-5", collapsed ? "mr-0" : "mr-3")} />
                {!collapsed && <span>{link.title}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className={cn("p-4 border-t border-[#2D7A46]")}>
        <div className={cn("flex items-center", collapsed && "justify-center")}>
          <Avatar className="h-8 w-8">
            <AvatarImage src="" />
            <AvatarFallback className="bg-[#3D8361] text-white">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-[#D8E9A8] truncate">
                {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''}
              </p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={handleLogout}
              className="ml-auto text-white hover:text-[#D8E9A8]"
              aria-label="Logout"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
        {collapsed && (
          <button
            onClick={handleLogout}
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "w-full h-8 mt-2 text-white hover:bg-[#2D7A46] hover:text-white"
            )}
            aria-label="Logout"
          >
            <LogOut size={18} />
          </button>
        )}
      </div>
    </aside>
  );
}
