import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  // Add scroll padding to account for the mobile bottom navigation
  const [scrollPadding, setScrollPadding] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setScrollPadding(64); // 16rem for the bottom nav
      } else {
        setScrollPadding(0);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <MobileNav />
      
      <main 
        className="flex-1 overflow-y-auto md:pt-0 pt-16 pb-16 md:pb-0"
        style={{ paddingBottom: `${scrollPadding}px` }}
      >
        <div className="px-4 py-6 md:px-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
