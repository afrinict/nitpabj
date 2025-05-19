import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  change?: {
    value: string;
    trend: "up" | "down";
  };
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  iconColor,
  iconBgColor,
  change,
  className,
}: StatsCardProps) {
  return (
    <div className={cn("bg-white rounded-lg shadow-md p-6 transition-transform hover:-translate-y-1 hover:shadow-lg", className)}>
      <div className="flex items-center">
        <div className={cn("p-3 rounded-full", iconBgColor)}>
          <Icon className={cn("text-xl", iconColor)} />
        </div>
        <div className="ml-4">
          <h2 className="text-sm font-medium text-neutral-600">{title}</h2>
          <p className="text-2xl font-semibold">{value}</p>
          {change && (
            <p
              className={cn(
                "text-xs flex items-center mt-1",
                change.trend === "up" ? "text-green-600" : "text-red-600"
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn(
                  "mr-1 h-3 w-3",
                  change.trend === "down" && "rotate-180"
                )}
              >
                <path d="m5 12 7-7 7 7" />
                <path d="M12 19V5" />
              </svg>
              <span>{change.value}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
