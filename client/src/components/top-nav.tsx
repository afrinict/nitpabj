import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export function TopNav() {
  const [location] = useLocation();
  const { user } = useAuth();

  const navItems = [
    { title: "Applications", href: "/applications" },
    { title: "Events", href: "/events" },
    { title: "Executives", href: "/executives" },
  ];

  return (
    <header className="hidden md:flex items-center justify-between px-6 py-4 bg-white border-b">
      <div className="flex items-center space-x-8">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-[#1E5631]",
              location === item.href
                ? "text-[#1E5631]"
                : "text-gray-600"
            )}
          >
            {item.title}
          </Link>
        ))}
      </div>
      <div>
        {user ? (
          <Button variant="ghost" className="text-[#1E5631]">
            Profile
          </Button>
        ) : (
          <Link href="/login">
            <Button variant="outline" className="text-[#1E5631] border-[#1E5631] hover:bg-[#1E5631] hover:text-white">
              Login
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
} 